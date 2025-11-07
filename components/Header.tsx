import React from 'react';
import { Page } from '../types';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout, onAboutClick }) => {
  return (
    <header className="bg-[#FDF8F0]/80 backdrop-blur-sm sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <h1 className="font-display text-3xl text-[#333333] cursor-pointer" onClick={() => onNavigate(Page.Dashboard)}>
              LAVARE
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.page
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                    : 'text-[#333333] hover:text-[#D4AF37]'
                } pb-1`}
              >
                {item.label}
              </button>
            ))}
             <button onClick={onAboutClick} className="text-sm font-medium text-[#333333] hover:text-[#D4AF37] transition-colors duration-200 pb-1">
              Our Values
            </button>
          </nav>
          <div className="flex items-center">
             <button
              onClick={onLogout}
              className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#333333] bg-[#D4AF37] bg-opacity-20 hover:bg-opacity-40 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;