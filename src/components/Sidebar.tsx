import React from 'react';
import { Conversation } from '../types/types';
import { PlusCircle } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  currentConversation: string | null;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ conversations, currentConversation, startNewChat, selectConversation }) => (
  <div className="w-64 bg-gray-100 border-r flex flex-col h-screen overflow-hidden">
    <div className="p-4">
      <button 
        onClick={startNewChat}
        className="w-full p-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
      >
        <PlusCircle size={20} className="mr-2" />
        Start new chat
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {conversations.map(conv => (
        <div 
          key={conv.id}
          onClick={() => selectConversation(conv.id)}
          className={`p-2 rounded-lg cursor-pointer ${currentConversation === conv.id ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
        >
          {conv.title}
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;