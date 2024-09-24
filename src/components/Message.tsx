import React from 'react';
import { Message as MessageType } from '../types/types';

interface Props {
  message: MessageType;
}

const Message: React.FC<Props> = ({ message }) => (
  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
      {message.text}
    </div>
  </div>
);

export default Message;