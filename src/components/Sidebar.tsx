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
  // Sort conversations by lastUpdated
  const sortedConversations = [...conversations].sort((a, b) => 
    b.lastUpdated.getTime() - a.lastUpdated.getTime()
  );

  return (
    <div className="w-64 bg-white border-r flex flex-col h-screen overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center mb-4">
          <ChatIcon className="fill-indigo-700 mr-2" />
          <span className="font-semibold text-lg">Chat AI</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedConversations.map(conv => (
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