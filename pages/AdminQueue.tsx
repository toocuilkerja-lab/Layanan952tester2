
import React, { useEffect, useState } from 'react';
import { QueueInfo } from '../types';
import { fetchQueueData, updateSingleQueue, fetchFromGoogleSheets, updateQueueData } from '../services/queueService';
import { playQueueAnnouncement } from '../services/ttsService';

const AdminQueue: React.FC = () => {
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadData = async () => {
    const data = await fetchQueueData();
    setQueues(data);
    setLoading(false);
  };

  const handleSyncCloud = async () => {
    setSyncing(true);
    const cloudData = await fetchFromGoogleSheets();
    if (cloudData) {
      await updateQueueData(cloudData);
      setQueues(cloudData);
      alert("Berhasil sinkronisasi dengan Google Sheets!");
    } else {
      alert("Gagal mengambil data dari Google Sheets. Periksa koneksi atau izin berbagi file.");
    }
    setSyncing(false);
  };

  const handleUpdate = async (id: string, type: 'current' | 'last') => {
    setUpdating(`${id}-${type}`);
    try {
      const updated = await updateSingleQueue(id, type);
      setQueues(updated);
      
      if (type === 'current') {
        const queueItem = updated.find(q => q.id === id);
        if (queueItem) {
          setIsSpeaking(id);
          await playQueueAnnouncement(queueItem.current, queueItem.label);
          setIsSpeaking(null);
        }
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Apakah Anda yakin ingin mereset database ke pengaturan awal? Semua nomor antrian akan kembali ke default.")) {
      localStorage.removeItem('kpp_jayapura_queue_db');
      window.location.reload();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Memuat Data Panel...</div>;

  return (
    <div className="p-6 space-y-8 animate-fadeIn pb-32">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">Panel Operator</h2>
            <p className="text-xs text-slate-500">Kelola antrian real-time.</p>
          </div>
          <button 
            onClick={handleSyncCloud}
            disabled={syncing}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-bold border border-blue-100 shadow-sm flex items-center space-x-2 active:scale-95 transition-all"
          >
            {syncing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-down"></i>}
            <span>SINKRON CLOUD</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {queues.map((q) => {
          const lastNum = parseInt(q.last.toString().replace(/[^0-9]/g, '')) || 0;
          const currentNum = parseInt(q.current.toString().replace(/[^0-9]/g, '')) || 0;
          const remaining = Math.max(0, lastNum - currentNum);

          return (
            <div key={q.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${q.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg relative`}>
                    <span className="font-bold text-lg">{q.id}</span>
                    {isSpeaking === q.id && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{q.label}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{q.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sisa</span>
                  <span className="text-lg font-black text-blue-600">{remaining}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Sekarang</p>
                  <p className="text-2xl font-black text-slate-800">{q.current}</p>
                  <button 
                    onClick={() => handleUpdate(q.id, 'current')}
                    disabled={updating !== null || currentNum >= lastNum}
                    className={`mt-3 w-full text-white py-2.5 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 ${isSpeaking === q.id ? 'bg-emerald-500 shadow-emerald-100' : 'bg-[#002B5B] shadow-blue-100'}`}
                  >
                    {updating === `${q.id}-current` ? (
                      <i className="fa-solid fa-spinner animate-spin"></i>
                    ) : isSpeaking === q.id ? (
                      <><i className="fa-solid fa-microphone-lines animate-pulse"></i> <span>MENGUDARA</span></>
                    ) : (
                      <><i className="fa-solid fa-volume-high"></i> <span>PANGGIL</span></>
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Terakhir</p>
                  <p className="text-2xl font-black text-slate-800">{q.last}</p>
                  <button 
                    onClick={() => handleUpdate(q.id, 'last')}
                    disabled={updating !== null}
                    className="mt-3 w-full bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {updating === `${q.id}-last` ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-plus mr-2"></i> ANTRIAN</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center space-x-2">
        <button onClick={() => setShowRawData(!showRawData)} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
          {showRawData ? 'Sembunyikan Inspektor' : 'Buka Inspektor Database'}
        </button>
      </div>

      {showRawData && (
        <div className="bg-slate-900 rounded-[24px] p-6 overflow-hidden animate-slideDown shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">DB Key: kpp_jayapura_queue_db</span>
             <button onClick={handleResetData} className="text-[9px] bg-red-500 text-white px-2 py-1 rounded font-bold">RESET LOKAL</button>
          </div>
          <pre className="text-[11px] text-blue-100 font-mono overflow-x-auto whitespace-pre custom-scrollbar max-h-60">
            {JSON.stringify(queues, null, 2)}
          </pre>
        </div>
      )}
      
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default AdminQueue;
