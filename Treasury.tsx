import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Wallet, FileText, CheckCircle, Clock, Building2, Package, Calendar, MessageSquare, Monitor } from 'lucide-react';
import { Language } from '../types';

const MOCK_DATA = [
  { name: 'Янв', income: 4000, payout: 2400 },
  { name: 'Фев', income: 3000, payout: 1398 },
  { name: 'Мар', income: 2000, payout: 9800 },
  { name: 'Апр', income: 2780, payout: 3908 },
  { name: 'Май', income: 1890, payout: 4800 },
  { name: 'Июн', income: 2390, payout: 3800 },
];

interface TreasuryProps {
    lang: Language;
    t: (key: string) => string;
    appData?: any;
}

export const Treasury: React.FC<TreasuryProps> = ({ lang, t, appData }) => {
  // Filter leads for the current partner (Hardcoded 'IVAN24' for this profile demo)
  const partnerLeads = appData?.LEADS?.filter((lead: any) => lead.partner_code === 'IVAN24') || [];

  return (
    <div className="w-full animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">{t('tr_title')}</h2>
           <p className="text-gray-600 dark:text-gray-400">{t('tr_desc')}</p>
        </div>
        <div className="bg-gray-100 dark:bg-greenland-deep px-4 py-2 rounded-lg border border-gray-300 dark:border-greenland-ice/30">
          <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">{lang === 'ru' ? "Текущий курс:" : "КУРС ПЕПЯКИ:"}</span>
          <span className="text-greenland-ice font-mono font-bold">1 AI = 1 RUB</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-greenland-surface/80 p-6 rounded-xl border-l-4 border-greenland-ice shadow-lg">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">{t('tr_stat_ref')}</p>
               <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">12</h3>
             </div>
             <Users className="text-greenland-ice opacity-50" />
           </div>
           <p className="text-greenland-ice text-xs flex items-center gap-1">
             <TrendingUp size={12} /> {lang === 'ru' ? "+2 на этой неделе" : "+2 КРАБА"}
           </p>
        </div>

        <div className="bg-greenland-surface/80 p-6 rounded-xl border-l-4 border-greenland-red dark:border-greenland-yellow shadow-lg">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">{t('tr_stat_wait')}</p>
               <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">10,000 ₽</h3>
             </div>
             <Wallet className="text-greenland-red dark:text-greenland-yellow opacity-50" />
           </div>
           <p className="text-gray-500 text-xs">{lang === 'ru' ? "Дата транзакции: 15.07.2024" : "СКОРО БУДЕТ"}</p>
        </div>

        <div className="bg-greenland-surface/80 p-6 rounded-xl border-l-4 border-greenland-red shadow-lg">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">{t('tr_stat_total')}</p>
               <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">55,000 ₽</h3>
             </div>
             <div className="text-greenland-red font-bold text-xl">₽</div>
           </div>
           <p className="text-greenland-red text-xs">{lang === 'ru' ? "Все налоги уплачены" : "УПЧК ОДОБРЯЕТ"}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-greenland-surface/80 p-6 rounded-xl border border-greenland-ice/10 h-full">
          <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">{t('tr_chart_title')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₽${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#00BFFF' }}
                  labelStyle={{ color: '#64748b' }}
                />
                <Bar dataKey="payout" fill="#00BFFF" radius={[4, 4, 0, 0]} name="Выплаты">
                   {MOCK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00BFFF' : '#1E90FF'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads List / Blocks */}
        <div className="lg:col-span-1 flex flex-col h-full min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-greenland-ice"/>
                {t('tr_list_title')}
             </h3>
             <span className="bg-greenland-ice/10 text-greenland-ice text-xs font-bold px-2 py-1 rounded-full">{partnerLeads.length}</span>
          </div>
          
          <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[60vh] lg:max-h-full">
            {partnerLeads.length > 0 ? partnerLeads.map((lead: any, idx: number) => {
              const isPaid = (lead.status || '').toLowerCase().includes('оплачено');
              return (
              <div key={idx} className="bg-greenland-surface/80 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md hover:border-greenland-ice/30 transition-all group relative overflow-hidden">
                 <div className={`absolute top-0 right-0 w-2 h-full ${isPaid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                 
                 <div className="flex justify-between items-start mb-3 pr-4">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{lead.product}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                            <Monitor size={10} />
                            {lead.service || 'Service'}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-lg font-mono font-bold ${isPaid ? 'text-green-500' : 'text-greenland-red dark:text-greenland-yellow'}`}>
                            {lead.sum ? Number(lead.sum).toLocaleString() : '0'} ₽
                        </span>
                    </div>
                 </div>

                 <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Building2 size={14} className="text-gray-400" />
                        <span className="font-medium">{lead.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users size={14} className="text-gray-400" />
                        <span>{lead.fio}</span>
                    </div>
                 </div>

                 <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        {lead.messenger_tg_bot && <div className="p-1 bg-blue-500/10 rounded text-blue-500" title="Telegram Bot"><MessageSquare size={12}/></div>}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-bold uppercase flex items-center gap-1 mb-0.5 ${isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                            {isPaid ? <CheckCircle size={10} /> : <Clock size={10} />}
                            {lead.status || 'В работе'}
                        </span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-1">
                            <Calendar size={9} /> {lead.timestamp}
                        </span>
                    </div>
                 </div>
              </div>
            )}) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl p-8">
                    <Package size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Нет активных лидов</p>
                    <p className="text-xs mt-1 text-center">Используйте промокод для привлечения клиентов</p>
                </div>
            )}
          </div>
          
          {partnerLeads.length > 0 && (
              <button className="mt-4 w-full py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-greenland-ice border border-gray-200 dark:border-gray-800 hover:border-greenland-ice rounded-lg transition-all">
                {lang === 'ru' ? "Показать всю историю" : "ВСЕ ХОДЫ ЗАПИСАНЫ"}
              </button>
          )}
        </div>
      </div>
    </div>
  );
};