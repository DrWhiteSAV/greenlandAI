import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { PageView, Language, CityNode } from '../types';
import { 
  ArrowRight, Globe, MapPin, ExternalLink, ShieldCheck, X, Briefcase, 
  Cpu, Users, Award, BookOpen, Star, Lock,
  Building2, BrainCircuit, MessageSquareText, Factory, Palette, 
  FlaskConical, Rocket, Bot, Zap, Map as MapIcon, Mountain, Share2, Landmark, Hotel, School, Warehouse
} from 'lucide-react';

interface HomeProps {
  setView: (view: PageView) => void;
  lang: Language;
  mapImage: string;
  cities: CityNode[];
  t: (key: string) => string;
}

export const Home: React.FC<HomeProps> = ({ setView, lang, mapImage, cities, t }) => {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityNode | null>(null);
  const [selectedLoreKey, setSelectedLoreKey] = useState<string | null>(null);
  const [loreTab, setLoreTab] = useState<'dossier' | 'manifesto' | 'protocol'>('dossier');
  
  // Flag Interactivity State
  const [visibleFlagSection, setVisibleFlagSection] = useState<'colors' | 'coat' | null>(null);

  const pyramidLevels = [
    { 
        id: 4,
        key: 'cha',
        role: t('pyr_cha_role'), 
        desc: t('pyr_cha_desc'),
        color: "from-white via-greenland-ice to-blue-500",
        textColor: "text-gray-900", 
        width: "w-56 md:w-64", // Increased width to fit text
        padding: "pt-24 pb-6", // Pushed text down to the wider part of the triangle
        clip: "polygon(50% 0%, 100% 100%, 0% 100%)", 
        marginTop: "mb-0",
        zIndex: "z-40",
        link: "https://t.me/shishkarnem"
    },
    { 
        id: 3, 
        key: 'min',
        role: t('pyr_min_role'), 
        desc: t('pyr_min_desc'), 
        color: "from-blue-500 to-blue-600",
        textColor: "text-white",
        width: "w-64 md:w-80",
        padding: "py-5 md:py-6",
        clip: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        marginTop: "-mt-4",
        zIndex: "z-30"
    },
    { 
        id: 2, 
        key: 'arc',
        role: t('pyr_arc_role'), 
        desc: t('pyr_arc_desc'), 
        color: "from-blue-600 to-blue-800",
        textColor: "text-gray-100",
        width: "w-80 md:w-[32rem]",
        padding: "py-5 md:py-6",
        clip: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
        marginTop: "-mt-4",
        zIndex: "z-20"
    },
    { 
        id: 1, 
        key: 'res',
        role: t('pyr_res_role'), 
        desc: t('pyr_res_desc'), 
        color: "from-blue-800 to-greenland-deep",
        textColor: "text-gray-300",
        width: "w-full md:w-[42rem]",
        padding: "py-5 md:py-6",
        clip: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
        marginTop: "-mt-4",
        zIndex: "z-10"
    }
  ];

  // Map keys to Icons and Abilities (Static data)
  const LORE_META: Record<string, any> = {
      'res': { 
          icon: Users, 
          abilities: lang === 'ru' ? ["Доступ к Казне", "Партнерская ссылка", "Базовое обучение", "Участие в голосованиях"] : ["ЛУТ", "ИНВАЙТ", "СКИЛЛ", "ГОЛОС"]
      },
      'arc': { 
          icon: Cpu, 
          abilities: lang === 'ru' ? ["Создание Ботов", "Доступ к API", "Биржа Заказов", "Личный сервер"] : ["КРАФТ", "АПИШКА", "ЗАКАЗЫ", "СЕРВАК"]
      },
      'min': { 
          icon: Briefcase, 
          abilities: lang === 'ru' ? ["Управление Агентами", "Модерация", "Законотворчество", "Блокировка счетов"] : ["ВЛАСТЬ", "БАНХАММЕР", "УКАЗЫ", "ДЕНЬГИ"]
      },
      'cha': { 
          icon: Award, 
          abilities: lang === 'ru' ? ["Абсолютный Доступ", "Вето", "Изменение Кода", "Перезагрузка Мира"] : ["GOD MODE", "DELETE WORLD", "REBOOT", "INFINITE MONEY"],
          link: "https://t.me/shishkarnem"
      }
  };

  const getLoreContent = (key: string) => {
      return {
          title: t(`lore_${key}_title`),
          subtitle: t(`lore_${key}_sub`),
          dossier: t(`lore_${key}_dossier`),
          manifesto: t(`lore_${key}_manifesto`),
          protocol: t(`lore_${key}_protocol`),
          ...LORE_META[key]
      };
  };

  const currentLore = selectedLoreKey ? getLoreContent(selectedLoreKey) : null;

  // Unified Icon for all cities
  const getCityIcon = (name: string) => Building2;

  const ColorRow = ({ color, titleKey, descKey }: { color: string, titleKey: string, descKey: string }) => (
      <div className="flex items-start gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg animate-fadeIn">
          <div className={`w-8 h-8 rounded-full ${color} shadow-lg shrink-0 border border-white/20`} />
          <div>
              <h5 className="font-bold text-sm text-gray-900 dark:text-white uppercase">{t(titleKey)}</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">{t(descKey)}</p>
          </div>
      </div>
  );

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-greenland-ice/10 to-transparent pointer-events-none" />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          
          <div className="lg:w-1/2 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-greenland-red/10 dark:bg-greenland-yellow/10 border border-greenland-red/30 dark:border-greenland-yellow/30 text-greenland-red dark:text-greenland-yellow text-sm font-semibold animate-pulse-slow">
              <Globe size={14} />
              <span>{lang === 'ru' ? "Официальный портал ИИ-Гренландии" : "ОФИЦИАЛЬНИ САЙТ УПЧК"}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight text-gray-900 dark:text-white">
              {t('hero_welcome')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-greenland-ice to-blue-600 dark:to-white drop-shadow-[0_0_15px_rgba(0,191,255,0.5)]">AI-GreenLand</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl border-l-4 border-greenland-red pl-6 font-light">
              {t('hero_desc')}
            </p>
            
            {/* Old Button removed from here */}
          </div>

          <div 
            className="lg:w-1/2 relative w-full cursor-pointer group perspective-1000" 
            onClick={() => setView(PageView.IMMIGRATION)}
          >
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,191,255,0.3)] border border-greenland-ice/50 group-hover:shadow-[0_0_50px_rgba(200,16,46,0.6)] group-hover:border-greenland-red transition-all duration-500 transform group-hover:scale-[1.02]">
                <img 
                    src={IMAGES.HERO} 
                    alt="Пейзаж ИИ-Гренландии" 
                    className="w-full h-full object-cover opacity-75 animate-pulse-slow transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-greenland-deep via-transparent to-transparent opacity-60" />
                
                {/* CTA Overlay Text - Moved Up 15px (mb-4 / -mt-8 effect) and structured with line break */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4 mb-8">
                    <h2 className="text-3xl md:text-5xl font-display font-black text-center uppercase tracking-wider transition-all duration-300 text-white/20 [-webkit-text-stroke:1px_rgba(255,255,255,0.8)] group-hover:text-white/40 group-hover:[-webkit-text-stroke:2px_#FFD700] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] leading-tight">
                        {lang === 'olbanian' ? (
                            <>
                                ПОЛУЧИТЬ <br/> КСИВУ
                            </>
                        ) : (
                            <>
                                Получить <br/> Green Card
                            </>
                        )}
                    </h2>
                </div>
            </div>
          </div>
        </div>

        {/* Interactive Cities Map */}
        <div className="mb-12 md:mb-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
                    <MapIcon className="text-greenland-ice" /> {t('map_title')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{t('map_desc')}</p>
            </div>
            
            {/* Map Implementation */}
            <div className="relative w-full max-w-6xl mx-auto aspect-video rounded-3xl overflow-hidden flex items-center justify-center backdrop-blur-sm group p-1">
                
                {/* Clockwise Animated Border for Map */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#00BFFF_30%,transparent_60%)] animate-[spin_4s_linear_infinite] opacity-50"></div>
                
                <div className="relative w-full h-full bg-greenland-surface/80 rounded-3xl border border-greenland-ice/30 overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={mapImage} 
                          alt="Map" 
                          className="w-full h-full object-cover opacity-70 drop-shadow-[0_0_15px_rgba(0,191,255,0.5)] transition-opacity duration-500 group-hover:opacity-90"
                        />
                        
                        {/* Radar Overlay Effect */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                            {/* Scanning beam */}
                            <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-greenland-ice/10 to-transparent animate-scan pointer-events-none"></div>
                            {/* Grid overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Cities Pins */}
                    <div className="absolute inset-0 w-full h-full">
                        {cities.map((city) => {
                            const Icon = getCityIcon(city.name);
                            const isHovered = activeCity === city.name;
                            return (
                                <div 
                                    key={city.id}
                                    className={`absolute cursor-pointer group/pin -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isHovered ? 'z-50' : 'z-20'}`}
                                    style={{ top: city.top, left: city.left }}
                                    onMouseEnter={() => setActiveCity(city.name)}
                                    onMouseLeave={() => setActiveCity(null)}
                                    onClick={() => setSelectedCity(city)}
                                >
                                    {/* Mobile: Smaller Hitbox */}
                                    <div className="relative flex flex-col items-center justify-center w-7 h-7 md:w-14 md:h-14">
                                        
                                        {/* Clockwise Animated Border for Icon */}
                                        <div className={`absolute inset-0 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#00BFFF_50%,transparent_100%)] animate-spin opacity-80 ${isHovered ? 'blur-sm' : ''}`}></div>
                                        
                                        {/* Beacon Ring Animation - Responsive Sizing */}
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500 ${isHovered ? 'w-16 h-16 md:w-32 md:h-32 bg-greenland-ice/10' : 'w-full h-full bg-greenland-ice/5'} animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]`}></div>

                                        {/* City Name Label (Always Visible) */}
                                        <div className={`
                                            absolute bottom-[140%] md:bottom-[130%] mb-1 whitespace-nowrap transition-all duration-300
                                            ${isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-80'}
                                        `}>
                                            <div className={`
                                                backdrop-blur-md border px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg flex items-center gap-1 md:gap-2 transition-colors
                                                ${isHovered
                                                    ? 'bg-greenland-ice text-white border-white shadow-[0_0_20px_rgba(0,191,255,0.6)]' 
                                                    : 'bg-black/60 text-white border-greenland-ice/30 hover:bg-black/80'}
                                            `}>
                                                <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full animate-pulse ${isHovered ? 'bg-white' : 'bg-greenland-ice'}`}></span>
                                                <span className="text-[6px] md:text-[10px] lg:text-xs font-bold font-display tracking-wider uppercase">{city.name}</span>
                                            </div>
                                            {/* Connector Line */}
                                            <div className={`w-px h-2 md:h-3 mx-auto transition-colors ${isHovered ? 'bg-white' : 'bg-greenland-ice/50'}`}></div>
                                        </div>

                                        {/* Icon Marker - Responsive Sizing */}
                                        <div className={`
                                            relative z-10 p-1 md:p-2.5 rounded-full border transition-all duration-300 shadow-[0_0_20px_rgba(0,191,255,0.4)] bg-greenland-deep
                                            ${isHovered
                                                ? 'border-white text-greenland-ice scale-125' 
                                                : 'border-greenland-ice/50 text-greenland-ice/80 hover:scale-110'}
                                        `}>
                                            <Icon className="w-3 h-3 md:w-5 md:h-5" strokeWidth={2} />
                                        </div>
                                        
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

        {/* City Detail Modal */}
        {selectedCity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSelectedCity(null)}
                ></div>
                <div className="relative bg-white dark:bg-greenland-deep border border-greenland-ice/50 rounded-2xl shadow-[0_0_50px_rgba(0,191,255,0.2)] max-w-lg w-full overflow-hidden animate-[float_4s_ease-in-out_infinite] transition-colors">
                    <button onClick={() => setSelectedCity(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-20"><X size={24} /></button>
                    <div className="p-8 flex flex-col items-center text-center">
                        <img src={selectedCity.logo || IMAGES.LOGO} alt={selectedCity.name} className="w-24 h-24 mb-6 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,191,255,0.6)]" />
                        <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">{selectedCity.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{selectedCity.description || "Засекречено."}</p>
                        {selectedCity.link && (
                            <a href={selectedCity.link} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-greenland-ice text-greenland-deep font-bold rounded-lg hover:bg-greenland-ice/80 transition-all shadow-[0_0_20px_rgba(0,191,255,0.2)] flex items-center justify-center gap-2">
                                {selectedCity.linkText || "Перейти"} <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Role Lore Modal */}
        {selectedLoreKey && currentLore && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSelectedLoreKey(null)}
                ></div>
                <div className="relative bg-greenland-deep border-2 border-greenland-ice/30 rounded-3xl shadow-[0_0_100px_rgba(0,191,255,0.2)] max-w-2xl w-full flex flex-col animate-fadeIn overflow-hidden max-h-[90vh]">
                    <button onClick={() => setSelectedLoreKey(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"><X size={24} /></button>
                    
                    <div className="relative h-32 bg-gradient-to-r from-greenland-deep to-greenland-surface border-b border-greenland-ice/20 flex items-center px-8 shrink-0">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-greenland-ice/20 rounded-2xl flex items-center justify-center border border-greenland-ice/50 shadow-[0_0_20px_rgba(0,191,255,0.3)]">
                                {currentLore.icon && <currentLore.icon size={32} className="text-greenland-ice" />}
                            </div>
                            <div>
                                <h3 className="text-3xl font-display font-bold text-white uppercase tracking-widest">{currentLore.title}</h3>
                                <p className="text-greenland-ice text-sm font-mono tracking-wide">{currentLore.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-b border-gray-800 bg-black/20 shrink-0">
                         <button onClick={() => setLoreTab('dossier')} className={`flex-1 py-3 text-sm font-bold uppercase transition-colors ${loreTab === 'dossier' ? 'bg-greenland-ice/10 text-greenland-ice border-b-2 border-greenland-ice' : 'text-gray-500 hover:text-white'}`}>{t('lore_tab_dossier')}</button>
                         <button onClick={() => setLoreTab('manifesto')} className={`flex-1 py-3 text-sm font-bold uppercase transition-colors ${loreTab === 'manifesto' ? 'bg-greenland-ice/10 text-greenland-ice border-b-2 border-greenland-ice' : 'text-gray-500 hover:text-white'}`}>{t('lore_tab_manifesto')}</button>
                         <button onClick={() => setLoreTab('protocol')} className={`flex-1 py-3 text-sm font-bold uppercase transition-colors ${loreTab === 'protocol' ? 'bg-greenland-ice/10 text-greenland-ice border-b-2 border-greenland-ice' : 'text-gray-500 hover:text-white'}`}>{t('lore_tab_protocol')}</button>
                    </div>

                    <div className="p-8 space-y-6 bg-greenland-surface overflow-y-auto custom-scrollbar flex-grow">
                        {loreTab === 'dossier' && (
                            <div className="animate-fadeIn">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><BookOpen size={14} /> {t('lore_tab_dossier')}</h4>
                                <p className="text-white text-lg font-light leading-relaxed mb-6">
                                    {currentLore.dossier}
                                </p>
                                
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Star size={14} /> {t('lore_section_abilities')}</h4>
                                <div className="flex flex-wrap gap-3">
                                    {currentLore.abilities.map((ability: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-greenland-deep rounded-lg border border-greenland-ice/20 text-greenland-ice text-sm shadow-sm">
                                            {ability}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {loreTab === 'manifesto' && (
                            <div className="animate-fadeIn">
                                <div className="p-6 bg-greenland-deep rounded-xl border-l-4 border-greenland-red relative">
                                    <span className="absolute top-2 right-2 text-6xl text-gray-800 font-serif opacity-50">”</span>
                                    <p className="text-xl font-display font-bold text-white italic relative z-10">
                                        {currentLore.manifesto}
                                    </p>
                                </div>
                            </div>
                        )}

                        {loreTab === 'protocol' && (
                            <div className="animate-fadeIn">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Lock size={14} /> {t('lore_tab_protocol')}</h4>
                                <div className="space-y-3 font-mono text-sm">
                                    {currentLore.protocol.split('\n').map((line: string, idx: number) => (
                                        <div key={idx} className="flex gap-3 items-start p-3 bg-black/30 rounded border border-gray-800">
                                            <span className="text-greenland-ice font-bold">0{idx + 1}</span>
                                            <span className="text-gray-300">{line.replace(/^\d+\.\s*/, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {currentLore.link && (
                             <div className="pt-4 mt-auto">
                                <a href={currentLore.link} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-gradient-to-r from-greenland-ice to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all flex items-center justify-center gap-2">
                                    {lang === 'ru' ? "Связаться" : "ПИСАТЬ"} <ExternalLink size={18} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Ice Mountain Pyramid & Flag Section */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-start">
            <div>
                <div className="flex flex-col items-center justify-end relative min-h-[300px] md:min-h-[500px] w-full px-4">
                    {/* Glow behind the peak */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-greenland-ice/30 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    {pyramidLevels.map((level) => (
                        <div 
                            key={level.id}
                            className={`
                                relative flex flex-col items-center justify-center transition-all duration-300 
                                cursor-pointer bg-gradient-to-b ${level.color} shadow-lg backdrop-blur-md
                                hover:scale-105 hover:brightness-110 hover:shadow-greenland-ice/50
                                ${level.width} ${level.padding} ${level.marginTop} ${level.zIndex}
                            `}
                            style={{ clipPath: level.clip }}
                            onClick={() => {
                                setSelectedLoreKey(level.key);
                                setLoreTab('dossier');
                            }}
                        >
                            <span className={`font-display font-bold text-xl md:text-2xl ${level.textColor} uppercase tracking-widest text-center leading-none mb-1 drop-shadow-md`}>{level.role}</span>
                            <span className={`text-[10px] md:text-xs font-bold ${level.textColor} opacity-90 font-sans text-center whitespace-normal break-words w-full px-4 leading-tight uppercase tracking-wider`}>{level.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative pt-4 md:pt-10">
                <div className="bg-greenland-surface/80 border border-greenland-ice/20 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-colors">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div 
                            className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setVisibleFlagSection(prev => prev === 'coat' ? null : 'coat')}
                        >
                            <ShieldCheck className="text-greenland-ice" />
                            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {t('flag_title')}
                                <span className="text-[10px] text-greenland-ice border border-greenland-ice rounded px-1 align-top">INFO</span>
                            </h3>
                        </div>
                        
                        {/* Interactive Flag Image */}
                        <div className="relative group/flag cursor-pointer" onClick={() => setVisibleFlagSection(prev => prev === 'colors' ? null : 'colors')}>
                            <img src={IMAGES.FLAG} alt="Флаг" className="w-full h-auto object-cover rounded shadow-2xl transition-transform duration-300 group-hover/flag:scale-[1.02]" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/flag:opacity-100 transition-opacity bg-black/30 rounded">
                                <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 pointer-events-none">
                                    Нажмите для информации о цветах
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-8 space-y-6 text-left w-full transition-all duration-500">
                             {/* Flag Colors Info (Toggleable) */}
                             {visibleFlagSection === 'colors' && (
                                 <div className="animate-fadeIn">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-wider">
                                        <Palette size={14} /> {t('flag_meaning_title')}
                                    </h4>
                                    <div className="grid gap-3">
                                        <ColorRow color="bg-greenland-yellow" titleKey="color_yellow_title" descKey="color_yellow_desc" />
                                        <ColorRow color="bg-greenland-red" titleKey="color_red_title" descKey="color_red_desc" />
                                        <ColorRow color="bg-greenland-ice" titleKey="color_blue_title" descKey="color_blue_desc" />
                                    </div>
                                    <div className="w-full h-px bg-greenland-ice/10 my-4" />
                                 </div>
                             )}

                             {/* Coat of Arms Symbolism (Toggleable) */}
                             {visibleFlagSection === 'coat' && (
                                 <div className="bg-greenland-deep/50 p-4 rounded-xl border border-greenland-ice/10 animate-fadeIn">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Mountain className="text-greenland-ice" size={18} />
                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wider">{t('coat_title')}</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light italic">
                                            {t('coat_desc')}
                                        </p>
                                        <div className="flex justify-center gap-6 opacity-60">
                                            <div className="flex flex-col items-center gap-1 text-[8px] uppercase text-gray-500">
                                                <Mountain size={16} /> Гора
                                            </div>
                                            <div className="flex flex-col items-center gap-1 text-[8px] uppercase text-gray-500">
                                                <Star size={16} /> Звезда
                                            </div>
                                            <div className="flex flex-col items-center gap-1 text-[8px] uppercase text-gray-500">
                                                <Share2 size={16} /> Нейроны
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                             )}
                             
                             {/* Hint if nothing selected */}
                             {!visibleFlagSection && (
                                 <p className="text-xs text-gray-400 text-center italic opacity-60">
                                     Нажмите на флаг или заголовок, чтобы раскрыть детали символики.
                                 </p>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};