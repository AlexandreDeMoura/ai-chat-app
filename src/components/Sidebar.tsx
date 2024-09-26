import React from 'react';
import { Conversation } from '../types/types';
import { ReactComponent as ChatIcon } from '../img/chat-icon.svg';
import { ReactComponent as NewChatIcon } from '../img/new-chat.svg';
import { ReactComponent as SavedConvIcon } from '../img/saved-conv.svg';

interface Props {
  conversations: Conversation[];
  currentConversation: string | null;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ conversations, currentConversation, startNewChat, selectConversation }) => {
  const categorizeConversations = (conversations: Conversation[]) => {
    const now = new Date();
    const categories: { [key: string]: Conversation[] } = {
      'Today': [],
      'Yesterday': [],
      'Last 7 days': [],
      'Last 30 days': [],
      'Older': [], // Add an 'Older' category for conversations older than 12 months
    };

    // Add month categories for the last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      categories[date.toLocaleString('default', { month: 'long', year: 'numeric' })] = [];
    }

    conversations.forEach(conv => {
      const lastUpdated = new Date(conv.lastUpdated);
      const diffDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24));
      const diffMonths = (now.getFullYear() - lastUpdated.getFullYear()) * 12 + now.getMonth() - lastUpdated.getMonth();
      
      if (diffDays === 0) {
        categories['Today'].push(conv);
      } else if (diffDays === 1) {
        categories['Yesterday'].push(conv);
      } else if (diffDays <= 7) {
        categories['Last 7 days'].push(conv);
      } else if (diffDays <= 30) {
        categories['Last 30 days'].push(conv);
      } else if (diffMonths < 12) {
        const monthYear = lastUpdated.toLocaleString('default', { month: 'long', year: 'numeric' });
        categories[monthYear].push(conv);
      } else {
        categories['Older'].push(conv);
      }
    });

    // Sort conversations within each category
    Object.values(categories).forEach(categoryConvs => {
      categoryConvs.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    });

    // Filter out empty categories and sort them
    const sortedCategories = Object.entries(categories)
      .filter(([_, convs]) => convs.length > 0)
      .sort(([a], [b]) => {
        const order = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        if (a === 'Older') return 1;
        if (b === 'Older') return -1;
        return new Date(b.split(' ')[0] + ' 1, ' + b.split(' ')[1]).getTime() - 
               new Date(a.split(' ')[0] + ' 1, ' + a.split(' ')[1]).getTime();
      });

    return sortedCategories;
  };

  const categorizedConversations = categorizeConversations(conversations);

  return (
    <div className="w-64 bg-white border-r flex flex-col h-screen overflow-hidden">
      <div className="p-4 border-b">
        <div onClick={startNewChat} className="flex items-center mb-4 cursor-pointer">
          <ChatIcon className="fill-indigo-700 mr-2" />
          <span className="font-semibold text-lg">Chat AI</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categorizedConversations.map(([category, convs]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</h3>
            {convs.map(conv => (
              <div 
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`flex items-center p-2 rounded-lg cursor-pointer group 
                  ${currentConversation === conv.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <SavedConvIcon className={`mr-2 flex-shrink-0 
                  ${currentConversation === conv.id ? 'fill-indigo-700' : 'fill-neutral-600 group-hover:fill-indigo-700'}`} />
                <div className={`truncate 
                  ${currentConversation === conv.id ? 'text-indigo-700' : 'text-neutral-600 group-hover:text-indigo-700'}`}>
                  {conv.title.length > 30 ? `${conv.title.substring(0, 30)}...` : conv.title}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <button 
          onClick={startNewChat}
          className="w-full p-2 mb-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
        >
          <NewChatIcon width={18} height={18} className="mr-2" />
          <span className="text-sm font-medium">Start new chat</span>
        </button>
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-medium mb-1">Let's create an account</h3>
          <p className="text-sm text-gray-600 mb-3">Save your chat history, share chat, and personalize your experience.</p>
          <button className="w-full p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 mb-2">
            Sign in
          </button>
          <button className="w-full p-2 text-purple-500 hover:bg-gray-200 rounded-lg">
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;