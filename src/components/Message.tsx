import React from 'react';
import { Message as MessageType } from '../types/types';
import { ReactComponent as ChatIcon } from '../img/chat-icon.svg';

interface Props {
  message: MessageType;
}

const Message: React.FC<Props> = ({ message }) => (
  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex items-start max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
      message.isUser 
        ? 'bg-gray-50 text-gray-800' 
        : 'bg-white text-gray-800 border border-gray-200'
    }`}>
      {!message.isUser && (
        <ChatIcon className="w-6 h-6 mr-2 flex-shrink-0 fill-indigo-700" />
      )}
      <div>{message.text}</div>
    </div>
  </div>
);

export default Message;