import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { Immigration } from './components/Immigration';
import { MinistryOfLaw } from './components/MinistryOfLaw';
import { Constitution } from './components/Constitution';
import { Profile } from './components/Profile';
import { NeuralBackground } from './components/NeuralBackground';
import { ChatWidget } from './components/ChatWidget';
import { PageView, Language, CityNode, Theme } from './types';
import { CITIES, IMAGES, SHEET_DATA } from './constants';

export default function App() {
  const [currentView, setView] = useState<PageView>(PageView.HOME);
  const [lang, setLang] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('gl_theme') as Theme) || 'dark';
  });

  // History Stack for Back Navigation
  const [history, setHistory] = useState<PageView[]>([]);

  // MASTER DATA STATE
  const [appData, setAppData] = useState<any>(SHEET_DATA);

  // Translation Helper
  const t = useCallback((key: string): string => {
    const row = appData.SITE_TEXT?.find((r: any) => r.key === key);
    if (row) {
        return lang === 'olbanian' && row.olbanian ? row.olbanian : row.ru || key;
    }
    return key;
  }, [appData, lang]);

  // Theme Management
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('gl_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Map State (Lifted up for editing)
  const [mapImage, setMapImage] = useState<string>(() => {
    return localStorage.getItem('gl_map_image') || IMAGES.MAP;
  });
  
  const [cities, setCities] = useState<CityNode[]>(() => {
    const saved = localStorage.getItem('gl_cities');
    return saved ? JSON.parse(saved) : CITIES.map((c, i) => ({ ...c, id: `city-${i}` }));
  });

  // Save map settings when changed
  useEffect(() => {
    localStorage.setItem('gl_map_image', mapImage);
    localStorage.setItem('gl_cities', JSON.stringify(cities));
  }, [mapImage, cities]);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const toggleLang = () => {
    setLang(prev => prev === 'ru' ? 'olbanian' : 'ru');
  };

  // Navigation Logic
  const handleSetView = (view: PageView) => {
    if (view === currentView) return;
    setHistory(prev => [...prev, currentView]);
    setView(view);
  };

  const handleGoBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevView = newHistory.pop();
    setHistory(newHistory);
    if (prevView) setView(prevView);
  };

  const renderView = () => {
    switch (currentView) {
      case PageView.HOME:
        return <Home setView={handleSetView} lang={lang} mapImage={mapImage} cities={cities} t={t} />;
      case PageView.IMMIGRATION:
        return <Immigration lang={lang} t={t} />;
      case PageView.MINISTRY_OF_LAW:
        return <MinistryOfLaw lang={lang} t={t} />;
      case PageView.CONSTITUTION:
        return <Constitution lang={lang} t={t} lawsData={appData.LAWS} />;
      case PageView.PROFILE:
        return <Profile 
            lang={lang} 
            mapImage={mapImage} 
            cities={cities} 
            onUpdateMapImage={setMapImage} 
            onUpdateCities={setCities} 
            t={t}
            appData={appData}
            setAppData={setAppData}
        />;
      default:
        return <Home setView={handleSetView} lang={lang} mapImage={mapImage} cities={cities} t={t} />;
    }
  };

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-gray-200 selection:bg-greenland-red selection:text-white transition-colors duration-300 overflow-x-hidden">
      
      {/* Background Animation Layer */}
      <NeuralBackground />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation 
          currentView={currentView} 
          setView={handleSetView} 
          lang={lang} 
          toggleLang={toggleLang} 
          theme={theme}
          toggleTheme={toggleTheme}
          t={t}
          onBack={handleGoBack}
          canGoBack={history.length > 0}
        />
        <main className="animate-[fadeIn_0.5s_ease-out] pb-24 md:pb-0 flex-grow">
          {renderView()}
        </main>
        
        <footer className="border-t border-greenland-ice/10 py-8 mt-20 bg-greenland-deep/80 backdrop-blur-sm pb-32 md:pb-8 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm font-display">
              © {new Date().getFullYear()} AI-GreenLand. {lang === 'ru' ? "Все права защищены Парламентом." : "ОНОТОЛЕ СЛЕДИТ ЗА ТОБОЙ!"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-600 mt-2">
              {lang === 'ru' ? "ИИ-автоматизация на страже вашего процветания." : "УПЧК АВТОМАТИЗАЦИЯ ПЫЩЬ ПЫЩЬ!"}
            </p>
          </div>
        </footer>

        {/* AI Assistant Widget */}
        <ChatWidget lang={lang} appData={appData} />
      </div>
    </div>
  );
}