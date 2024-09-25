import React, { useRef, useEffect } from 'react';
import { Conversation } from '../types/types';
import Message from '../components/Message';

interface Props {
  conversation?: Conversation;
}

const CurrentConversation: React.FC<Props> = ({ conversation }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [conversation?.messages]);

  if (!conversation) return null;

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto space-y-4 py-4 md:px-8 lg:px-20 xl:px-36 pt-8 lg:pt-16 scrollbar-gutter-stable"
        style={{
          scrollPadding: '0 144px'
        }}
      >
        {conversation.messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
};

export default CurrentConversation;