// Chat.tsx (Main component)
import React, { useState } from 'react';
import { Conversation, Message as MessageType } from './types/types';
import Sidebar from './components/Sidebar';
import Home from './screens/Home';
import CurrentConversation from './screens/CurrentConversations';
import MessageInput from './components/MessageInput';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [showHome, setShowHome] = useState(true);

  const simulateAIResponse = (convId: string) => {
    setTimeout(() => {
      const aiResponse: MessageType = { text: "This is a simulated AI response.", isUser: false };
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === convId 
            ? { ...conv, messages: [...conv.messages, aiResponse] }
            : conv
        )
      );
    }, 1000);
  };

  const handleSubmit = (input: string) => {
    if (input.trim()) {
      const newMessage: MessageType = { text: input, isUser: true };
      if (currentConversation) {
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === currentConversation 
              ? { ...conv, messages: [...conv.messages, newMessage] }
              : conv
          )
        );
        simulateAIResponse(currentConversation);
      } else {
        const newConversationId = Date.now().toString();
        const newConversation: Conversation = {
          id: newConversationId,
          title: input.slice(0, 30),
          messages: [newMessage]
        };
        setConversations(prev => [...prev, newConversation]);
        setCurrentConversation(newConversationId);
        simulateAIResponse(newConversationId);
      }
      setShowHome(false);
    }
  };

  const startNewChat = () => {
    setCurrentConversation(null);
    setShowHome(true);
  };

  const selectConversation = (id: string) => {
    setCurrentConversation(id);
    setShowHome(false);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar 
        conversations={conversations}
        currentConversation={currentConversation}
        startNewChat={startNewChat}
        selectConversation={selectConversation}
      />
      <div className="flex-1 flex flex-col">
        {showHome 
          ? <Home /> 
          : <CurrentConversation 
              conversation={conversations.find(conv => conv.id === currentConversation)}
            />
        }
        <MessageInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default App;
