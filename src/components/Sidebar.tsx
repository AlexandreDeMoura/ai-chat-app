import React, { useState, useRef, useEffect, useContext } from 'react';
import { Conversation } from '../types/types';
import ProfilPicture from '../img/alex_2.jpg';
import { ReactComponent as ChatIcon } from '../img/chat-icon.svg';
import { ReactComponent as NewChatIcon } from '../img/new-chat.svg';
import { ReactComponent as SavedConvIcon } from '../img/saved-conv.svg';
import { ReactComponent as MoreLineIcon } from '../img/more-line.svg';
import { ReactComponent as LogoutIcon } from '../img/logout.svg';
import { ReactComponent as SettingsIcon } from '../img/settings.svg';
import SettingsPopup from './SettingsPopup';
import { ThemeContext } from '../context/ThemeContext';
import classNames from 'classnames';

interface Props {
  conversations: Conversation[];
  currentConversation: string | null;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ conversations, currentConversation, startNewChat, selectConversation }) => {
  const { theme } = useContext(ThemeContext);
  const [showPopup, setShowPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false); 
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categorizeConversations = (conversations: Conversation[]) => {
    const now = new Date();
    const categories: { [key: string]: Conversation[] } = {
      'Today': [],
      'Yesterday': [],
      'Last 7 days': [],
      'Last 30 days': [],
      'Older': [],
    };

    // Add month categories for the last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      categories[date.toLocaleString('default', { month: 'long', year: 'numeric' })] = [];
    }

    conversations.forEach(conv => {
      const lastUpdated = new Date(conv.lastUpdated);
      const diffDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24));
      const diffMonths = (now.getFullYear() - lastUpdated.getFullYear()) * 12 + now.getMonth() - lastUpdated.getMonth();
      
      if (diffDays === 0) {
        categories['Today'].push(conv);
      } else if (diffDays === 1) {
        categories['Yesterday'].push(conv);
      } else if (diffDays <= 7) {
        categories['Last 7 days'].push(conv);
      } else if (diffDays <= 30) {
        categories['Last 30 days'].push(conv);
      } else if (diffMonths < 12) {
        const monthYear = lastUpdated.toLocaleString('default', { month: 'long', year: 'numeric' });
        categories[monthYear].push(conv);
      } else {
        categories['Older'].push(conv);
      }
    });

    // Sort conversations within each category
    Object.values(categories).forEach(categoryConvs => {
      categoryConvs.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    });

    // Filter out empty categories and sort them
    const sortedCategories = Object.entries(categories)
      .filter(([_, convs]) => convs.length > 0)
      .sort(([a], [b]) => {
        const order = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        if (a === 'Older') return 1;
        if (b === 'Older') return -1;
        return new Date(b.split(' ')[0] + ' 1, ' + b.split(' ')[1]).getTime() - 
               new Date(a.split(' ')[0] + ' 1, ' + a.split(' ')[1]).getTime();
      });

    return sortedCategories;
  };

  const categorizedConversations = categorizeConversations(conversations);

  const toggleSettingsPopup = () => {
    setShowSettingsPopup((prev) => !prev);
    setShowPopup(false); // Close the more options popup
  };

  return (
    <div className={`w-64 border-r flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-4 border-b">
        <div onClick={startNewChat} className="flex items-center cursor-pointer">
          <ChatIcon className="fill-indigo-700 mr-2" />
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Chat AI</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categorizedConversations.map(([category, convs]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</h3>
            {convs.map(conv => (
              <div 
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={classNames(
                  'flex items-center p-2 rounded-lg cursor-pointer group',
                  {
                    'bg-gray-100': currentConversation === conv.id && theme !== 'dark',
                    'bg-gray-700': currentConversation === conv.id && theme === 'dark',
                    'hover:bg-gray-50': currentConversation !== conv.id && theme !== 'dark',
                    'hover:bg-gray-700': currentConversation !== conv.id && theme === 'dark'
                  }
                )}
              >
                <SavedConvIcon className={classNames(
                  'mr-2 flex-shrink-0',
                  {
                    'fill-indigo-700': currentConversation === conv.id && theme !== 'dark',
                    'fill-indigo-400': currentConversation === conv.id && theme === 'dark',
                    'fill-neutral-600': currentConversation !== conv.id && theme !== 'dark',
                    'fill-white': currentConversation !== conv.id && theme === 'dark',
                    'group-hover:fill-indigo-700': currentConversation !== conv.id && theme !== 'dark',
                    'group-hover:fill-indigo-400': currentConversation !== conv.id && theme === 'dark'
                  }
                )} />
                <div className={classNames(
                  'truncate',
                  {
                    'text-indigo-700': currentConversation === conv.id && theme !== 'dark',
                    'text-indigo-400': currentConversation === conv.id && theme === 'dark',
                    'text-neutral-600': currentConversation !== conv.id && theme !== 'dark',
                    'text-gray-300': currentConversation !== conv.id && theme === 'dark',
                    'group-hover:text-indigo-700': currentConversation !== conv.id && theme !== 'dark',
                    'group-hover:text-indigo-400': currentConversation !== conv.id && theme === 'dark'
                  }
                )}>
                  {conv.title.length > 30 ? `${conv.title.substring(0, 30)}...` : conv.title}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
      <button 
          onClick={startNewChat}
          className={classNames("w-full p-2 mb-4 border border-gray-300 rounded-lg flex items-center justify-center shadow-sm", {
            'bg-gray-700 text-white hover:bg-gray-600': theme === 'dark',
            'bg-white text-gray-700 hover:bg-gray-50': theme !== 'dark' 
          })}
        >
          <NewChatIcon width={18} height={18} className="mr-2" fill={theme === 'dark' ? 'white' : 'black'} /> 
          <span className="text-sm font-medium">
            Start new chat
          </span>
        </button>
        {/* <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-medium mb-1">Let's create an account</h3>
          <p className="text-sm text-gray-600 mb-3">Save your chat history, share chat, and personalize your experience.</p>
          <button className="w-full p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 mb-2">
            Sign in
          </button>
          <button className="w-full p-2 text-purple-500 hover:bg-gray-200 rounded-lg">
            Create account
          </button>
        </div> */}
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="flex items-center">
            <img src={ProfilPicture} alt="Profile" className="w-6 h-6 rounded-full mr-2" />
            <span className={classNames("font-medium text-base", {
              'text-white': theme === 'dark',
              'text-black': theme !== 'dark'
            })}>Alexandre</span>
          </div>
          <div className="relative">
            <button 
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setShowPopup((prev) => !prev)}
            >
              <MoreLineIcon className={classNames('w-6 h-6', {'fill-white': theme === 'dark'})}/>
            </button>
            {showPopup && (
              <div 
                ref={popupRef}
                className={classNames(
                  "absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-xl border py-1 z-50",
                  {
                    "bg-white border-gray-200": theme !== 'dark',
                    "bg-gray-800 border-gray-700": theme === 'dark'
                  }
                )}
              >
                <button 
                  onClick={toggleSettingsPopup} 
                  className={classNames(
                    "flex items-center px-4 py-2 text-sm w-full",
                    {
                      "text-gray-700 hover:bg-gray-100": theme !== 'dark',
                      "text-gray-300 hover:bg-gray-700": theme === 'dark'
                    }
                  )}
                >
                  <SettingsIcon className={`mr-2 w-5 h-5 ${theme === 'dark' ? 'fill-gray-300' : 'fill-gray-700'}`} />
                  Settings
                </button>
                <button 
                  className={classNames(
                    "flex items-center px-4 py-2 text-sm w-full",
                    {
                      "text-gray-700 hover:bg-gray-100": theme !== 'dark',
                      "text-gray-300 hover:bg-gray-700": theme === 'dark'
                    }
                  )}
                >
                  <LogoutIcon className={`mr-2 w-5 h-5 ${theme === 'dark' ? 'fill-gray-300' : 'fill-gray-700'}`} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSettingsPopup && <SettingsPopup onClose={toggleSettingsPopup} />}
    </div>
  );
};

export default Sidebar;