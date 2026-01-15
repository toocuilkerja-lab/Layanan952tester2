
import { QueueInfo } from '../types';

const STORAGE_KEY = 'kpp_jayapura_queue_db';
const SHEET_ID = '1P43tPasDu1FX2GfjruoPl4cEp4_-tEChr-9RblowwK8';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

const INITIAL_DATA: QueueInfo[] = [
  {
    id: 'A',
    label: 'Permohonan',
    description: '',
    current: 'A000',
    last: 'A000',
    color: 'bg-blue-600'
  },
  {
    id: 'B',
    label: 'Coretax',
    description: '',
    current: 'B000',
    last: 'B000',
    color: 'bg-emerald-600'
  },
  {
    id: 'C',
    label: 'Helpdesk',
    description: '',
    current: 'C000',
    last: 'C000',
    color: 'bg-orange-500'
  },
  {
    id: 'D',
    label: 'Lainnya',
    description: '',
    current: 'D000',
    last: 'D000',
    color: 'bg-purple-600'
  }
];

const getColorById = (id: string) => {
  switch (id.toUpperCase()) {
    case 'A': return 'bg-blue-600';
    case 'B': return 'bg-emerald-600';
    case 'C': return 'bg-orange-600';
    case 'D': return 'bg-purple-600';
    default: return 'bg-slate-600';
  }
};

const formatQueueNumber = (id: string, value: any): string => {
  const rawValue = value?.toString() || '0';
  const numericPart = rawValue.replace(/[^0-9]/g, '');
  const num = parseInt(numericPart) || 0;
  return `${id.toUpperCase()}${num.toString().padStart(3, '0')}`;
};

export const fetchFromGoogleSheets = async (): Promise<QueueInfo[] | null> => {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonStr);
    
    const rows = json.table.rows;
    if (!rows || rows.length === 0) return null;

    return rows.map((row: any) => {
      const id = row.c[0]?.v?.toString() || '';
      return {
        id: id,
        label: row.c[1]?.v?.toString() || `Antrian ${id}`,
        description: '',
        last: formatQueueNumber(id, row.c[2]?.v),
        current: formatQueueNumber(id, row.c[3]?.v),
        color: getColorById(id)
      };
    });
  } catch (error) {
    console.error("Gagal mengambil data dari Google Sheets:", error);
    return null;
  }
};

export const fetchQueueData = async (): Promise<QueueInfo[]> => {
  const cloudData = await fetchFromGoogleSheets();
  
  if (cloudData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
    return cloudData;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

export const updateQueueData = async (queues: QueueInfo[]): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queues));
  window.dispatchEvent(new Event('storage'));
};

export const updateSingleQueue = async (id: string, type: 'current' | 'last'): Promise<QueueInfo[]> => {
  const data = await fetchQueueData();
  const updated = data.map(q => {
    if (q.id === id) {
      const prefix = q.id;
      const valStr = q[type].toString();
      const currentNum = parseInt(valStr.replace(/[^0-9]/g, '')) || 0;
      const newNum = currentNum + 1;
      const formatted = `${prefix}${newNum.toString().padStart(3, '0')}`;
      
      if (type === 'current') {
        const lastNum = parseInt(q.last.toString().replace(/[^0-9]/g, '')) || 0;
        if (newNum > lastNum) return q;
      }
      
      return { ...q, [type]: formatted };
    }
    return q;
  });
  await updateQueueData(updated);
  return updated;
};
