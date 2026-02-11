import React from 'react';
import { PageView, Language, Theme } from '../types';
import { Plane, Scale, Landmark, BookOpen, UserCircle, Home, Lock, RefreshCcw, Sun, Moon, ArrowLeft } from 'lucide-react';
import { IMAGES } from '../constants';

interface NavigationProps {
  currentView: PageView;
  setView: (view: PageView) => void;
  lang: Language;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
  onBack: () => void;
  canGoBack: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, lang, toggleLang, theme, toggleTheme, t, onBack, canGoBack }) => {
  
  const navItems = [
    { id: PageView.IMMIGRATION, label: t('nav_imm'), icon: Plane },
    { id: PageView.MINISTRY_OF_LAW, label: t('nav_law'), icon: Scale },
    { id: PageView.CONSTITUTION, label: t('nav_const'), icon: BookOpen },
  ];

  const mobileNavItems = [
    { id: PageView.HOME, label: t('nav_home'), icon: Home },
    ...navItems,
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-greenland-deep/90 backdrop-blur-md border-b border-greenland-ice/20 shadow-lg shadow-greenland-ice/5 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 md:h-20">
            
            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                  {canGoBack && (
                      <button 
                        onClick={onBack}
                        className="p-2 rounded-full bg-greenland-ice/10 text-greenland-ice hover:bg-greenland-ice hover:text-greenland-deep transition-all border border-greenland-ice/20"
                        title="Назад"
                      >
                          <ArrowLeft size={20} />
                      </button>
                  )}
                  
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setView(PageView.HOME)}
                  >
                    <div className="relative w-12 h-12">
                      <img 
                        src={IMAGES.LOGO} 
                        alt="Герб" 
                        className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,191,255,0.5)] group-hover:animate-float transition-all duration-700 group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold tracking-wider font-display bg-gradient-to-r from-gray-900 via-greenland-ice to-gray-900 dark:from-white dark:via-greenland-ice dark:to-white bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                        AI-GreenLand
                      </h1>
                      <p className="text-xs text-greenland-red dark:text-greenland-yellow uppercase tracking-[0.2em]">{lang === 'ru' ? "Цифровое Государство" : "УПЧК СТРАНА"}</p>
                    </div>
                  </div>
              </div>

              <div className="flex items-center space-x-1">
                 {/* Theme Toggle */}
                 <button
                    onClick={toggleTheme}
                    className="mr-2 p-2 rounded-full text-gray-500 hover:text-greenland-ice hover:bg-gray-200 dark:hover:bg-white/5 transition-all"
                    title={theme === 'dark' ? "Включить светлую тему" : "Включить темную тему"}
                 >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                 </button>

                 {/* Language Toggle */}
                 <button
                    onClick={toggleLang}
                    className={`mr-4 px-3 py-1 rounded border text-xs font-bold transition-all uppercase ${
                        lang === 'olbanian' 
                        ? 'bg-yellow-500 text-black border-yellow-500 animate-pulse' 
                        : 'bg-greenland-deep text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="Переключить язык / Switch Language"
                 >
                    {lang === 'ru' ? 'RU 🇷🇺' : '☢️ УПЧК'}
                 </button>

                <div className="flex space-x-1 mr-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-greenland-red/80 to-red-900/80 text-white shadow-[0_0_15px_rgba(200,16,46,0.3)] border border-greenland-yellow/30' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-greenland-ice hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setView(PageView.PROFILE)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 border ${
                    currentView === PageView.PROFILE
                      ? 'bg-greenland-ice/20 border-greenland-ice text-greenland-ice'
                      : 'bg-greenland-deep border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-greenland-ice/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <UserCircle size={20} />
                  <span className="font-medium text-sm">{t('nav_profile')}</span>
                </button>
              </div>
            </div>

            {/* Mobile View: Centered Profile Icon */}
            <div className="md:hidden w-full flex justify-between items-center py-2">
                 <div className="flex items-center gap-2">
                     {canGoBack && (
                          <button 
                            onClick={onBack}
                            className="p-2 rounded-full bg-greenland-ice/10 text-greenland-ice"
                          >
                              <ArrowLeft size={20} />
                          </button>
                      )}
                     <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-500 hover:text-greenland-ice"
                     >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                     </button>
                 </div>
                 
                 <div className="flex items-center gap-4">
                     <button
                        onClick={() => setView(PageView.PROFILE)}
                        className={`p-2 rounded-full transition-all duration-300 border relative group ${
                            currentView === PageView.PROFILE
                            ? 'bg-greenland-ice/10 border-greenland-ice text-greenland-ice shadow-[0_0_15px_rgba(0,191,255,0.3)]'
                            : 'bg-transparent border-transparent text-gray-400'
                        }`}
                        >
                        <UserCircle size={28} />
                        {currentView === PageView.PROFILE && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-greenland-ice rounded-full"></span>
                        )}
                    </button>
                 </div>

                 <button
                    onClick={toggleLang}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all uppercase ${
                        lang === 'olbanian' 
                        ? 'text-yellow-500 animate-pulse' 
                        : 'text-gray-500'
                    }`}
                 >
                    {lang === 'ru' ? 'RU' : '☢️'}
                 </button>
            </div>

          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation Bar (Bottom) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-greenland-surface/95 backdrop-blur-xl border border-greenland-ice/20 rounded-2xl p-2 flex justify-between z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
         {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all duration-300 ${
                    isActive ? 'text-greenland-red dark:text-greenland-yellow bg-black/5 dark:bg-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]' : ''} />
                  <span className="text-[9px] mt-1 font-medium tracking-wide">{item.label}</span>
                </button>
              );
            })}
      </div>
    </>
  );
};