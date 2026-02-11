import React, { useState } from 'react';
import { FAQ_DATA } from '../constants';
import { Plus, Minus, MessageCircle } from 'lucide-react';

export const Library: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-display font-bold text-white mb-8 text-center">Королевская Библиотека</h2>
        
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div 
              key={index} 
              className="bg-greenland-surface border border-greenland-ice/10 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-greenland-deep/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-lg text-white font-display">{item.q}</span>
                {openIndex === index ? (
                  <Minus className="text-greenland-red" />
                ) : (
                  <Plus className="text-greenland-ice" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-400 border-t border-gray-800 mt-2">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-greenland-deep to-greenland-surface border border-greenland-ice/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Остались вопросы?</h3>
            <p className="text-gray-400 text-sm">
              Бот Савва готов ответить на технические вопросы, а Dr.White решает государственные дела.
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://t.me/SAV_AIbot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-greenland-ice text-greenland-deep font-bold rounded-lg hover:bg-white transition-colors"
            >
              <MessageCircle size={18} /> Спросить Савву
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};