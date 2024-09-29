import React, { useRef, useEffect, useContext } from 'react';
import { ReactComponent as CloseIcon } from '../img/close.svg';
import { ThemeContext } from '../context/ThemeContext';
import classNames from 'classnames';

interface Props {
  onClose: () => void;
}

const SettingsPopup: React.FC<Props> = ({ onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={popupRef}
        className={classNames(
          "rounded-md shadow-xl border p-6 w-96 max-w-full relative",
          {
            "bg-white border-gray-200": theme !== 'dark',
            "bg-gray-800 border-gray-700": theme === 'dark'
          }
        )}
      >
        <button
          onClick={onClose}
          className={classNames(
            "absolute top-2 right-2 transition-colors",
            {
              "text-gray-500 hover:text-gray-700": theme !== 'dark',
              "text-gray-400 hover:text-gray-200": theme === 'dark'
            }
          )}
          aria-label="Close"
        >
          <CloseIcon className={theme === 'dark' ? 'fill-white' : 'fill-black'} />
        </button>
        <h2 className={classNames(
          "text-2xl font-semibold mb-4",
          { "text-white": theme === 'dark' }
        )}>Settings</h2>
        <div className="flex items-center">
          <span className={classNames(
            "mr-2",
            { "text-white": theme === 'dark' }
          )}>Theme:</span>
          <button
            onClick={() => toggleTheme(theme === 'light' ? 'dark' : 'light')}
            className={classNames(
              "px-2 py-1 rounded-md",
              {
                "bg-gray-200 text-gray-800": theme === 'light',
                "bg-gray-600 text-white": theme === 'dark'
              }
            )}
          >
            {theme === 'light' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;