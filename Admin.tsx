import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Search, Filter, Lock, RefreshCw, Send, Edit2, X, Save, Check, Map as MapIcon, Move, Trash2, Plus, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MessageSquare, FileText, GripVertical, Book, Upload, FilePlus, File as FileIcon, XCircle, Eye, EyeOff, MoreVertical, GripHorizontal, Users, Paperclip, PlusCircle, Link as LinkIcon, Bold, Italic, Code, Quote, Variable, Image as ImageIcon, Smartphone, MousePointer, Globe
} from 'lucide-react';
import { CityNode, InlineButton } from '../types';

type AdminTab = 'CRM' | 'LEADS' | 'PARTNERS' | 'EXPERTS' | 'LOGS' | 'AI2' | 'BROADCAST' | 'RULES' | 'MAP' | 'LAWS' | 'SITE_TEXT' | 'KNOWLEDGE' | 'IPREF';

interface ColumnDef {
  key: string;
  label: string;
  width: number;
  type?: 'text' | 'number' | 'status' | 'date';
  visible: boolean;
}

// Initial Configuration
const INITIAL_COLS: Record<string, ColumnDef[]> = {
  CRM: [
    { key: 'chat_id', label: 'Chat ID', width: 120, visible: true },
    { key: 'partner_code', label: 'Код Партнера', width: 120, visible: true },
    { key: 'fio', label: 'ФИО', width: 200, visible: true },
    { key: 'promo', label: 'Промокод', width: 120, visible: true },
    { key: 'telegram', label: 'Телеграм', width: 150, visible: true },
    { key: 'status', label: 'Статус', width: 100, visible: true, type: 'status' },
  ],
  LEADS: [
    { key: 'timestamp', label: 'Дата', width: 120, visible: true },
    { key: 'fio', label: 'ФИО', width: 200, visible: true },
    { key: 'company', label: 'Компания', width: 150, visible: true },
    { key: 'product', label: 'Продукт', width: 150, visible: true },
    { key: 'sum', label: 'Сумма', width: 100, visible: true, type: 'number' },
    { key: 'status', label: 'Статус', width: 120, visible: true, type: 'status' },
    { key: 'partner_code', label: 'Партнер', width: 100, visible: true },
  ],
  PARTNERS: [
    { key: 'timestamp', label: 'Дата', width: 120, visible: true },
    { key: 'fio', label: 'ФИО', width: 200, visible: true },
    { key: 'partner_code', label: 'Код', width: 120, visible: true },
    { key: 'telegram', label: 'TG', width: 150, visible: true },
    { key: 'status', label: 'Статус', width: 100, visible: true, type: 'status' },
  ],
  EXPERTS: [
    { key: 'timestamp', label: 'Дата', width: 120, visible: true },
    { key: 'fio', label: 'ФИО', width: 200, visible: true },
    { key: 'promo', label: 'Промо', width: 120, visible: true },
    { key: 'telegram', label: 'TG', width: 150, visible: true },
    { key: 'status', label: 'Статус', width: 100, visible: true, type: 'status' },
  ],
  LOGS: [
    { key: 'timestamp', label: 'Время', width: 150, visible: true },
    { key: 'chat_id', label: 'Chat ID', width: 120, visible: true },
    { key: 'question', label: 'Вопрос', width: 300, visible: true },
    { key: 'ai_reply', label: 'Ответ ИИ', width: 300, visible: true },
  ],
  AI2: [
    { key: 'timestamp', label: 'Время', width: 150, visible: true },
    { key: 'chat_id', label: 'Chat ID', width: 120, visible: true },
    { key: 'question', label: 'Вопрос', width: 250, visible: true },
    { key: 'ai_reply', label: 'Ответ', width: 250, visible: true },
  ],
  BROADCAST: [
    { key: 'date_sent', label: 'Дата', width: 150, visible: true },
    { key: 'message', label: 'Сообщение', width: 300, visible: true },
    { key: 'chat_ids', label: 'Получатели', width: 150, visible: true },
    { key: 'status', label: 'Статус', width: 100, visible: true, type: 'status' },
  ],
  RULES: [
    { key: 'rule', label: 'Правило', width: 200, visible: true },
    { key: 'text_col', label: 'Текст', width: 300, visible: true },
  ],
  LAWS: [
    { key: 'q', label: 'Вопрос (RU)', width: 300, visible: true },
    { key: 'q_olbanian', label: 'Вопрос (УПЧК)', width: 300, visible: true },
    { key: 'a', label: 'Ответ (RU)', width: 400, visible: true },
    { key: 'a_olbanian', label: 'Ответ (УПЧК)', width: 400, visible: true },
  ],
  SITE_TEXT: [
    { key: 'key', label: 'Ключ', width: 150, visible: true },
    { key: 'ru', label: 'RU', width: 300, visible: true },
    { key: 'olbanian', label: 'УПЧК', width: 300, visible: true },
  ],
  KNOWLEDGE: [
    { key: 'category', label: 'Категория', width: 150, visible: true },
    { key: 'content', label: 'Содержимое', width: 400, visible: true },
    { key: 'answer', label: 'Ответ/Описание', width: 400, visible: true },
    { key: 'files', label: 'Файлы', width: 150, visible: true },
  ],
  IPREF: [
      { key: 'timestamp', label: 'Дата', width: 150, visible: true },
      { key: 'IPREFFullName', label: 'ФИО', width: 200, visible: true },
      { key: 'IPREFPhone', label: 'Телефон', width: 150, visible: true },
      { key: 'IPREFCity', label: 'Город', width: 150, visible: true },
  ]
};

