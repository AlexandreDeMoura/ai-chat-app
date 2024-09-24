import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSubmit: (input: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3.5 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:py-1.5 focus:mb-1"
        />
        <button type="submit" className="flex justify-center items-center gap-3 px-3.5 py-2.5 rounded bg-indigo-700 text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
         <Send size={20} /> <div className='text-sm font-medium'>Submit</div>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;