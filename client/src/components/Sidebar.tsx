import React, { useState, useContext } from 'react';
import { Conversation } from '../types/types';
import ProfilPicture from '../img/alex_2.jpg';
import { ReactComponent as ChatIcon } from '../img/chat-icon.svg';
import { ReactComponent as NewChatIcon } from '../img/new-chat.svg';
import { ReactComponent as SavedConvIcon } from '../img/saved-conv.svg';
import { ReactComponent as MoreLineIcon } from '../img/more-line.svg';
import SettingsPopup from './SettingsPopup';
import { ThemeContext } from '../context/ThemeContext';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import OptionsPopup from './OptionsPopup';
import handleDatesCategorization from '../utils/handleDatesCategorization';
import { ReactComponent as KeyIcon } from '../img/key-icon.svg';
import ApiKeyPopup from './ApiKeyPopup';

interface Props {
  conversations: Conversation[];
  currentConversation: string | null;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ conversations, currentConversation, startNewChat, selectConversation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showApiKeyPopup, setShowApiKeyPopup] = useState(false);

  const categorizedConversations = handleDatesCategorization(conversations);

  const toggleSettingsPopup = () => {
    setShowSettingsPopup((prev) => !prev);
    setShowOptionsPopup(false);
  };

  return (
    <div data-testid="sidebar" className={`w-64 border-r flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-4 border-b">
        <div onClick={startNewChat} className="flex items-center cursor-pointer">
          <ChatIcon className="fill-indigo-700 mr-2" />
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('app.title')}</span>
        </div>
        <button
          onClick={() => setShowApiKeyPopup(true)}
          className={classNames(
            "flex items-center w-full pl-1 py-2 mt-2 text-sm",
            {
              "text-gray-700": theme !== 'dark',
              "text-gray-300": theme === 'dark'
            }
          )}
        >
          <KeyIcon className={`mr-2 w-5 h-5 ${theme === 'dark' ? 'fill-gray-300' : 'fill-gray-700'}`} />
          {t('app.apiKeySetup')}
        </button>
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
              onClick={() => setShowOptionsPopup((prev) => !prev)}
            >
              <MoreLineIcon className={classNames('w-6 h-6', { 'fill-white': theme === 'dark' })} />
            </button>
            <OptionsPopup
              isOpen={showOptionsPopup}
              onClose={() => setShowOptionsPopup(false)}
              onSettingsClick={toggleSettingsPopup}
            />
          </div>
        </div>
      </div>
      {showSettingsPopup && <SettingsPopup onClose={toggleSettingsPopup} />}
      {showApiKeyPopup && <ApiKeyPopup onClose={() => setShowApiKeyPopup(false)} />}
    </div>
  );
};

export default Sidebar;