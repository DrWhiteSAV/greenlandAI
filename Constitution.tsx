import React, { useState, useMemo } from 'react';
import { Plus, Minus, MessageCircle, Book, Search } from 'lucide-react';
import { Language } from '../types';

interface ConstitutionProps {
    lang: Language;
    t: (key: string) => string;
    lawsData: any[]; // Data from the LAWS table
}

export const Constitution: React.FC<ConstitutionProps> = ({ lang, t, lawsData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLaws = useMemo(() => {
    if (!searchQuery) return lawsData;
    const lowerQuery = searchQuery.toLowerCase();
    return lawsData.filter(item => {
      const q = (item.q || '').toLowerCase();
      const a = (item.a || '').toLowerCase();
      const qOlb = (item.q_olbanian || '').toLowerCase();
      const aOlb = (item.a_olbanian || '').toLowerCase();
      
      return q.includes(lowerQuery) || a.includes(lowerQuery) || qOlb.includes(lowerQuery) || aOlb.includes(lowerQuery);
    });
  }, [lawsData, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
             <div className="w-16 h-16 bg-greenland-surface/80 rounded-full flex items-center justify-center mx-auto mb-4 border border-greenland-ice/30 shadow-[0_0_20px_rgba(0,191,255,0.2)]">
                <Book className="text-greenland-ice" size={32} />
             </div>
             <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">{t('const_title')}</h2>
             <p className="text-gray-600 dark:text-gray-400">{t('const_desc')}</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8 max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-greenland-ice/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder={lang === 'ru' ? "Поиск по законам..." : "ИЩИ ТУТ..."}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setOpenIndex(null); }}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-greenland-surface/80 border border-greenland-ice/20 focus:border-greenland-ice focus:ring-2 focus:ring-greenland-ice/20 outline-none transition-all shadow-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
        </div>
        
        <div className="space-y-4 min-h-[300px]">
          {filteredLaws && filteredLaws.length > 0 ? (
            filteredLaws.map((item, index) => (
            <div 
              key={index} 
              className="bg-greenland-surface/80 border border-greenland-ice/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-greenland-ice/30"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left border-b border-transparent transition-all rounded-xl focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-lg text-gray-900 dark:text-white font-display flex gap-3 pr-4">
                   <span className="text-greenland-ice/50 select-none">§</span> 
                   {lang === 'olbanian' && item.q_olbanian ? item.q_olbanian : item.q}
                </span>
                {openIndex === index ? (
                  <Minus className="text-greenland-red shrink-0" />
                ) : (
                  <Plus className="text-greenland-ice shrink-0" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-2 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pl-12 leading-relaxed whitespace-pre-wrap">
                  {lang === 'olbanian' && item.a_olbanian ? item.a_olbanian : item.a}
                </div>
              </div>
            </div>
          ))
          ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                  <Search size={48} className="mb-4 text-gray-400" />
                  <p className="text-xl font-bold text-gray-500">{lang === 'ru' ? "Ничего не найдено" : "ПУСТО БРО"}</p>
                  <p className="text-sm text-gray-400">{lang === 'ru' ? "Попробуйте изменить запрос" : "ПОПРОБУЙ ПО-ДРУГОМУ"}</p>
              </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-gray-100 to-white dark:from-greenland-deep dark:to-greenland-surface/80 border border-greenland-ice/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{lang === 'ru' ? "Требуется разъяснение закона?" : "НИЧО НЕ ПОНЯЛ?"}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {lang === 'ru' ? "Бот Савва имеет прямую связь с Парламентом и ответит на любые юридические вопросы." : "САВВА БОТ ПОЯСНИТ ПО ХАРДКОРУ."}
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://t.me/SAV_AIbot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-greenland-ice text-greenland-deep font-bold rounded-lg hover:bg-white transition-colors uppercase shadow-[0_0_15px_rgba(0,191,255,0.4)]"
            >
              <MessageCircle size={18} /> {t('const_btn')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};