import React, { useState, useRef } from 'react';
import { UserRole, Language } from '../types';
import { IMAGES } from '../constants';
import { CheckCircle, Loader2, Copy, Fingerprint, Sparkles, User, Download } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';

interface ImmigrationProps {
    lang: Language;
    t: (key: string) => string;
}

export const Immigration: React.FC<ImmigrationProps> = ({ lang, t }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'card'>('form');
  const [formData, setFormData] = useState({ 
    fio: '', // Real Name for Contract
    name: '', // Callsign/Alias for Green Card
    role: UserRole.RESIDENT,
    ownPromo: '',
    
    // Expert specific fields
    title: 'Dr.',
    tools: '',
    spheres: '',
    cases: '',
    other: ''
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const titles = ['Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Pr.'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    // Simulate API call and logic
    setTimeout(() => {
      // Use own promo if provided, else generate one
      const code = formData.ownPromo.trim() 
        ? formData.ownPromo.toUpperCase() 
        : `AI-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setGeneratedCode(code);
      setStep('card');
    }, 2000);
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // High resolution
        logging: false,
        useCORS: true 
      });
      
      const link = document.createElement('a');
      link.download = `AI-GreenLand-Card-${generatedCode}.png`;
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
    <div className="container mx-auto px-4 py-12 min-h-[80vh] flex items-center justify-center">
      {step === 'form' && (
        <div className="max-w-2xl w-full bg-greenland-surface/80 border border-greenland-ice/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-greenland-red dark:from-greenland-yellow via-greenland-red to-greenland-ice" />
          
          <h2 className="text-3xl font-display font-bold text-center mb-2 text-gray-900 dark:text-white">{t('imm_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm">{t('imm_subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{lang === 'ru' ? "Выберите гражданский статус:" : "КТО ТЫ ПО ЖИЗНИ?"}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.RESIDENT})}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    formData.role === UserRole.RESIDENT 
                    ? 'border-greenland-red dark:border-greenland-yellow bg-greenland-red/10 dark:bg-greenland-yellow/10 text-greenland-red dark:text-greenland-yellow shadow-[0_0_10px_rgba(200,16,46,0.2)] dark:shadow-[0_0_10px_rgba(255,215,0,0.2)]' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="font-bold mb-1">{t('imm_role_res')}</div>
                  <div className="text-xs opacity-70">{t('imm_role_res_desc')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: UserRole.ARCHITECT})}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    formData.role === UserRole.ARCHITECT 
                    ? 'border-greenland-ice bg-greenland-ice/10 text-greenland-ice shadow-[0_0_10px_rgba(0,191,255,0.2)]' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="font-bold mb-1">{t('imm_role_exp')}</div>
                  <div className="text-xs opacity-70">{t('imm_role_exp_desc')}</div>
                </button>
              </div>
            </div>

            {/* Common Field: FIO */}
             <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                   {t('imm_fio')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                      type="text" 
                      required 
                      className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 pl-10 text-gray-900 dark:text-white focus:border-greenland-ice focus:ring-1 focus:ring-greenland-ice outline-none transition"
                      placeholder="Иванов Иван Иванович"
                      value={formData.fio}
                      onChange={(e) => setFormData({...formData, fio: e.target.value})}
                  />
                  <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">{lang === 'ru' ? "Необходимо для формирования юридического договора." : "НУЖНО ДЛЯ КСИВЫ."}</p>
            </div>

            {/* Fields based on Role */}
            {formData.role === UserRole.RESIDENT ? (
                // RESIDENT FORM
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('imm_nick')} <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            required 
                            className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-greenland-ice focus:ring-1 focus:ring-greenland-ice outline-none transition"
                            placeholder="Alex_AI"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <p className="text-[10px] text-gray-500 mt-1">{lang === 'ru' ? "Будет отображаться на Green-Card." : "ТАК ТЕБЯ БУДУТ ЗВАТЬ ПАЦАНЫ."}</p>
                    </div>
                </>
            ) : (
                // EXPERT FORM
                <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
                    <div className="md:col-span-2">
                         <div className="flex items-center gap-2 mb-4 p-3 bg-greenland-red/10 border border-greenland-red/20 rounded-lg text-greenland-red text-xs">
                            <Sparkles size={16} />
                            {lang === 'ru' ? "Для получения статуса Эксперта требуется подтверждение квалификации." : "ЭКСПЕРТ ДОЛЖЕН БЫТЬ ЧОТКИМ."}
                         </div>
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{lang === 'ru' ? "Обращение" : "КАК ЗВАТЬ"} <span className="text-red-500">*</span></label>
                         <select
                            className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                         >
                            {titles.map(t => <option key={t} value={t}>{t}</option>)}
                         </select>
                         <p className="text-[10px] text-gray-500 mt-1">Dr., Mr., Mrs., Ms., Pr.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{lang === 'ru' ? "Псевдоним (Alias)" : "ПОГОНЯЛО"} <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            required 
                            className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-greenland-ice outline-none transition"
                            placeholder="Dr. AI"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{lang === 'ru' ? "Инструменты" : "ЧЕМ РАБОТАЕШЬ"} <span className="text-red-500">*</span></label>
                         <textarea 
                            required
                            className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-greenland-ice outline-none transition min-h-[80px]"
                            placeholder="CRM, телефонии, конструкторы (Make, n8n), LLM (GPT, Claude)..."
                            value={formData.tools}
                            onChange={(e) => setFormData({...formData, tools: e.target.value})}
                         />
                    </div>

                    <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{lang === 'ru' ? "Сферы и Отрасли" : "ГДЕ РУБИШЬ БАБЛО"} <span className="text-red-500">*</span></label>
                         <textarea 
                            required
                            className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-greenland-ice outline-none transition min-h-[60px]"
                            placeholder="Недвижимость, E-com, EdTech..."
                            value={formData.spheres}
                            onChange={(e) => setFormData({...formData, spheres: e.target.value})}
                         />
                    </div>

                     <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{lang === 'ru' ? "Кейсы и Боты" : "ЧО СДЕЛАЛ"} <span className="text-red-500">*</span></label>
                         <textarea 
                            required
                            className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-greenland-ice outline-none transition min-h-[80px]"
                            placeholder="Опишите реализованные проекты..."
                            value={formData.cases}
                            onChange={(e) => setFormData({...formData, cases: e.target.value})}
                         />
                    </div>
                    
                    <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{lang === 'ru' ? "Дополнительно" : "ЕЩЕ ЧО"}</label>
                         <textarea 
                            className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:border-greenland-ice outline-none transition min-h-[60px]"
                            placeholder="Что еще важно знать о вашем опыте?"
                            value={formData.other}
                            onChange={(e) => setFormData({...formData, other: e.target.value})}
                         />
                    </div>
                </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                {lang === 'ru' ? "Ваш Промокод" : "ТВОЙ КОД"} <span className="text-xs text-greenland-ice">(Идентификатор жителя)</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  className="w-full bg-gray-50 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 rounded-lg p-3 pl-10 text-gray-900 dark:text-white focus:border-greenland-ice focus:ring-1 focus:ring-greenland-ice outline-none transition uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal font-mono"
                  placeholder="Придумайте свой код (напр. IVAN24)"
                  value={formData.ownPromo}
                  onChange={(e) => setFormData({...formData, ownPromo: e.target.value})}
                />
                <Fingerprint className="absolute left-3 top-3.5 text-gray-500" size={18} />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{lang === 'ru' ? "Этот код будет использоваться для приглашения других жителей." : "ДАВАЙ ЭТОТ КОД ДРУЗЯШКАМ."}</p>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-greenland-ice to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 transition-all hover:scale-[1.02] active:scale-95 uppercase"
            >
              {formData.role === UserRole.ARCHITECT ? t('imm_btn_exp') : t('imm_btn')}
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              {lang === 'ru' ? "Нажимая кнопку, вы подтверждаете верность введенных данных и присягаете на верность коду." : "ЖМЯКНУЛ КНОПКУ — ОТВЕТИЛ ЗА БАЗАР."}
            </p>
          </form>
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center">
          <Loader2 size={64} className="animate-spin text-greenland-ice mx-auto mb-6" />
          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('imm_processing')}</h3>
          <p className="text-gray-500 mt-2">{lang === 'ru' ? "Внесение записи в реестр ИИ-Гренландии" : "ПИШЕМ ТЕБЯ В БЛОКЧЕЙН"}</p>
        </div>
      )}

      {step === 'card' && (
        <div className="flex flex-col items-center animate-[float_4s_ease-in-out_infinite]">
            
            {/* Downloadable Card Container */}
            <div 
                ref={cardRef}
                className="relative w-96 h-56 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,191,255,0.3)] perspective-1000 group cursor-pointer"
                style={{ minWidth: '384px', minHeight: '224px' }}
            >
                {/* Card Background - Flag Design */}
                <div className="absolute inset-0 flex flex-col">
                    <div className="h-1/2 bg-greenland-yellow"></div>
                    <div className="h-1/2 bg-greenland-red"></div>
                </div>
                
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50"></div>

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <img 
                                src={IMAGES.LOGO} 
                                crossOrigin="anonymous" 
                                alt="Coat of Arms" 
                                className="w-12 h-12 object-contain drop-shadow-md" 
                            />
                            <div>
                                <h3 className="font-display font-bold text-greenland-red text-lg leading-none">AI-GREENLAND</h3>
                                <p className="text-[10px] font-bold tracking-widest text-greenland-red/80 uppercase">Official Resident ID</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-greenland-red/30 flex items-center justify-center bg-white/20">
                           <div className="w-6 h-6 rounded-full bg-greenland-red/20 animate-pulse" /> 
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            {/* FIO Display */}
                            <p className="text-[8px] font-bold text-greenland-deep/60 uppercase">ФИО / Full Name</p>
                            <p className="font-bold text-greenland-deep text-xs mb-1 truncate max-w-[150px]">{formData.fio}</p>

                            <p className="text-[8px] font-bold text-greenland-deep/60 uppercase">
                                {formData.role === UserRole.ARCHITECT ? 'Эксперт / Alias' : 'Позывной / Callsign'}
                            </p>
                            <p className="font-display font-bold text-greenland-deep text-lg">
                                {formData.role === UserRole.ARCHITECT ? `${formData.title} ${formData.name}` : formData.name}
                            </p>
                            
                            <p className="text-[8px] font-bold text-greenland-deep/60 uppercase mt-1">Статус / Role</p>
                            <p className="font-bold text-greenland-deep text-sm flex items-center gap-1">
                                {formData.role === UserRole.RESIDENT ? 'ГРАЖДАНИН' : 'АРХИТЕКТОР'}
                                <CheckCircle size={12} fill="#0B1120" color="#FFD700" />
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] font-bold text-greenland-deep/60 uppercase">Ваш Код / ID</p>
                             <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded border border-greenland-deep/20 flex items-center gap-2 cursor-pointer hover:bg-white transition-colors" onClick={() => navigator.clipboard.writeText(generatedCode)}>
                                <span className="font-mono font-bold text-greenland-red text-xl tracking-widest">{generatedCode}</span>
                                <Copy size={12} className="text-greenland-deep" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center max-w-md w-full px-4">
                <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-2">{t('imm_success')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{lang === 'ru' ? "Ваша Green-Card готова. Сохраните её. Теперь вы можете официально работать и приглашать жителей." : "ТВОЯ КСИВА ГОТОВА. ТЕРЬ ТЫ РЕАЛЬНИ КАБАН."}</p>
                
                <div className="flex flex-col gap-3">
                     <button 
                        onClick={handleDownloadCard}
                        disabled={isDownloading}
                        className={`
                            w-full py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(0,191,255,0.3)] flex items-center justify-center gap-2
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
                                <Download size={20} /> {lang === 'ru' ? "Скачать карту (PNG)" : "СКАЧАТЬ ЖПГ"}
                            </>
                        )}
                    </button>

                     <button 
                        onClick={() => window.location.reload()} // Simplified logic for demo
                        className="w-full py-3 bg-gradient-to-r from-greenland-ice to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-colors"
                        >
                        {lang === 'ru' ? "Перейти к заключению договора" : "ПОДПИСАТЬ БУМАЖКИ"}
                    </button>
                    
                    <button className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-greenland-red dark:bg-greenland-yellow animate-pulse"></span>
                        {lang === 'ru' ? "Green-Card сохранена в вашем Профиле" : "КСИВА В ПРОФИЛЕ"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};