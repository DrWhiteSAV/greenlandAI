import React, { useState, useRef, useEffect } from 'react';
import { CONTRACT_TYPES } from '../constants';
import { FileText, ExternalLink, AlertTriangle, Eye, Bot, Send, X, Paperclip, Check, Loader2, FileJson, Image as ImageIcon } from 'lucide-react';
import { Language } from '../types';
import { GoogleGenAI } from "@google/genai";

interface MinistryOfLawProps {
    lang: Language;
    t: (key: string) => string;
}

// Configuration from the instruction text
const CONTRACT_CONFIG: Record<string, any> = {
    'partner_ooo': {
        label: "Договор Партнер ООО",
        scriptUrl: 'https://script.google.com/macros/s/AKfycbwjLofxY8l2Q-2nBgrhVa4hSC2JjylFaxy7bvb83VSSp6unE_X9m3iuROjJHRSWoVl6/exec',
        formUrl: 'https://docs.google.com/forms/d/1qvbhzS38JozTFIMXmcxo4dZkyGS4gDKOY51Yh5wUFwE/edit',
        viewUrl: "https://drive.google.com/file/d/1WYoBTqiqvYrK0Vjlrrz0-31vmwE9xyxc/view",
        requiredInfo: `
- Наименование компании
- ФИО генерального директора
- Юридический адрес
- ИНН или БИН
- Номер расчетного счета Р/С
- БИК
- В банке
- Номер телефона
- Email`,
        fields: [
            { key: 'OOOREFDate_now', label: 'Дата (сегодня)', default: 'current_date' },
            { key: 'OOOREFCode', label: 'Код партнера', default: 'user_chat_id' },
            { key: 'OOOREFCompany_name', label: 'Наименование компании' },
            { key: 'OOOREFFullNameFor', label: 'ФИО Ген.директора (род. падеж)' },
            { key: 'OOOREFFullNameDR', label: 'Фамилия И.О. Ген.директора' },
            { key: 'OOOREFCity', label: 'Город' },
            { key: 'OOOREFUrAdress', label: 'Юр. адрес' },
            { key: 'OOOREFINN', label: 'ИНН' },
            { key: 'OOOREFOGRN', label: 'ОГРН' },
            { key: 'OOOREFRS', label: 'Р/С' },
            { key: 'OOOREFKPP', label: 'КПП' },
            { key: 'OOOREFBIK', label: 'БИК' },
            { key: 'OOOREFBank', label: 'Банк' },
            { key: 'OOOREFKS', label: 'К/С' },
            { key: 'OOOREFPhone', label: 'Телефон' },
            { key: 'OOOREFEmail', label: 'Email' },
        ]
    },
    'partner_ip': {
        label: "Договор Партнер ИП",
        scriptUrl: 'https://script.google.com/macros/s/AKfycbyJWxCwLv4Rlh1TZJ0fUG3NKrAa7MMExgkYA5HwDbJfvlUjA9hBizjg7XuWu_LYWhjy6w/exec',
        formUrl: 'https://docs.google.com/forms/d/1mpsYnkDNC7-f0MoFdHmPibUPunGo47um6fj7STIdDUc/edit',
        viewUrl: "https://drive.google.com/file/d/1YmCMHTXToPvBGKWBvisGLWRMNmZtFc1T/view",
        requiredInfo: `
- ФИО
- Серия и номер паспорта
- Кем выдан паспорт
- Когда выдан паспорт
- Город и Страну
- Юридический адрес или адрес регистрации
- ИНН или БИН
- Номер расчетного счета Р/С
- БИК
- В банке
- Номер телефона
- Email`,
        fields: [
            { key: 'IPREFDate_now', label: 'Дата (сегодня)', default: 'current_date' },
            { key: 'IPREFCode', label: 'Код партнера', default: 'user_chat_id' },
            { key: 'IPREFFullName', label: 'ФИО ИП' },
            { key: 'IPREFFullNameAI', label: 'Фамилия И.О.' },
            { key: 'IPREFCity', label: 'Город' },
            { key: 'IPREFAdress', label: 'Адрес регистрации' },
            { key: 'IPREFPassport', label: 'Паспорт (Серия Номер)' },
            { key: 'IPREFDatePassport', label: 'Дата выдачи паспорта' },
            { key: 'IPREFGivePassport', label: 'Кем выдан паспорт' },
            { key: 'IPREFINN', label: 'ИНН' },
            { key: 'IPREFOGRN', label: 'ОГРНИП' },
            { key: 'IPREFRS', label: 'Р/С' },
            { key: 'IPREFKPP', label: 'КПП' },
            { key: 'IPREFBIK', label: 'БИК' },
            { key: 'IPREFBank', label: 'Банк' },
            { key: 'IPREFKS', label: 'К/С' },
            { key: 'IPREFPhone', label: 'Телефон' },
            { key: 'IPREFEmail', label: 'Email' },
        ]
    },
    'partner_smz': {
        label: "Договор Партнер СМЗ",
        scriptUrl: 'https://script.google.com/macros/s/AKfycbwiOaLBDaI0OZLsxiNYErq0jz9h3Hmf-YRF9mih3DdZgQVbGMiAtR778euRCh50BuRFxA/exec',
        formUrl: 'https://docs.google.com/forms/d/1qLLCQQMDA5bnBY1Ro9gv1x8aJ9nqW73iOpUn3TrlsVQ/edit',
        viewUrl: "https://drive.google.com/file/d/1tJeHfDECkeQSntSaP9YEpAR1qxsTGlKW/view",
        requiredInfo: `
- ФИО
- Серия и номер паспорта
- Кем выдан паспорт
- Когда выдан паспорт
- Город и Страну
- Адрес регистрации
- Номер расчетного счета Р/С
- БИК
- В банке
- Номер телефона
- Email`,
        fields: [
            { key: 'SMZREFDate_now', label: 'Дата (сегодня)', default: 'current_date' },
            { key: 'SMZREFCode', label: 'Код партнера', default: 'user_chat_id' },
            { key: 'SMZREFFullName', label: 'ФИО' },
            { key: 'SMZREFFullNameAI', label: 'Фамилия И.О.' },
            { key: 'SMZREFCity', label: 'Город' },
            { key: 'SMZREFAdress', label: 'Адрес регистрации' },
            { key: 'SMZREFPassport', label: 'Паспорт (Серия Номер)' },
            { key: 'SMZREFDatePassport', label: 'Дата выдачи паспорта' },
            { key: 'SMZREFGivePassport', label: 'Кем выдан паспорт' },
            { key: 'SMZREFINN', label: 'ИНН' },
            { key: 'SMZREFOGRN', label: 'ОГРН' },
            { key: 'SMZREFRS', label: 'Р/С' },
            { key: 'SMZREFKPP', label: 'КПП' },
            { key: 'SMZREFBIK', label: 'БИК' },
            { key: 'SMZREFBank', label: 'Банк' },
            { key: 'SMZREFKS', label: 'К/С' },
            { key: 'SMZREFPhone', label: 'Телефон' },
            { key: 'SMZREFEmail', label: 'Email' },
        ]
    },
    'expert_ooo': {
        label: "Договор Эксперт ООО",
        scriptUrl: 'https://script.google.com/macros/s/AKfycbzKr9kyf3cl7Z8u_z_t-NbJalv9XuZXCzoC6lFvYgKgJeM1lhdwMPzbOpMB2F8fo-n8/exec',
        formUrl: 'https://docs.google.com/forms/d/1SpwUA_ma2TE0hk8iFaaFV9jfFqxvifOFY8aV-LPQjJo/edit',
        viewUrl: "https://drive.google.com/file/d/1zu4xf-8WquGz4NixdoLIAPZgRgueGZ5U/view",
        requiredInfo: `
- Наименование компании
- ФИО генерального директора
- Юридический адрес
- ИНН или БИН
- Номер расчетного счета Р/С
- БИК
- В банке
- Номер телефона
- Email`,
        fields: [
            { key: 'OOOEXDate_now', label: 'Дата (сегодня)', default: 'current_date' },
            { key: 'OOOEXCode', label: 'Код партнера', default: 'user_chat_id' },
            { key: 'OOOEXCompany_name', label: 'Наименование компании' },
            { key: 'OOOEXFullNameFor', label: 'ФИО Ген.директора (род. падеж)' },
            { key: 'OOOEXFullNameDR', label: 'Фамилия И.О. Ген.директора' },
            { key: 'OOOEXCity', label: 'Город' },
            { key: 'OOOEXUrAdress', label: 'Юр. адрес' },
            { key: 'OOOEXINN', label: 'ИНН' },
            { key: 'OOOEXOGRN', label: 'ОГРН' },
            { key: 'OOOEXRS', label: 'Р/С' },
            { key: 'OOOEXKPP', label: 'КПП' },
            { key: 'OOOEXBIK', label: 'БИК' },
            { key: 'OOOEXBank', label: 'Банк' },
            { key: 'OOOEXKS', label: 'К/С' },
            { key: 'OOOEXPhone', label: 'Телефон' },
            { key: 'OOOEXEmail', label: 'Email' },
        ]
    },
    'expert_ip': {
        label: "Договор Эксперт ИП",
        scriptUrl: 'https://script.google.com/macros/s/AKfycbyKMOpjNBefamzJAO3OTWmHSt_03_QOJryPO2dL183q9szgT-tCLrYfjVJybj2uEEXu/exec',
        formUrl: 'https://docs.google.com/forms/d/1Aivk4lAtC377nlnW2iBChv5NaOh-eC5JUEz-CkS-HfA/edit',
        viewUrl: "https://drive.google.com/file/d/1-x3XDzpoqX4GHZrbNOt3VvxrMDrNjiao/view",
        requiredInfo: `
- ФИО
- Серия и номер паспорта
- Кем выдан паспорт
- Когда выдан паспорт
- Город и Страну
- Юридический адрес или адрес регистрации
- ИНН или БИН
- Номер расчетного счета Р/С
- БИК
- В банке
- Номер телефона
- Email`,
        fields: [
            { key: 'IPEXDate_now', label: 'Дата (сегодня)', default: 'current_date' },
            { key: 'IPEXCode', label: 'Код партнера', default: 'user_chat_id' },
            { key: 'IPEXFullName', label: 'ФИО ИП' },
            { key: 'IPEXFullNameAI', label: 'Фамилия И.О.' },
            { key: 'IPEXCity', label: 'Город' },
            { key: 'IPEXAdress', label: 'Адрес регистрации' },
            { key: 'IPEXPassport', label: 'Паспорт (Серия Номер)' },
            { key: 'IPEXDatePassport', label: 'Дата выдачи паспорта' },
            { key: 'IPEXGivePassport', label: 'Кем выдан паспорт' },
            { key: 'IPEXINN', label: 'ИНН' },
            { key: 'IPEXOGRN', label: 'ОГРНИП' },
            { key: 'IPEXRS', label: 'Р/С' },
            { key: 'IPEXKPP', label: 'КПП' },
            { key: 'IPEXBIK', label: 'БИК' },
            { key: 'IPEXBank', label: 'Банк' },
            { key: 'IPEXKS', label: 'К/С' },
            { key: 'IPEXPhone', label: 'Телефон' },
            { key: 'IPEXEmail', label: 'Email' },
        ]
    },
    'expert_smz': {
        label: "Договор Эксперт СМЗ",
        scriptUrl: 'https://script.google.com/macros/s/AKfycbwcX7o-JTlYOGwQls41q9oTMnHPCoVGU6wLAAwIyMynAqpc0Yu9LXITWiBNo4beybqKOA/exec',
        formUrl: 'https://docs.google.com/forms/d/1fGaaRniJ52dwCGfRoqMMYONXJNb7VtTt6HAUHPnJ-do/edit',
        viewUrl: "https://drive.google.com/file/d/1z4WH4fnohfRes2novKFBVs3Ogx6f-4pv/view",
        requiredInfo: `
- ФИО
- Серия и номер паспорта
- Кем выдан паспорт
- Когда выдан паспорт
- Город и Страну
- Адрес регистрации
- Номер расчетного счета Р/С
- БИК
- В банке
- Номер телефона
- Email`,
        fields: [
            { key: 'SMZEXDate_now', label: 'Дата (сегодня)', default: 'current_date' },
            { key: 'SMZEXCode', label: 'Код партнера', default: 'user_chat_id' },
            { key: 'SMZEXFullName', label: 'ФИО' },
            { key: 'SMZEXFullNameAI', label: 'Фамилия И.О.' },
            { key: 'SMZEXCity', label: 'Город' },
            { key: 'SMZEXAdress', label: 'Адрес регистрации' },
            { key: 'SMZEXPassport', label: 'Паспорт (Серия Номер)' },
            { key: 'SMZEXDatePassport', label: 'Дата выдачи паспорта' },
            { key: 'SMZEXGivePassport', label: 'Кем выдан паспорт' },
            { key: 'SMZEXINN', label: 'ИНН' },
            { key: 'SMZEXOGRN', label: 'ОГРН' },
            { key: 'SMZEXRS', label: 'Р/С' },
            { key: 'SMZEXKPP', label: 'КПП' },
            { key: 'SMZEXBIK', label: 'БИК' },
            { key: 'SMZEXBank', label: 'Банк' },
            { key: 'SMZEXKS', label: 'К/С' },
            { key: 'SMZEXPhone', label: 'Телефон' },
            { key: 'SMZEXEmail', label: 'Email' },
        ]
    }
};

