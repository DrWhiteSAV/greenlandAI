import React, { useRef, useState } from 'react';
import { IMAGES } from '../constants';
import { Shield, CreditCard, Activity, Target, Download, Share2, Copy, Loader2, UserCircle, Wallet, Lock } from 'lucide-react';
import { Treasury } from './Treasury';
import { Admin } from './Admin';
// @ts-ignore
import html2canvas from 'html2canvas';
import { CityNode, Language } from '../types';

interface ProfileProps {
    lang: Language;
    mapImage: string;
    cities: CityNode[];
    onUpdateMapImage: (url: string) => void;
    onUpdateCities: (cities: CityNode[]) => void;
    t: (key: string) => string;
    appData: any;
    setAppData: (data: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ lang, mapImage, cities, onUpdateMapImage, onUpdateCities, t, appData, setAppData }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'treasury' | 'admin'>('main');

  // Mock data for the profile
  const user = {
    name: "Alex_AI",
    fio: "Иванов Алексей Петрович",
    rank: lang === 'ru' ? "Резидент" : "КРАБЕ",
    id: "AI-12345",
    promo: "IVAN24",
    balance: 0,
    referrals: 0,
    missionsCompleted: 0
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // High resolution
        logging: false,
        useCORS: true // Allow loading cross-origin images (like the logo)
      });
      
      const link = document.createElement('a');
      link.download = `AI-GreenLand-Card-${user.promo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Failed to generate card", error);
      alert("Не удалось сгенерировать карту. Попробуйте позже.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-greenland-deep/80 border border-greenland-ice/20 p-1 rounded-xl flex flex-wrap justify-center gap-1">
            <button 
                onClick={() => setActiveTab('main')}
                className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'main' 
                    ? 'bg-greenland-ice text-greenland-deep shadow-[0_0_10px_rgba(0,191,255,0.4)]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
                <UserCircle size={18} /> {t('prof_tab_main')}
            </button>
            <button 
                onClick={() => setActiveTab('treasury')}
                className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'treasury' 
                    ? 'bg-greenland-ice text-greenland-deep shadow-[0_0_10px_rgba(0,191,255,0.4)]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
                <Wallet size={18} /> {t('prof_tab_treasury')}
            </button>
            <button 
                onClick={() => setActiveTab('admin')}
                className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'admin' 
                    ? 'bg-greenland-red text-white shadow-[0_0_10px_rgba(200,16,46,0.4)]' 
                    : 'text-gray-500 hover:text-greenland-red hover:bg-white/5'
                }`}
            >
                <Lock size={18} /> {t('prof_tab_hq')}
            </button>
        </div>
      </div>

      {activeTab === 'main' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Identity Column */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-greenland-surface/80 rounded-2xl p-6 border border-greenland-ice/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <img src={IMAGES.LOGO} className="w-24 h-24" alt="Logo Watermark" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-greenland-deep/50 border-2 border-greenland-ice p-1 mb-4">
                            <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-500">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.fio}</p>
                        <span className="px-3 py-1 bg-greenland-red/10 dark:bg-greenland-yellow/10 text-greenland-red dark:text-greenland-yellow border border-greenland-red/20 dark:border-greenland-yellow/20 rounded-full text-xs font-bold mt-2">
                            {user.rank}
                        </span>
                        
                        <div className="mt-6 w-full space-y-3">
                            <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                                <span className="text-gray-600 dark:text-gray-400">{lang === 'ru' ? "Гражданство" : "СТРАНА"}</span>
                                <span className="text-gray-900 dark:text-white font-mono">{lang === 'ru' ? "ИИ-Гренландия" : "УПЧК"}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                                <span className="text-gray-600 dark:text-gray-400">ID Карты</span>
                                <span className="text-greenland-ice font-mono">{user.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{lang === 'ru' ? "Доступ" : "ЛЕВЕЛ"}</span>
                                <span className="text-green-500">{lang === 'ru' ? "Уровень 1" : "НУБ"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-greenland-red to-red-900 rounded-2xl p-6 text-white shadow-lg opacity-80">
                    <h3 className="font-bold mb-1">{t('prof_invite')}</h3>
                    <p className="text-xs opacity-80 mb-4">{lang === 'ru' ? "Делитесь промокодом и получайте %" : "ЗОВИ ДРУЗЕЙ, РУБИ БАБЛО"}</p>
                    <div className="bg-black/30 p-2 rounded flex justify-between items-center mb-3">
                        <span className="font-mono font-bold tracking-widest">{user.promo}</span>
                        <Copy size={16} className="cursor-pointer hover:text-greenland-yellow" />
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors font-bold text-sm">
                        <Share2 size={16} /> {t('prof_copy')}
                    </button>
                </div>
            </div>

            {/* Dashboard Column */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* KPI Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-greenland-surface/80 p-4 rounded-xl border-l-4 border-greenland-ice">
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">{t('prof_balance')}</div>
                        <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{user.balance} ₽</div>
                    </div>
                    <div className="bg-greenland-surface/80 p-4 rounded-xl border-l-4 border-greenland-red dark:border-greenland-yellow">
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">{t('prof_refs')}</div>
                        <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{user.referrals}</div>
                    </div>
                    <div className="bg-greenland-surface/80 p-4 rounded-xl border-l-4 border-greenland-red">
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">{t('prof_missions')}</div>
                        <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{user.missionsCompleted}</div>
                    </div>
                </div>

                {/* Current Processes */}
                <div className="bg-greenland-surface/80 border border-greenland-ice/10 rounded-2xl p-6">
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Activity className="text-greenland-ice" /> {t('prof_processes')}
                    </h3>

                    <div className="space-y-4">
                        {/* Process 1 */}
                        <div className="bg-gray-50 dark:bg-greenland-deep p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                            <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                                <Shield size={20} />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{lang === 'ru' ? "Верификация Личности" : "ФЕЙС КОНТРОЛЬ"}</h4>
                                <div className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mt-2">
                                    <div className="h-full bg-greenland-red dark:bg-greenland-yellow w-1/2 rounded-full"></div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">{lang === 'ru' ? "Ожидает подтверждения от Парламента" : "ОНОТОЛЕ ДУМАЕТ"}</p>
                            </div>
                            <span className="px-2 py-1 bg-yellow-900/10 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 text-xs rounded border border-yellow-900/20 dark:border-yellow-900/50">
                                {lang === 'ru' ? "В работе" : "ЖДЕМ"}
                            </span>
                        </div>

                        {/* Process 2 */}
                        <div className="bg-gray-50 dark:bg-greenland-deep p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 opacity-50">
                            <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{lang === 'ru' ? "Подписание Договора" : "ПОДПИСЬ КРОВЬЮ"}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">{lang === 'ru' ? "Доступно после верификации" : "СНАЧАЛА ФЕЙС КОНТРОЛЬ"} - <span className="text-greenland-ice font-bold">DOC-IPREF</span></p>
                            </div>
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-500 text-xs rounded border border-gray-300 dark:border-gray-700">
                                {lang === 'ru' ? "Ожидание" : "СТОПЭ"}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Download Green Card Section */}
                <div className="bg-greenland-ice/5 border border-greenland-ice/20 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                    
                    {/* The Actual Card Component to be Downloaded */}
                    <div 
                        ref={cardRef}
                        className="relative w-80 h-48 rounded-xl overflow-hidden shadow-lg shrink-0 select-none"
                        style={{ minWidth: '320px', minHeight: '192px' }}
                    >
                        {/* Background */}
                        <div className="absolute inset-0 flex flex-col">
                            <div className="h-1/2 bg-greenland-yellow"></div>
                            <div className="h-1/2 bg-greenland-red"></div>
                        </div>
                        {/* Noise & Texture */}
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"></div>
                        
                        {/* Content */}
                        <div className="relative h-full p-4 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    {/* Use crossOrigin="anonymous" for download compatibility */}
                                    <img 
                                        src={IMAGES.LOGO} 
                                        crossOrigin="anonymous" 
                                        className="w-8 h-8 object-contain drop-shadow-md" 
                                        alt="Coat of Arms" 
                                    />
                                    <div className="flex flex-col">
                                        {/* Fixed colors for card export compatibility */}
                                        <span className="font-display font-black text-greenland-red text-sm leading-none tracking-tight">AI-GREENLAND</span>
                                        <span className="text-[6px] font-bold text-greenland-red/80 uppercase tracking-[0.2em]">Official Resident ID</span>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full border border-greenland-red/20 bg-white/30 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-greenland-red/10"></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <div className="mb-1">
                                        <p className="text-[6px] font-bold text-slate-900/60 uppercase">Callsign</p>
                                        <p className="font-display font-bold text-slate-900 text-lg leading-none">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[6px] font-bold text-slate-900/60 uppercase">Rank</p>
                                        <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                            {user.rank.toUpperCase()} <Shield size={10} className="fill-slate-900 text-slate-900" />
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <p className="text-[6px] font-bold text-slate-900/60 uppercase mb-1">Promo ID</p>
                                    <div className="bg-white/90 px-2 py-1 rounded border border-slate-900/10 shadow-sm">
                                        <span className="font-mono font-bold text-greenland-red text-base tracking-widest">{user.promo}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow text-center md:text-left">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('prof_card_title')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {lang === 'ru' ? "Это ваш официальный документ. Сохраните его на устройстве для подтверждения статуса резидента и входа в закрытые чаты." : "ЭТО ТВОЯ КСИВА. НЕ ПОТЕРЯЙ."}
                        </p>
                        <button 
                            onClick={handleDownloadCard}
                            disabled={isDownloading}
                            className={`
                                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(0,191,255,0.3)]
                                ${isDownloading 
                                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                                    : 'bg-greenland-ice text-greenland-deep hover:bg-white'
                                }
                            `}
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> {lang === 'ru' ? "Генерация..." : "ДЕЛАЕМ..."}
                                </>
                            ) : (
                                <>
                                    <Download size={20} /> {t('prof_download')}
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
      )} 
      
      {activeTab === 'treasury' && (
        <Treasury lang={lang} t={t} appData={appData} />
      )}

      {activeTab === 'admin' && (
        <Admin 
            mapImage={mapImage} 
            cities={cities} 
            onUpdateMapImage={onUpdateMapImage} 
            onUpdateCities={onUpdateCities}
            appData={appData}
            setAppData={setAppData}
        />
      )}
    </div>
  );
};