interface AdminProps {
  mapImage: string;
  cities: CityNode[];
  onUpdateMapImage: (url: string) => void;
  onUpdateCities: (cities: CityNode[]) => void;
  appData: any;
  setAppData: (data: any) => void;
}

export const Admin: React.FC<AdminProps> = ({ mapImage, cities, onUpdateMapImage, onUpdateCities, appData, setAppData }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('CRM');
  
  // Tab Management
  const [tabOrder, setTabOrder] = useState<string[]>(() => {
    const cols = Object.keys(INITIAL_COLS);
    if (!cols.includes('MAP')) cols.push('MAP');
    return cols;
  });
  const [draggedTab, setDraggedTab] = useState<string | null>(null);

  // Column State
  const [columnConfigs, setColumnConfigs] = useState<Record<string, ColumnDef[]>>(INITIAL_COLS);
  const [showColSettings, setShowColSettings] = useState(false);

  // Data Filters & Pagination
  const [filters, setFilters] = useState<Record<string, Record<string, string>>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Map Editor State
  const [draggingCityId, setDraggingCityId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [editingCity, setEditingCity] = useState<CityNode | null>(null);

  // Row Editing
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- Broadcast State ---
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [recipientFilter, setRecipientFilter] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [inlineButtons, setInlineButtons] = useState<{text: string, type: 'url' | 'callback' | 'webapp', value: string}[]>([]);
  const [showVarSelector, setShowVarSelector] = useState(false);
  const msgTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // --- Knowledge State ---
  const [knowledgeFiles, setKnowledgeFiles] = useState<string[]>([]);
  const [knowCategory, setKnowCategory] = useState('');
  const [knowContent, setKnowContent] = useState('');
  const [knowAnswer, setKnowAnswer] = useState('');
  const [customFields, setCustomFields] = useState<{key: string, value: string}[]>([]);

  // --- Handlers ---

  // Tab Dragging
  const handleTabDragStart = (e: React.DragEvent, tab: string) => {
    setDraggedTab(tab);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleTabDragOver = (e: React.DragEvent, targetTab: string) => {
    e.preventDefault();
    if (!draggedTab || draggedTab === targetTab) return;

    const newOrder = [...tabOrder];
    const draggedIdx = newOrder.indexOf(draggedTab);
    const targetIdx = newOrder.indexOf(targetTab);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedTab);

    setTabOrder(newOrder);
  };

  // Column Resizing
  const handleColumnResize = (e: React.MouseEvent, tab: string, colKey: string) => {
    e.preventDefault();
    const startX = e.pageX;
    const currentCols = columnConfigs[tab];
    const colIndex = currentCols.findIndex(c => c.key === colKey);
    const startWidth = currentCols[colIndex].width;

    const onMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.pageX - startX;
        const newWidth = Math.max(50, startWidth + diff);
        
        setColumnConfigs(prev => {
            const newCols = [...prev[tab]];
            newCols[colIndex] = { ...newCols[colIndex], width: newWidth };
            return { ...prev, [tab]: newCols };
        });
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Column Visibility Toggle
  const toggleColumnVisibility = (tab: string, colKey: string) => {
      setColumnConfigs(prev => {
          const newCols = prev[tab].map(col => 
              col.key === colKey ? { ...col, visible: !col.visible } : col
          );
          return { ...prev, [tab]: newCols };
      });
  };

  // Row Editing
  const handleEditRow = (row: any) => {
      setEditingRow(row);
      setIsEditModalOpen(true);
  };

  const handleSaveRow = () => {
      if (!editingRow) return;
      const currentData = appData[activeTab] || [];
      const rowIndex = currentData.findIndex((r: any) => 
          (r.id && r.id === editingRow.id) || 
          (r.chat_id && r.chat_id === editingRow.chat_id) ||
          JSON.stringify(r) === JSON.stringify(editingRow) 
      );

      if (rowIndex >= 0) {
          const newData = [...currentData];
          newData[rowIndex] = editingRow;
          setAppData({ ...appData, [activeTab]: newData });
      } else {
          // New Row Logic handled separately for broadcast/knowledge usually
      }
      setIsEditModalOpen(false);
      setEditingRow(null);
  };

  const handleDeleteRow = () => {
      if (!editingRow) return;
      const currentData = appData[activeTab] || [];
      const newData = currentData.filter((r: any) => r !== editingRow); 
      setAppData({ ...appData, [activeTab]: newData });
      setIsEditModalOpen(false);
      setEditingRow(null);
  };

  // --- Broadcast Logic ---
  
  // Filter Recipients
  const filteredRecipients = useMemo(() => {
      const crmData = appData.CRM || [];
      if (!recipientFilter) return crmData;
      const lowFilter = recipientFilter.toLowerCase();
      return crmData.filter((u: any) => 
          (u.fio && u.fio.toLowerCase().includes(lowFilter)) ||
          (u.chat_id && u.chat_id.includes(lowFilter)) ||
          (u.telegram && u.telegram.toLowerCase().includes(lowFilter))
      );
  }, [appData.CRM, recipientFilter]);

  const toggleRecipient = (chatId: string) => {
      setSelectedRecipients(prev => 
          prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
      );
  };

  const toggleAllRecipients = () => {
      if (selectedRecipients.length === filteredRecipients.length) {
          setSelectedRecipients([]);
      } else {
          setSelectedRecipients(filteredRecipients.map((u: any) => u.chat_id));
      }
  };

  // Text Editor Tools
  const insertTextTag = (tagStart: string, tagEnd: string) => {
      if (!msgTextAreaRef.current) return;
      const start = msgTextAreaRef.current.selectionStart;
      const end = msgTextAreaRef.current.selectionEnd;
      const text = broadcastMsg;
      const before = text.substring(0, start);
      const selection = text.substring(start, end);
      const after = text.substring(end);
      
      const newText = before + tagStart + selection + tagEnd + after;
      setBroadcastMsg(newText);
      // Logic to restore focus or selection could go here
  };

  const insertVariable = (varName: string) => {
      if (!msgTextAreaRef.current) return;
      const start = msgTextAreaRef.current.selectionStart;
      const text = broadcastMsg;
      const newText = text.substring(0, start) + `{${varName}}` + text.substring(start);
      setBroadcastMsg(newText);
      setShowVarSelector(false);
  };

  // Button Constructor
  const addInlineButton = () => {
      setInlineButtons([...inlineButtons, { text: '', type: 'url', value: '' }]);
  };

  const removeInlineButton = (idx: number) => {
      setInlineButtons(inlineButtons.filter((_, i) => i !== idx));
  };

  const updateInlineButton = (idx: number, field: keyof typeof inlineButtons[0], val: string) => {
      const newBtns = [...inlineButtons];
      // @ts-ignore
      newBtns[idx][field] = val;
      setInlineButtons(newBtns);
  };

  const sendBroadcast = () => {
      if (!broadcastMsg.trim() && !mediaUrl) return;
      if (selectedRecipients.length === 0) {
          alert("Выберите хотя бы одного получателя.");
          return;
      }

      // Check limits
      const limit = mediaUrl ? 1024 : 4096;
      if (broadcastMsg.length > limit) {
          // Logic for splitting would happen on backend, visually we show it's long
          // For demo, we just proceed
      }

      const newEntry = {
          date_sent: new Date().toLocaleString('ru-RU'),
          message: broadcastMsg.substring(0, 50) + (broadcastMsg.length > 50 ? '...' : ''),
          chat_ids: `${selectedRecipients.length} recipients`,
          status: 'Отправлено'
      };
      setAppData({ ...appData, BROADCAST: [newEntry, ...(appData.BROADCAST || [])] });
      setBroadcastMsg('');
      setMediaUrl('');
      setInlineButtons([]);
      setSelectedRecipients([]);
  };

  const charCount = broadcastMsg.length;
  const maxChars = mediaUrl ? 1024 : 4096;
  const isOverLimit = charCount > maxChars;

  // Knowledge Logic
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const names = Array.from(e.target.files).map((f: any) => f.name);
          setKnowledgeFiles(prev => [...prev, ...names]);
      }
  };

  const addKnowledgeEntry = () => {
      const entry: any = {
          category: knowCategory,
          content: knowContent,
          answer: knowAnswer,
          files: knowledgeFiles.join(', ')
      };
      // Add custom fields
      customFields.forEach(f => {
          if(f.key) entry[f.key] = f.value;
      });

      setAppData({ ...appData, KNOWLEDGE: [entry, ...(appData.KNOWLEDGE || [])] });
      
      // Reset form
      setKnowCategory('');
      setKnowContent('');
      setKnowAnswer('');
      setKnowledgeFiles([]);
      setCustomFields([]);
  };

  const addCustomField = () => {
      setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const updateCustomField = (idx: number, field: 'key' | 'value', val: string) => {
      const newFields = [...customFields];
      newFields[idx][field] = val;
      setCustomFields(newFields);
  };

  // Filter Logic
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: value
      }
    }));
    setCurrentPage(1); 
  };

  const getFilteredData = useMemo(() => {
    if (activeTab === 'MAP') return [];
    
    // Fallback for missing data
    const tabData = appData[activeTab] || [];
    
    const currentFilters: Record<string, string> = filters[activeTab] || {};
    return tabData.filter((item: any) => {
      return Object.entries(currentFilters).every(([key, filterVal]) => {
        if (!filterVal) return true;
        const itemVal = String(item[key] || '').toLowerCase();
        return itemVal.includes(filterVal.toLowerCase());
      });
    });
  }, [appData, activeTab, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(getFilteredData.length / rowsPerPage);
  const paginatedData = getFilteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Map Handlers
  const handleMapClick = (e: React.MouseEvent) => {
      if (draggingCityId || !mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newCity: CityNode = {
          id: `city-${Date.now()}`,
          name: "New Node",
          top: `${y.toFixed(1)}%`,
          left: `${x.toFixed(1)}%`,
      };
      onUpdateCities([...cities, newCity]);
      setEditingCity(newCity);
  };

  const handleCityDragStart = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setDraggingCityId(id);
  };

  const handleCityDragMove = (e: React.MouseEvent) => {
      if (!draggingCityId || !mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      
      onUpdateCities(cities.map(c => 
          c.id === draggingCityId ? { ...c, top: `${y.toFixed(1)}%`, left: `${x.toFixed(1)}%` } : c
      ));
  };

  const handleCityDragEnd = () => {
      setDraggingCityId(null);
  };

  const deleteCity = (id: string) => {
      onUpdateCities(cities.filter(c => c.id !== id));
      if (editingCity?.id === id) setEditingCity(null);
  };

  return (
    <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex flex-col h-[800px] border border-gray-200 dark:border-greenland-ice/20 animate-fadeIn">
        
        {/* Top Bar - Draggable Tabs */}
        <div className="bg-gray-100/80 dark:bg-black/40 border-b border-gray-200 dark:border-greenland-ice/20 p-2 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {tabOrder.map(tab => (
                <div
                    key={tab}
                    draggable
                    onDragStart={(e) => handleTabDragStart(e, tab)}
                    onDragOver={(e) => handleTabDragOver(e, tab)}
                    className="relative group"
                >
                    <button
                        onClick={() => { setActiveTab(tab as AdminTab); setCurrentPage(1); }}
                        className={`
                            px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2
                            ${activeTab === tab 
                                ? 'bg-white dark:bg-greenland-ice text-gray-900 dark:text-greenland-deep shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <GripVertical size={12} className="opacity-0 group-hover:opacity-50 cursor-grab" />
                        {tab}
                    </button>
                </div>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-hidden flex flex-col p-4 relative">
            
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">{activeTab}</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-full border border-gray-200 dark:border-white/5">
                        {activeTab === 'MAP' ? cities.length + ' Nodes' : getFilteredData.length + ' Records'}
                    </span>
                </div>
                
                {activeTab !== 'MAP' && (
                    <div className="flex gap-2">
                        {/* Column Visibility Toggle */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowColSettings(!showColSettings)}
                                className={`p-2 rounded-lg border transition-all ${showColSettings ? 'bg-greenland-ice text-white border-greenland-ice' : 'bg-white dark:bg-black/20 text-gray-500 hover:text-greenland-ice border-gray-200 dark:border-greenland-ice/20'}`}
                                title="Columns"
                            >
                                <Settings size={18} />
                            </button>
                            
                            {/* Column Configuration Popover */}
                            {showColSettings && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-greenland-deep border border-gray-200 dark:border-greenland-ice/30 rounded-xl shadow-2xl z-50 p-3 max-h-64 overflow-y-auto">
                                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Show Columns</h4>
                                    <div className="space-y-1">
                                        {(columnConfigs[activeTab] || []).map(col => (
                                            <div key={col.key} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded cursor-pointer" onClick={() => toggleColumnVisibility(activeTab, col.key)}>
                                                {col.visible ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500 opacity-50" />}
                                                <span className={`text-sm ${col.visible ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{col.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="p-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-greenland-ice/20 rounded-lg text-gray-500 hover:text-greenland-ice transition-colors" title="Refresh">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* --- BROADCAST TAB INTERFACE --- */}
            {activeTab === 'BROADCAST' && (
                <div className="flex flex-col lg:flex-row h-full gap-4 overflow-hidden">
                    {/* LEFT: CRM SELECTION */}
                    <div className="w-full lg:w-1/3 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                                <Users size={16} className="text-greenland-ice" /> Получатели (CRM)
                            </h3>
                            <div className="relative mb-2">
                                <input 
                                    type="text" 
                                    placeholder="Поиск по ID, Имени..."
                                    className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded p-1.5 pl-8 text-xs text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                    value={recipientFilter}
                                    onChange={(e) => setRecipientFilter(e.target.value)}
                                />
                                <Search size={14} className="absolute left-2 top-2 text-gray-400" />
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <button onClick={toggleAllRecipients} className="text-greenland-ice hover:underline">
                                    {selectedRecipients.length === filteredRecipients.length ? "Снять все" : "Выбрать все"}
                                </button>
                                <span className="text-gray-500 font-mono">{selectedRecipients.length} / {filteredRecipients.length}</span>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {filteredRecipients.map((user: any) => (
                                <div 
                                    key={user.chat_id} 
                                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                        selectedRecipients.includes(user.chat_id) 
                                        ? 'bg-greenland-ice/10 border border-greenland-ice/30' 
                                        : 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'
                                    }`}
                                    onClick={() => toggleRecipient(user.chat_id)}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedRecipients.includes(user.chat_id) ? 'bg-greenland-ice border-greenland-ice' : 'border-gray-400'}`}>
                                        {selectedRecipients.includes(user.chat_id) && <Check size={12} className="text-white" />}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.fio || 'Без имени'}</div>
                                        <div className="text-[10px] text-gray-500 font-mono truncate">{user.chat_id} | {user.telegram}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: MESSAGE EDITOR */}
                    <div className="flex-grow flex flex-col bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                            <div className="flex items-center gap-1">
                                <button onClick={() => insertTextTag('**', '**')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded" title="Жирный"><Bold size={16} /></button>
                                <button onClick={() => insertTextTag('__', '__')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded" title="Курсив"><Italic size={16} /></button>
                                <button onClick={() => insertTextTag('`', '`')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded" title="Код"><Code size={16} /></button>
                                <button onClick={() => insertTextTag('> ', '')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded" title="Цитата"><Quote size={16} /></button>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowVarSelector(!showVarSelector)} 
                                        className="flex-items-center gap-1 px-2 py-1 bg-greenland-ice/10 text-greenland-ice rounded text-xs font-bold hover:bg-greenland-ice/20"
                                    >
                                        <Variable size={14} /> {`{var}`}
                                    </button>
                                    {showVarSelector && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-greenland-deep border border-gray-200 dark:border-gray-700 rounded shadow-xl z-50 p-2">
                                            <div className="text-[10px] text-gray-500 mb-1 uppercase">Выберите переменную:</div>
                                            {columnConfigs['CRM']?.map(col => (
                                                <button 
                                                    key={col.key}
                                                    onClick={() => insertVariable(col.key)}
                                                    className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                                                >
                                                    {col.label} {`{${col.key}}`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className={`text-xs font-mono ${isOverLimit ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                {charCount} / {maxChars}
                            </span>
                        </div>

                        <div className="flex-grow p-3 flex flex-col min-h-0 overflow-y-auto">
                            <textarea 
                                ref={msgTextAreaRef}
                                className="flex-grow w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white resize-none custom-scrollbar font-mono"
                                placeholder="Введите текст рассылки..."
                                value={broadcastMsg}
                                onChange={(e) => setBroadcastMsg(e.target.value)}
                            />
                            {/* Message Split Indicator */}
                            {isOverLimit && (
                                <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded text-xs text-yellow-800 dark:text-yellow-200">
                                    ⚠️ Сообщение превышает лимит. Оно будет разделено на части: <br/>
                                    Часть 1 ... ✂️✂️✂️ ... Часть 2
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3 bg-gray-50 dark:bg-white/5">
                            {/* Media Link */}
                            <div className="flex items-center gap-2">
                                <ImageIcon size={16} className="text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="Ссылка на медиа (изображение/видео)"
                                    className="flex-grow bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded p-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-greenland-ice"
                                    value={mediaUrl}
                                    onChange={(e) => setMediaUrl(e.target.value)}
                                />
                            </div>

                            {/* Inline Buttons Constructor */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Инлайн-кнопки</span>
                                    <button onClick={addInlineButton} className="text-xs text-greenland-ice flex items-center gap-1 hover:underline">
                                        <PlusCircle size={12} /> Добавить
                                    </button>
                                </div>
                                {inlineButtons.map((btn, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-white dark:bg-black/20 p-2 rounded border border-gray-200 dark:border-gray-700">
                                        <GripVertical size={14} className="text-gray-400 cursor-move" />
                                        <input 
                                            placeholder="Текст кнопки" 
                                            className="w-1/3 bg-transparent border-b border-gray-300 dark:border-gray-600 text-xs py-1 outline-none focus:border-greenland-ice"
                                            value={btn.text}
                                            onChange={(e) => updateInlineButton(idx, 'text', e.target.value)}
                                        />
                                        <select 
                                            className="bg-transparent border-b border-gray-300 dark:border-gray-600 text-xs py-1 outline-none focus:border-greenland-ice"
                                            value={btn.type}
                                            onChange={(e) => updateInlineButton(idx, 'type', e.target.value as any)}
                                        >
                                            <option value="url">URL 🔗</option>
                                            <option value="callback">Callback 📞</option>
                                            <option value="webapp">WebApp 📱</option>
                                        </select>
                                        <input 
                                            placeholder={btn.type === 'url' ? 'https://...' : 'data_payload'} 
                                            className="flex-grow bg-transparent border-b border-gray-300 dark:border-gray-600 text-xs py-1 outline-none focus:border-greenland-ice"
                                            value={btn.value}
                                            onChange={(e) => updateInlineButton(idx, 'value', e.target.value)}
                                        />
                                        <button onClick={() => removeInlineButton(idx)} className="text-red-500 hover:text-red-700"><X size={14}/></button>
                                    </div>
                                ))}
                            </div>

                            {/* Send Button */}
                            <button 
                                onClick={sendBroadcast}
                                disabled={selectedRecipients.length === 0}
                                className="w-full py-2 bg-greenland-ice text-white dark:text-greenland-deep font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-greenland-ice/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} /> Отправить рассылку ({selectedRecipients.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- KNOWLEDGE TAB INTERFACE --- */}
            {activeTab === 'KNOWLEDGE' && (
                <div className="mb-6 bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Book size={18} className="text-greenland-ice" /> Knowledge Base Manager
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Left: Input Form */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Category"
                                    className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                    value={knowCategory}
                                    onChange={(e) => setKnowCategory(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Trigger / Question"
                                    className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                    value={knowContent}
                                    onChange={(e) => setKnowContent(e.target.value)}
                                />
                            </div>
                            <textarea 
                                placeholder="AI Answer / Description"
                                className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm text-gray-900 dark:text-white focus:border-greenland-ice outline-none resize-none h-24"
                                value={knowAnswer}
                                onChange={(e) => setKnowAnswer(e.target.value)}
                            />
                            
                            {/* Custom Fields Constructor */}
                            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-500">Custom Fields</label>
                                    <button onClick={addCustomField} className="text-xs text-greenland-ice hover:underline flex items-center gap-1">
                                        <PlusCircle size={12} /> Add Field
                                    </button>
                                </div>
                                {customFields.map((field, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input 
                                            placeholder="Key (e.g. source)"
                                            className="w-1/3 bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded p-1.5 text-xs text-gray-900 dark:text-white"
                                            value={field.key}
                                            onChange={(e) => updateCustomField(idx, 'key', e.target.value)}
                                        />
                                        <input 
                                            placeholder="Value"
                                            className="flex-grow bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-600 rounded p-1.5 text-xs text-gray-900 dark:text-white"
                                            value={field.value}
                                            onChange={(e) => updateCustomField(idx, 'value', e.target.value)}
                                        />
                                        <button 
                                            onClick={() => setCustomFields(customFields.filter((_, i) => i !== idx))}
                                            className="text-red-500 hover:text-red-400 p-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: File Upload */}
                        <div className="flex flex-col">
                            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex-grow flex flex-col items-center justify-center group">
                                <input 
                                    type="file" 
                                    multiple 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={handleFileUpload}
                                />
                                <div className="w-12 h-12 bg-greenland-ice/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={24} className="text-greenland-ice" />
                                </div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Drag & Drop files here</p>
                                <p className="text-xs text-gray-500">Supported: PDF, TXT, DOCX</p>
                            </div>
                            
                            {/* File List */}
                            {knowledgeFiles.length > 0 && (
                                <div className="mt-3 space-y-1">
                                    {knowledgeFiles.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-black/30 px-2 py-1 rounded">
                                            <FileIcon size={12} /> {f}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button 
                                onClick={addKnowledgeEntry}
                                className="mt-4 w-full py-2 bg-greenland-ice text-white dark:text-greenland-deep font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-greenland-ice/20"
                            >
                                <Save size={16} /> Save to Knowledge Base
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* MAP EDITOR */}
            {activeTab === 'MAP' ? (
                 <div className="flex flex-col lg:flex-row h-full gap-4">
                    {/* Map Canvas */}
                    <div className="flex-grow relative bg-gray-900 rounded-xl overflow-hidden border border-greenland-ice/30 group">
                        <div 
                            ref={mapContainerRef}
                            className="relative w-full h-full cursor-crosshair"
                            onClick={handleMapClick}
                            onMouseMove={handleCityDragMove}
                            onMouseUp={handleCityDragEnd}
                            onMouseLeave={handleCityDragEnd}
                        >
                            <img src={mapImage} alt="Map" className="w-full h-full object-cover opacity-50" />
                            
                            {cities.map((city) => (
                                <div
                                    key={city.id}
                                    className={`absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-move transition-transform ${
                                        editingCity?.id === city.id ? 'bg-greenland-ice scale-125 ring-4 ring-greenland-ice/30' : 'bg-white hover:scale-125'
                                    }`}
                                    style={{ top: city.top, left: city.left }}
                                    onMouseDown={(e) => handleCityDragStart(e, city.id)}
                                    onClick={(e) => { e.stopPropagation(); setEditingCity(city); }}
                                >
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-black/70 text-white px-1 rounded pointer-events-none">
                                        {city.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded backdrop-blur-sm pointer-events-none border border-white/10">
                            Click to add node. Drag to move.
                        </div>
                    </div>

                    {/* Sidebar Editor */}
                    <div className="w-full lg:w-80 bg-gray-50/80 dark:bg-[#162032]/80 border border-gray-200 dark:border-greenland-ice/20 rounded-xl p-4 overflow-y-auto backdrop-blur-sm flex-shrink-0">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Settings size={16} /> Node Properties
                        </h3>
                        
                        {editingCity ? (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        value={editingCity.name}
                                        onChange={(e) => {
                                            const updated = { ...editingCity, name: e.target.value };
                                            setEditingCity(updated);
                                            onUpdateCities(cities.map(c => c.id === updated.id ? updated : c));
                                        }}
                                        className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                    <textarea 
                                        value={editingCity.description || ''}
                                        onChange={(e) => {
                                            const updated = { ...editingCity, description: e.target.value };
                                            setEditingCity(updated);
                                            onUpdateCities(cities.map(c => c.id === updated.id ? updated : c));
                                        }}
                                        className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white h-24 focus:border-greenland-ice outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Link URL</label>
                                    <input 
                                        type="text" 
                                        value={editingCity.link || ''}
                                        onChange={(e) => {
                                            const updated = { ...editingCity, link: e.target.value };
                                            setEditingCity(updated);
                                            onUpdateCities(cities.map(c => c.id === updated.id ? updated : c));
                                        }}
                                        className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Link Text</label>
                                    <input 
                                        type="text" 
                                        value={editingCity.linkText || ''}
                                        onChange={(e) => {
                                            const updated = { ...editingCity, linkText: e.target.value };
                                            setEditingCity(updated);
                                            onUpdateCities(cities.map(c => c.id === updated.id ? updated : c));
                                        }}
                                        className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Logo URL</label>
                                    <input 
                                        type="text" 
                                        value={editingCity.logo || ''}
                                        onChange={(e) => {
                                            const updated = { ...editingCity, logo: e.target.value };
                                            setEditingCity(updated);
                                            onUpdateCities(cities.map(c => c.id === updated.id ? updated : c));
                                        }}
                                        className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                    <button 
                                        onClick={() => deleteCity(editingCity.id)}
                                        className="w-full py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} /> Delete Node
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8 text-sm italic">
                                Select a node on the map to edit properties.
                            </div>
                        )}
                        
                        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
                             <label className="block text-xs font-bold text-gray-500 mb-2">Background Map Image</label>
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={mapImage}
                                    onChange={(e) => onUpdateMapImage(e.target.value)}
                                    className="flex-grow bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded p-2 text-xs text-gray-900 dark:text-white focus:border-greenland-ice outline-none"
                                />
                                <button className="p-2 bg-gray-200 dark:bg-white/10 rounded hover:bg-greenland-ice hover:text-white transition-colors">
                                    <Upload size={16} />
                                </button>
                             </div>
                        </div>
                    </div>
                 </div>
            ) : (
                /* DATA TABLE */
                <div className="flex-grow flex flex-col overflow-hidden relative">
                    <div className="flex-grow overflow-auto border border-gray-200 dark:border-greenland-ice/20 rounded-xl custom-scrollbar">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="bg-gray-100/90 dark:bg-[#162032]/90 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                                <tr>
                                    {(columnConfigs[activeTab] || []).filter(c => c.visible).map(col => (
                                        <th key={col.key} className="relative group p-0 align-top border-b border-gray-200 dark:border-gray-700/50" style={{ width: col.width }}>
                                            <div className="p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider truncate">{col.label}</span>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="Filter..." 
                                                    className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-[10px] font-normal text-gray-900 dark:text-gray-200 focus:border-greenland-ice outline-none"
                                                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                                                />
                                            </div>
                                            {/* Resize Handle */}
                                            <div 
                                                className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-greenland-ice z-20"
                                                onMouseDown={(e) => handleColumnResize(e, activeTab, col.key)}
                                            />
                                        </th>
                                    ))}
                                    <th className="p-3 w-16 border-b border-gray-200 dark:border-gray-700/50 text-right bg-gray-100/90 dark:bg-[#162032]/90 sticky right-0 z-20">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {paginatedData.map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-greenland-ice/5 transition-colors group">
                                        {(columnConfigs[activeTab] || []).filter(c => c.visible).map(col => (
                                            <td key={col.key} className="p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap truncate relative" style={{ maxWidth: col.width }}>
                                                {col.key === 'status' ? (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        (row[col.key] || '').toLowerCase() === 'active' || (row[col.key] || '').toLowerCase() === 'активен' ? 'bg-green-100/10 text-green-600 border border-green-600/20' : 'bg-gray-100/10 text-gray-500 border border-gray-500/20'
                                                    }`}>
                                                        {row[col.key] || '-'}
                                                    </span>
                                                ) : (
                                                    <span title={String(row[col.key] || '')}>{row[col.key] || '-'}</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="p-3 text-right sticky right-0 bg-white/50 dark:bg-[#0B1120]/50 backdrop-blur-sm group-hover:bg-white/90 dark:group-hover:bg-[#0B1120]/90 border-l border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-800 transition-all">
                                            <button 
                                                onClick={() => handleEditRow(row)}
                                                className="p-1.5 rounded hover:bg-greenland-ice hover:text-white text-gray-400 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedData.length === 0 && (
                                    <tr>
                                        <td colSpan={(columnConfigs[activeTab]?.length || 0) + 1} className="p-12 text-center text-gray-500">
                                            No data found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-2 border-t border-gray-200 dark:border-greenland-ice/10 gap-4">
                         <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Rows per page:</span>
                            <select 
                                value={rowsPerPage} 
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded p-1 focus:border-greenland-ice outline-none text-gray-900 dark:text-gray-300"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>
                                Showing {Math.min((currentPage - 1) * rowsPerPage + 1, getFilteredData.length)} - {Math.min(currentPage * rowsPerPage, getFilteredData.length)} of {getFilteredData.length}
                            </span>
                         </div>
                         
                         <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(1)} 
                                disabled={currentPage === 1}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-gray-500 dark:text-gray-400"
                            >
                                <ChevronsLeft size={16} />
                            </button>
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-gray-500 dark:text-gray-400"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-mono px-3 py-1 bg-gray-100 dark:bg-white/5 rounded border border-gray-200 dark:border-white/10 min-w-[3rem] text-center text-gray-900 dark:text-gray-300">
                                {currentPage}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-gray-500 dark:text-gray-400"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button 
                                onClick={() => setCurrentPage(totalPages)} 
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-gray-500 dark:text-gray-400"
                            >
                                <ChevronsRight size={16} />
                            </button>
                         </div>
                    </div>
                </div>
            )}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && editingRow && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white dark:bg-greenland-deep border border-gray-200 dark:border-greenland-ice/30 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90%] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                        <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                            <Edit2 size={18} className="text-greenland-ice" /> Edit Record
                        </h3>
                        <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                        {Object.keys(editingRow).map(key => (
                            <div key={key}>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{key}</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm dark:text-white focus:border-greenland-ice outline-none transition-colors"
                                    value={editingRow[key]}
                                    onChange={(e) => setEditingRow({ ...editingRow, [key]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 flex justify-between">
                        <button 
                            onClick={handleDeleteRow}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-bold text-xs hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xs hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveRow}
                                className="px-4 py-2 bg-greenland-ice text-white dark:text-greenland-deep rounded-lg font-bold text-xs hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <Save size={14} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};