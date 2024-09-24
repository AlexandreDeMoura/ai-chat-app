import React from 'react';
import { Mail, Edit3, Calendar, MessageCircle } from 'lucide-react';

const options = [
  { icon: <Mail className="w-6 h-6 text-purple-500" />, title: "Draft email", description: "Generate email for any occasion you need." },
  { icon: <Edit3 className="w-6 h-6 text-green-500" />, title: "Write an Essay", description: "Generate essay for any occasion you need." },
  { icon: <Calendar className="w-6 h-6 text-blue-500" />, title: "Planning", description: "Plan for any occasion, from holiday to family." },
  { icon: <MessageCircle className="w-6 h-6 text-yellow-500" />, title: "Assistant", description: "Become your personal assistant. Helping you." },
];

const Home: React.FC = () => (
  <div className="flex-1 p-8 overflow-y-auto">
    <h1 className="text-3xl font-bold mb-8 text-center">Hey, I'm Chat AI. Your AI assistant and companion for any occasion.</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {options.map((option, index) => (
        <div key={index} className="border p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center mb-4">
            {option.icon}
            <h2 className="font-semibold text-xl ml-4">{option.title}</h2>
          </div>
          <p className="text-gray-600">{option.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Home;