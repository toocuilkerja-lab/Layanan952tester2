
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isLoggedIn, onLoginClick, onLogout }) => {
  const tabs: { id: AppTab; icon: string; label: string }[] = [
    { id: 'Beranda', icon: 'fa-home', label: 'Beranda' },
    { id: 'Tutorial', icon: 'fa-book-open', label: 'Tutorial' },
    { id: 'Chat', icon: 'fa-comments', label: 'Chat' },
    { id: 'Profil', icon: 'fa-user', label: 'Profil' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#002B5B] text-white py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-full w-8 h-8 flex items-center justify-center">
              <i className="fa-solid fa-landmark text-[#002B5B] text-sm"></i>
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider leading-none">KPP Pratama Jayapura</h1>
              <span className="text-[10px] text-blue-200">Layanan Digital Perpajakan</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={isLoggedIn ? onLogout : onLoginClick}
              className={`text-sm font-bold px-3 py-1 rounded-lg transition-all ${isLoggedIn ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <i className={`fa-solid ${isLoggedIn ? 'fa-right-from-bracket' : 'fa-user-lock'} mr-1.5`}></i>
              {isLoggedIn ? 'Keluar' : 'Login'}
            </button>
            <button className="text-xl relative">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 px-2 safe-area-bottom shadow-lg z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center flex-1 transition-colors duration-200 ${
              activeTab === tab.id ? 'text-[#002B5B]' : 'text-slate-400'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xl mb-1`}></i>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
