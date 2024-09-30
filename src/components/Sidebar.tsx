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
import { useTranslation } from 'react-i18next';

interface Props {
  conversations: Conversation[];
  currentConversation: string | null;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ conversations, currentConversation, startNewChat, selectConversation }) => {
  const { t } = useTranslation();
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
      [t('sidebar.today', 'Today')]: [],
      [t('sidebar.yesterday', 'Yesterday')]: [],
      [t('sidebar.last7Days', 'Last 7 days')]: [],
      [t('sidebar.last30Days', 'Last 30 days')]: [],
      [t('sidebar.older', 'Older')]: [],
    };

    // Add month categories for the last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = t('date.monthYear', '{{month}} {{year}}', {
        month: t(`months.${date.getMonth()}`),
        year: date.getFullYear()
      });
      categories[monthYear] = [];
    }

    conversations.forEach(conv => {
      const lastUpdated = new Date(conv.lastUpdated);
      const diffDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24));
      const diffMonths = (now.getFullYear() - lastUpdated.getFullYear()) * 12 + now.getMonth() - lastUpdated.getMonth();
      
      if (diffDays === 0) {
        categories[t('sidebar.today', 'Today')].push(conv);
      } else if (diffDays === 1) {
        categories[t('sidebar.yesterday', 'Yesterday')].push(conv);
      } else if (diffDays <= 7) {
        categories[t('sidebar.last7Days', 'Last 7 days')].push(conv);
      } else if (diffDays <= 30) {
        categories[t('sidebar.last30Days', 'Last 30 days')].push(conv);
      } else if (diffMonths < 12) {
        const monthYear = t('date.monthYear', '{{month}} {{year}}', {
          month: t(`months.${lastUpdated.getMonth()}`),
          year: lastUpdated.getFullYear()
        });
        categories[monthYear].push(conv);
      } else {
        categories[t('sidebar.older', 'Older')].push(conv);
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
        const order = [t('sidebar.today', 'Today'), t('sidebar.yesterday', 'Yesterday'), t('sidebar.last7Days', 'Last 7 days'), t('sidebar.last30Days', 'Last 30 days')];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        if (a === t('sidebar.older', 'Older')) return 1;
        if (b === t('sidebar.older', 'Older')) return -1;
        return new Date(b.split(' ')[1]).getTime() - new Date(a.split(' ')[1]).getTime();
      });

    return sortedCategories;
  };

  const categorizedConversations = categorizeConversations(conversations);

  const toggleSettingsPopup = () => {
    setShowSettingsPopup((prev) => !prev);
    setShowPopup(false);
  };

  return (
    <div className={`w-64 border-r flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-4 border-b">
        <div onClick={startNewChat} className="flex items-center cursor-pointer">
          <ChatIcon className="fill-indigo-700 mr-2" />
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('app.title')}</span>
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
            {t('app.newChat')}
          </span>
        </button>
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
                  {t('app.settings')}
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
                  {t('app.signOut')}
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