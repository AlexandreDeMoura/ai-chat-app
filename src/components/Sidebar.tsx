import React from 'react';
import { Conversation } from '../types/types';
import { ReactComponent as ChatIcon } from '../img/chat-icon.svg';
import { ReactComponent as OngoingPromptIcon } from '../img/ongoing-prompt.svg';
import { ReactComponent as NewChatIcon } from '../img/new-chat.svg';

interface Props {
  conversations: Conversation[];
  currentConversation: string | null;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ conversations, currentConversation, startNewChat, selectConversation }) => (
  <div className="w-64 bg-white border-r flex flex-col h-screen overflow-hidden">
    <div className="p-4 border-b">
      <div className="flex items-center mb-4">
        <ChatIcon className="text-purple-500 mr-2" />
        <span className="font-semibold text-lg">Chat AI</span>
      </div>
      <div className="flex items-center text-gray-600">
        <OngoingPromptIcon className="mr-2" width={18} height={18} />
        <span className="text-sm">Ongoing prompt</span>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {conversations.map(conv => (
        <div 
          key={conv.id}
          onClick={() => selectConversation(conv.id)}
          className={`p-2 rounded-lg cursor-pointer ${currentConversation === conv.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          {conv.title}
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

export default Sidebar;