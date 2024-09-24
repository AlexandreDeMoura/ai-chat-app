import React from 'react';
import { ReactComponent as DraftEmailIcon } from '../img/draft-email.svg';
import { ReactComponent as WriteEssayIcon } from '../img/write-essay.svg';
import { ReactComponent as AssistantIcon } from '../img/assistant.svg';
import { ReactComponent as PlanningIcon } from '../img/planning.svg';

const optionsData = [
  { icon: <DraftEmailIcon className="w-6 h-6 text-purple-500" />, title: "Draft email", description: "Generate email for any occasion you need.", bgColor: "bg-indigo-50" },
  { icon: <WriteEssayIcon className="w-6 h-6 text-green-500" />, title: "Write an Essay", description: "Generate essay for any occasion you need.", bgColor: "bg-green-50" },
  { icon: <PlanningIcon className="w-6 h-6 text-blue-500" />, title: "Planning", description: "Plan for any occasion, from holiday to family.", bgColor: "bg-fuchsia-50" },
  { icon: <AssistantIcon className="w-6 h-6 text-yellow-500" />, title: "Assistant", description: "Become your personal assistant. Helping you.", bgColor: "bg-amber-50" },
];

const Option: React.FC<{ icon: React.ReactNode, title: string, description: string, bgColor: string }> = ({ icon, title, description, bgColor }) => (
  <div className="flex flex-col justify-center items-center border p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
    <div className={`flex p-2 items-center justify-center mb-4 rounded-lg ${bgColor}`}>
        {icon}
    </div>
    <h2 className="font-semibold text-xl text-center mb-2">{title}</h2>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const Home: React.FC = () => (
  <div className="flex-1 p-8 overflow-y-auto">
    <h1 className="text-3xl font-bold mb-24 text-center">
      <span className="text-gray-900">Hey, I'm Chat AI.</span> <span className="text-neutral-600">Your AI assistant and companion for any occasion.</span>
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {optionsData.map((option, index) => (
        <Option key={index} icon={option.icon} title={option.title} description={option.description} bgColor={option.bgColor} />
      ))}
    </div>
  </div>
);

export default Home;