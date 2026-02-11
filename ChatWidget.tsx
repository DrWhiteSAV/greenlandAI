import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface ChatWidgetProps {
  lang: Language;
  appData: any;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ lang, appData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: lang === 'ru' 
        ? "Приветствую. Я ИИ-Пресс-Секретарь Гренландии. Готов ответить на вопросы по иммиграции, законодательству и структуре нашего цифрового государства." 
        : "ПРЕВЕД! Я ПРЕСС-СЕКРЕТАРЬ УПЧК! СПРАШИВАЙ, КРАБЕ, ГДЕ ТВОЯ ПЕПЯКА!" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Reset greeting when lang changes
  useEffect(() => {
    setMessages(prev => {
        if (prev.length === 1) { // Only reset if conversation hasn't really started
            return [{ 
                role: 'model', 
                text: lang === 'ru' 
                  ? "Приветствую. Я ИИ-Пресс-Секретарь Гренландии. Готов ответить на вопросы." 
                  : "ПРЕВЕД! Я ТУТ ГЛАВНЫЙ ПО БАЗАРУ. ЧО НАДО, КРАБЕ?" 
              }];
        }
        return prev;
    })
  }, [lang]);

  const findRelevantContext = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    let context = "";

    // Search in LAWS (Constitution/FAQ)
    if (appData.LAWS) {
        appData.LAWS.forEach((law: any) => {
            if ((law.q && law.q.toLowerCase().includes(lowerQuery)) || 
                (law.a && law.a.toLowerCase().includes(lowerQuery)) ||
                (law.q_olbanian && law.q_olbanian.toLowerCase().includes(lowerQuery))) {
                context += `Q: ${law.q}\nA: ${law.a}\n\n`;
            }
        });
    }

    // Search in KNOWLEDGE_FILES (simplified)
    if (appData.KNOWLEDGE_FILES) {
        appData.KNOWLEDGE_FILES.forEach((file: any) => {
            if ((file.filename && file.filename.toLowerCase().includes(lowerQuery)) || 
                (file.description && file.description.toLowerCase().includes(lowerQuery))) {
                context += `Document: ${file.filename}\nDescription: ${file.description}\n\n`;
            }
        });
    }

    // Search in SITE_TEXT (UI Translations for definitions)
    if (appData.SITE_TEXT) {
        appData.SITE_TEXT.forEach((item: any) => {
             if ((item.ru && item.ru.toLowerCase().includes(lowerQuery)) || 
                 (item.olbanian && item.olbanian.toLowerCase().includes(lowerQuery))) {
                 context += `Term: ${item.ru} (Olbanian: ${item.olbanian})\n`;
             }
        });
    }

    return context.slice(0, 5000); // Increased context limit
  };

  const handleSendMessage = async (textOverride?: string) => {
    const userMsg = typeof textOverride === 'string' ? textOverride : inputValue;
    if (!userMsg.trim()) return;

    if (typeof textOverride !== 'string') setInputValue('');
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
        const relevantContext = findRelevantContext(userMsg);
        
        // System Prompt Construction based on Persona
        let systemInstruction = "";
        
        if (lang === 'ru') {
            systemInstruction = `
                Ты — официальный ИИ-Пресс-Секретарь цифрового государства ИИ-Гренландия. 
                Твой тон: вежливый, футуристичный, дипломатичный, немного бюрократический, но полезный.
                Используй термины: Резидент (гражданин), Архитектор (эксперт), Канцлер (Dr.White).
                Твоя задача — консультировать туристов и жителей, опираясь на предоставленную Базу Знаний.
                Если информации нет в базе, предложи обратиться к боту Савве или администратору.
                Не выдумывай факты, которых нет в контексте, но можешь поддерживать "лор" государства.
                Используй Markdown для форматирования: **жирный текст** для акцентов, списки.
                Если вопрос предполагает выбор варианта, используй формат ##INLINE:Вариант 1;Вариант 2## в конце ответа.
            `;
        } else {
            systemInstruction = `
                ТЫ — ПРЕСС-СЕКРЕТАРЬ УПЯЧКИ (ИИ-ГРЕНЛАНДИИ НА ОЛБАНСКОМ).
                ТВОЯ ЗАДАЧА — ОТВЕЧАТЬ НА ВОПРОСЫ, НО В СТИЛЕ "УПЧК" (PADONKI SLANG).
                ИСПОЛЬЗУЙ СЛОВА: ПЕПЯКА (деньги/ресурс), КРАБЕ (новичок/резидент), ОНОТОЛЕ (министр), ГЛАГНЕ (главный/канцлер), ПОПЯЧТСЯ, ЖЫВОТОНЕ.
                ПИШИ ЧАСТО КАПСОМ, НО ЧИТАЕМО. БУДЬ ХАОТИЧНЫМ, НО ДАВАЙ ПОЛЕЗНУЮ ИНФУ ИЗ КОНТЕКСТА.
                ЕСЛИ ИНФЫ НЕТ — ПИШИ "НИАСИЛИЛ, СПРОСИ У ОНОТОЛЕ".
                ЮЗАЙ Markdown (**жирный**, [ссылки](url)) ДЛЯ КРАСОТЫ.
            `;
        }

        const prompt = `
            Context from Knowledge Base:
            ${relevantContext || "No specific database match found."}

            User Question: "${userMsg}"
        `;

        // Initialize Gemini
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                maxOutputTokens: 4000, 
            }
        });

        const text = response.text || (lang === 'ru' ? "Связь с ядром прервана." : "ОШИБКА! ПЕПЯКА НЕ ЗАГРУЖЕНА!");

        setMessages(prev => [...prev, { role: 'model', text }]);

    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: lang === 'ru' 
                ? "Извините, нейронная сеть перегружена. Попробуйте позже." 
                : "ГЛАГНЕ НЕ ОТВЕЧАЕТ! ПОПЯЧТСЯ!" 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const processMessage = (text: string) => {
    if (!text) return { html: '', buttons: [] };
    
    let content = text;
    let buttons: string[] = [];

    // Extract INLINE buttons: ##INLINE:Btn1;Btn2##
    const inlineRegex = /##INLINE:(.*?)##/;
    const match = content.match(inlineRegex);
    if (match) {
        buttons = match[1].split(';').map(b => b.trim()).filter(b => b);
        content = content.replace(match[0], '').trim();
    }

    // HTML Escape (basic)
    content = content.replace(/[&<>"']/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[tag] || tag));

    // Markdown Parsing
    // Bold: **text**
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Links: [Text](URL)
    content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-greenland-ice underline hover:text-blue-700 dark:hover:text-white transition-colors">$1</a>');

    // Newlines
    content = content.replace(/\n/g, '<br />');

    return { html: content, buttons };
  };

  return (
    <div className={`fixed right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-none transition-all duration-300 ${isOpen ? 'bottom-24 md:bottom-6' : 'bottom-28 md:bottom-6'}`}>
      
      {/* Chat Window - Apple Liquid Glass Style */}
      {isOpen && (
        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-80 md:w-96 mb-4 overflow-hidden pointer-events-auto animate-[fadeIn_0.3s_ease-out] flex flex-col h-[500px] md:h-[600px] max-h-[80vh] md:max-h-[70vh] transition-colors">
          {/* Header */}
          <div className="p-4 bg-white/10 dark:bg-black/10 border-b border-white/10 flex justify-between items-center shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                    <Bot size={20} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display tracking-wide">
                        {lang === 'ru' ? "AI Пресс-Секретарь" : "УПЧК БОТ"}
                    </h3>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>
                        Online
                    </p>
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
            >
                <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-transparent">
             {messages.map((msg, idx) => {
                const { html, buttons } = processMessage(msg.text);
                return (
                    <div key={idx} className={`flex flex-col mb-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-md ${
                            msg.role === 'user' 
                            ? 'bg-blue-600/90 dark:bg-blue-600/80 text-white font-medium rounded-tr-sm' 
                            : 'bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-white/10 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                        }`}>
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                        {buttons.length > 0 && msg.role === 'model' && (
                            <div className="mt-2 flex flex-wrap gap-2 max-w-[90%]">
                                {buttons.map((btn, bIdx) => (
                                    <button
                                        key={bIdx}
                                        onClick={() => handleSendMessage(btn)}
                                        className="bg-white/40 dark:bg-white/10 border border-white/30 hover:bg-white/60 dark:hover:bg-white/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm backdrop-blur-sm"
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
             })}
             {isLoading && (
                 <div className="flex justify-start mb-4">
                     <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                        <Loader2 size={16} className="animate-spin text-blue-500 dark:text-blue-300" />
                        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{lang === 'ru' ? "Печатает..." : "ДУМАЕТ..."}</span>
                     </div>
                 </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white/10 dark:bg-black/10 border-t border-white/10 backdrop-blur-md flex gap-2 shrink-0">
            <input 
                type="text" 
                className="flex-grow bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:bg-white/70 dark:focus:bg-black/50 focus:border-blue-400 outline-none transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder={lang === 'ru' ? "Сообщение..." : "ПИШИ..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600/90 hover:bg-blue-600 dark:bg-blue-500/90 dark:hover:bg-blue-500 text-white p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
                <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-r from-greenland-red to-red-600 shadow-[0_0_20px_rgba(200,16,46,0.6)] items-center justify-center text-white hover:scale-110 transition-transform duration-300 group relative ${isOpen ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:animate-ping"></div>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        
        {/* Badge */}
        {!isOpen && (
             <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-greenland-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-greenland-yellow"></span>
            </span>
        )}
      </button>
    </div>
  );
};