interface Message {
    role: 'user' | 'model';
    text: string;
    isSystem?: boolean;
    extractedData?: any;
    isAction?: boolean;
}

export const MinistryOfLaw: React.FC<MinistryOfLawProps> = ({ lang, t }) => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{data: string, mimeType: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting when contract selected
  useEffect(() => {
    if (selectedContract) {
        const config = CONTRACT_CONFIG[selectedContract];
        const dateNow = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
        
        const welcomeMsg = `Для составления договора и счета мне понадобится Код Партнера (из профиля). 
Для договора я буду использовать текущую дату.
Сегодня ${dateNow}.
        
Вы можете ознакомиться с условиями договора перед его созданием по ссылке:
[${config.label}](${config.viewUrl})

Для заполнения реквизитов в договор мне необходимы сведения. Как удобнее Вам прислать информацию?
1. В формате текста ✍️
2. В виде картинки, фото или скриншота 🖼`;

        setMessages([
            { role: 'model', text: welcomeMsg, isSystem: true }
        ]);
        setUploadedFile(null);
    }
  }, [selectedContract]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              // Extract base64 data without prefix
              const data = base64String.split(',')[1];
              setUploadedFile({
                  data: data,
                  mimeType: file.type
              });
              // Auto-send suggestion
              setInputText(prev => prev || "Вот файл с реквизитами, проанализируй его.");
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSendMessage = async () => {
      if ((!inputText.trim() && !uploadedFile) || !selectedContract) return;

      const userMsg = inputText;
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setInputText('');
      setIsLoading(true);

      const config = CONTRACT_CONFIG[selectedContract];

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Construct System Prompt for Extraction
          const fieldList = config.fields.map((f: any) => `${f.key} (${f.label})`).join('\n');
          
          const systemPrompt = `
            You are a Contract Assistant for AI-GreenLand. 
            Current Contract Type: ${config.label}.
            
            REQUIRED FIELDS TO EXTRACT FOR THIS CONTRACT:
            ${fieldList}
            
            INSTRUCTIONS:
            1. If the user asks what info is needed, reply with this list:
               ${config.requiredInfo}
            2. If the user provides requisites (text or image), extract them into a JSON object.
            3. "Date_now" fields: Use today's date in format "DD month YYYY г.".
            4. "Code": If provided in context, use it. Else "-".
            5. If a field is missing, put "-" (dash). Do NOT invent data.
            6. Return ONLY valid JSON in your response if you extracted data. 
            7. If you extracted data, do not add conversational text outside the JSON.
            8. If you cannot extract data (e.g. user is just chatting), reply conversationally in Russian.
          `;

          // Use 'gemini-flash-latest' for multimodal/file inputs (PDFs/Images) as it is reliable for this.
          // Use 'gemini-3-flash-preview' for text-only interactions.
          const modelName = uploadedFile ? 'gemini-flash-latest' : 'gemini-3-flash-preview';

          const contentParts: any[] = [];
          if (uploadedFile) {
              contentParts.push({
                  inlineData: {
                      mimeType: uploadedFile.mimeType,
                      data: uploadedFile.data
                  }
              });
          }
          contentParts.push({ text: userMsg });

          const response = await ai.models.generateContent({
              model: modelName,
              contents: { parts: contentParts },
              config: {
                  systemInstruction: systemPrompt,
                  temperature: 0.1, // Low temp for extraction accuracy
                  maxOutputTokens: 8192, // Ensure enough tokens for JSON from PDF
              }
          });

          let responseText = response.text || "Ошибка обработки.";
          let extractedJson = null;

          // Try parsing JSON
          try {
              // Clean code blocks if present
              const jsonMatch = responseText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                  extractedJson = JSON.parse(jsonMatch[0]);
              }
          } catch (e) {
              // Not JSON, treat as conversational response
          }

          if (extractedJson) {
              // We got data!
              // Auto-fill defaults if missing/dash
              const dateNow = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }) + ' г.';
              
              // Apply defaults based on config
              config.fields.forEach((field: any) => {
                  if (field.default === 'current_date') {
                      extractedJson[field.key] = dateNow;
                  }
                  // We can't easily access user profile here without passing it down, so we rely on extraction or user input
                  if (!extractedJson[field.key] || extractedJson[field.key] === '-') {
                       extractedJson[field.key] = '-';
                  }
              });

              // Add formUrl which is mandatory for the backend script
              extractedJson['formUrl'] = config.formUrl;

              setMessages(prev => [...prev, { 
                  role: 'model', 
                  text: `Вот все сведения, которые я извлек для создания договора "${config.label}":`,
                  extractedData: extractedJson 
              }]);
          } else {
              setMessages(prev => [...prev, { role: 'model', text: responseText }]);
          }

      } catch (error) {
          console.error("AI Error:", error);
          setMessages(prev => [...prev, { role: 'model', text: "Произошла ошибка при анализе. Попробуйте отправить данные текстом или убедитесь, что файл не поврежден." }]);
      } finally {
          setIsLoading(false);
          setUploadedFile(null);
      }
  };

  const handleConfirmAndSend = async (jsonData: any) => {
    setIsLoading(true);
    const config = CONTRACT_CONFIG[selectedContract!];
    
    try {
        // Send to Google Apps Script
        // Note: Using no-cors mode because GAS usually doesn't support CORS for direct POSTs easily without specific setup.
        // However, we can't read the response in no-cors. 
        // We will assume success if no network error occurs, or try standard fetch if the backend supports it.
        
        await fetch(config.scriptUrl, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        });

        setMessages(prev => [...prev, { 
            role: 'model', 
            text: "✅ Информация была передана в систему. В течении минуты будет прислан договор и счет в Telegram. Если документы не пришли, обратитесь к руководителю Dr.White (@shishkarnem).",
            isAction: true
        }]);

    } catch (error) {
        console.error("Network Error:", error);
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: "❌ Ошибка соединения с сервером. Попробуйте позже или заполните форму вручную по ссылке в начале диалога." 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {!selectedContract ? (
        // --- STEP 1: SELECT CONTRACT TYPE ---
        <>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">{t('law_title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('law_desc')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CONTRACT_TYPES.map((contract) => (
                <div key={contract.id} className="bg-greenland-surface/80 border border-greenland-ice/10 rounded-xl p-6 hover:border-greenland-red/50 dark:hover:border-greenland-yellow/50 hover:shadow-lg transition-all group flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-100 dark:bg-greenland-deep rounded-lg border border-gray-300 dark:border-gray-700 group-hover:border-greenland-red dark:group-hover:border-greenland-yellow group-hover:text-greenland-red dark:group-hover:text-greenland-yellow transition-colors">
                        <FileText size={24} className="text-gray-700 dark:text-white group-hover:text-greenland-red dark:group-hover:text-greenland-yellow" />
                    </div>
                    <span className="text-xs font-mono text-gray-500 bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">
                        DOC-{contract.id.toUpperCase()}
                    </span>
                    </div>
                    
                    <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">{contract.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{contract.description}</p>
                    
                    <div className="mb-6">
                    <p className="text-xs text-greenland-ice mb-2 uppercase tracking-wider font-bold">{lang === 'ru' ? "Требуется:" : "НАДО:"}</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {contract.requiredDocs.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-greenland-red rounded-full" /> {doc}
                        </li>
                        ))}
                    </ul>
                    </div>

                    <div className="flex gap-2 mt-auto">
                        <a 
                            href={contract.viewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-greenland-deep border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:text-gray-900 dark:hover:text-white hover:border-gray-500 font-bold transition-all flex-1 uppercase text-sm"
                        >
                            <Eye size={16} /> {lang === 'ru' ? "Образец" : "ЗЫРИТЬ"}
                        </a>
                        <button 
                            onClick={() => setSelectedContract(contract.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-greenland-ice/10 border border-greenland-ice/30 text-greenland-ice rounded-lg hover:bg-greenland-ice hover:text-greenland-deep font-bold transition-all flex-[2] uppercase text-sm"
                        >
                            {lang === 'ru' ? "Подписать" : "ЧЕРКАНУТЬ"} <Bot size={16} />
                        </button>
                    </div>
                </div>
                ))}
            </div>

            <div className="mt-12 bg-greenland-red/5 dark:bg-greenland-yellow/5 border border-greenland-red/20 dark:border-greenland-yellow/20 p-6 rounded-xl flex items-start gap-4">
                <AlertTriangle className="text-greenland-red dark:text-greenland-yellow shrink-0 mt-1" />
                <div>
                <h4 className="font-bold text-greenland-red dark:text-greenland-yellow mb-2">{lang === 'ru' ? "Важная информация от Канцлера" : "ВНИМАНИЕ! ГЛАГНЕ СЛЕДИТ!"}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {lang === 'ru' 
                    ? "Используйте ИИ-ассистента для быстрого заполнения договора. Система автоматически сгенерирует документы и отправит их вам."
                    : "ЮЗАЙ БОТА, ОН СДЕЛАЕТ ВСЕ КРАСИВО. БУМАЖКИ ПРИЛЕТЯТ В ТЕЛЕГУ."}
                </p>
                </div>
            </div>
        </>
      ) : (
        // --- STEP 2: CONTRACT WIZARD (CHAT) - Apple Liquid Glass Style ---
        <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden relative animate-fadeIn transition-colors">
             {/* Header */}
             <div className="bg-white/10 dark:bg-black/10 p-4 border-b border-white/10 flex justify-between items-center transition-colors backdrop-blur-md">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-greenland-ice/20 rounded-full flex items-center justify-center border border-greenland-ice/50">
                         <Bot className="text-greenland-ice" size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-gray-900 dark:text-white font-display">Ассистент Договоров</h3>
                         <p className="text-xs text-gray-500 dark:text-gray-300">Оформление: <span className="text-greenland-ice uppercase">{CONTRACT_CONFIG[selectedContract]?.label || "Договор"}</span></p>
                     </div>
                 </div>
                 <button onClick={() => { setSelectedContract(null); setMessages([]); }} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                     <X size={24} />
                 </button>
             </div>

             {/* Chat Area */}
             <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4 bg-transparent">
                 {messages.map((msg, idx) => (
                     <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                         <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm backdrop-blur-md ${
                             msg.role === 'user' 
                             ? 'bg-blue-600/90 dark:bg-greenland-ice/90 text-white dark:text-greenland-deep rounded-tr-sm font-medium' 
                             : 'bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-white/10 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                         }`}>
                             {msg.isSystem ? (
                                 <div className="space-y-2">
                                     <Bot size={16} className="text-greenland-ice mb-2" />
                                     <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-500 dark:text-greenland-ice underline font-bold">$1</a>') }} />
                                 </div>
                             ) : (
                                 msg.text
                             )}

                             {/* Data Confirmation Card */}
                             {msg.extractedData && (
                                 <div className="mt-4 bg-white/50 dark:bg-black/40 p-3 rounded-xl border border-white/20 dark:border-white/10 font-mono text-xs text-gray-800 dark:text-white">
                                     <div className="flex items-center gap-2 text-greenland-ice mb-2 font-bold uppercase">
                                         <FileJson size={14} /> Распознанные данные
                                     </div>
                                     <div className="space-y-1 mb-4">
                                         {Object.entries(msg.extractedData).map(([key, val]) => {
                                             if (key === 'formUrl') return null;
                                             return (
                                                 <div key={key} className="flex justify-between border-b border-gray-400/20 dark:border-white/10 pb-1">
                                                     <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                                                     <span className="font-bold text-right truncate max-w-[200px]">{String(val)}</span>
                                                 </div>
                                             )
                                         })}
                                     </div>
                                     <div className="flex gap-2">
                                         <button 
                                            onClick={() => setInputText("Данные неверны, давай заполним заново текстом.")}
                                            className="flex-1 py-2 bg-red-100/50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-200/50 dark:hover:bg-red-900/50 transition-colors"
                                         >
                                             Исправить
                                         </button>
                                         <button 
                                            onClick={() => handleConfirmAndSend(msg.extractedData)}
                                            className="flex-1 py-2 bg-green-100/50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-lg hover:bg-green-200/50 dark:hover:bg-green-900/50 transition-colors font-bold flex items-center justify-center gap-2"
                                         >
                                             <Check size={14} /> Все верно, отправить
                                         </button>
                                     </div>
                                 </div>
                             )}
                         </div>
                     </div>
                 ))}
                 {isLoading && (
                     <div className="flex justify-start">
                         <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                             <Loader2 size={16} className="animate-spin text-greenland-ice" />
                             <span className="text-xs text-gray-500 dark:text-gray-300">Анализирую данные...</span>
                         </div>
                     </div>
                 )}
                 <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white/10 dark:bg-black/10 border-t border-white/10 backdrop-blur-md flex gap-2 items-end transition-colors">
                 <div className="relative">
                     <input 
                        type="file" 
                        id="contract-file" 
                        className="hidden" 
                        accept="image/*,application/pdf" // Note: PDF handling in frontend FileReader is tricky, sticking to images usually safer for quick demo, but user can try
                        onChange={handleFileUpload}
                     />
                     <label htmlFor="contract-file" className={`p-3 rounded-xl border cursor-pointer flex items-center justify-center transition-colors ${
                         uploadedFile 
                         ? 'bg-greenland-ice/20 border-greenland-ice text-greenland-ice' 
                         : 'bg-white/50 dark:bg-black/30 border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/70'
                     }`}>
                         <Paperclip size={20} />
                     </label>
                     {uploadedFile && (
                         <div className="absolute -top-3 -right-3 w-4 h-4 bg-greenland-ice rounded-full animate-pulse" />
                     )}
                 </div>
                 
                 <div className="flex-grow relative">
                    <textarea 
                        className="w-full bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:bg-white/70 dark:focus:bg-black/50 focus:border-greenland-ice outline-none transition-all resize-none custom-scrollbar placeholder-gray-500 dark:placeholder-gray-400"
                        rows={1}
                        placeholder={uploadedFile ? "Файл прикреплен. Добавьте комментарий или отправьте." : "Введите реквизиты текстом или прикрепите фото..."}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                 </div>
                 
                 <button 
                    onClick={handleSendMessage}
                    disabled={(!inputText.trim() && !uploadedFile) || isLoading}
                    className="p-3 bg-greenland-ice/90 hover:bg-greenland-ice text-greenland-deep rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-greenland-ice/20"
                 >
                     <Send size={20} />
                 </button>
             </div>
        </div>
      )}
    </div>
  );
};