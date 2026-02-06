import React, { useState, useEffect } from 'react';
import { Sun, Moon, Mail } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu, isDark, toggleTheme }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-[60] px-4 sm:px-6 lg:px-10 py-3 sm:py-4 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
      <div className="flex justify-between items-center max-w-[1600px] mx-auto">

        {/* Left: Menu Pill */}
        <MagneticButton strength={0.3}>
          <button
            onClick={toggleMenu}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2
              text-neutral-900 dark:text-white
              hover:bg-neutral-100 dark:hover:bg-neutral-800
              ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
          >
            Menu
          </button>
        </MagneticButton>

        {/* Center: Brand */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <img
            src="/header.jpg"
            alt="engineering taste"
            className="h-12 dark:invert transition-all duration-500"
          />
        </div>

        {/* Right: Status Indicators */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-xs font-medium mr-4 transition-colors duration-300 text-neutral-500 dark:text-neutral-400">
            NYC {time}
          </div>

          <MagneticButton strength={0.4}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center transition-colors
                text-neutral-900 dark:text-white
                hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </MagneticButton>

          <MagneticButton strength={0.4}>
            <a
              href="mailto:ella.lesperance@outlook.com"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors
                text-neutral-900 dark:text-white
                hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Mail size={18} />
            </a>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
};
