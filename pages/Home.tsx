
import React, { useEffect, useState } from 'react';
import { SERVICES } from '../constants';
import { ServiceCategory, QueueInfo } from '../types';
import { fetchQueueData } from '../services/queueService';

const QueueCard: React.FC<{ queue: QueueInfo }> = ({ queue }) => {
  const lastNum = parseInt(queue.last.toString().replace(/[^0-9]/g, '')) || 0;
  const currentNum = parseInt(queue.current.toString().replace(/[^0-9]/g, '')) || 0;
  const remaining = Math.max(0, lastNum - currentNum);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
      <div className={`${queue.color} w-full py-1.5 rounded-t-xl -mt-4 mb-3 text-[10px] font-bold text-white uppercase tracking-widest`}>
        {queue.label}
      </div>
      
      <div className="flex flex-col items-center justify-center mb-3 mt-1">
        <span className="text-[10px] text-slate-400 font-medium">Sedang Dilayani</span>
        <span className="text-3xl font-black text-slate-800 tracking-tighter">{queue.current}</span>
      </div>
      
      <div className="w-full h-px bg-slate-50 mb-3"></div>
      
      <div className="flex justify-between w-full px-2">
        <div className="text-left">
          <p className="text-[9px] text-slate-400 uppercase font-bold">Terakhir</p>
          <p className="text-sm font-bold text-slate-600">{queue.last}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 uppercase font-bold">Sisa</p>
          <p className="text-sm font-bold text-blue-600">{remaining}</p>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC<{ onSelectService: (category: ServiceCategory) => void }> = ({ onSelectService }) => {
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchQueueData();
        setQueues(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#003B7B] to-[#002B5B] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang!</h2>
          <p className="text-blue-100 text-sm opacity-90 leading-relaxed max-w-[80%]">
            Akses layanan perpajakan KPP Pratama Jayapura dengan lebih cepat dan mudah langsung dari genggaman Anda.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">Status Antrian</h3>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Update</span>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-40 rounded-2xl animate-pulse border border-slate-100 shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {queues.map(q => (
              <QueueCard key={q.id} queue={q} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Layanan Utama</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:shadow-md group active:scale-95"
            >
              <div className={`${service.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white text-2xl shadow-lg transition-transform group-hover:rotate-6`}>
                <i className={`fa-solid ${service.icon}`}></i>
              </div>
              <span className="font-bold text-slate-700">{service.title}</span>
              <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Klik untuk rincian</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <i className="fa-solid fa-bullhorn text-amber-600"></i>
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Informasi Terbaru</h4>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Segera lakukan <strong className="cursor-pointer hover:text-amber-600 hover:underline transition-all" onClick={() => window.open('https://www.youtube.com/watch?v=w5I7g5OeOEQ', '_blank')}>Aktivasi Akun Coretax</strong> dan <strong className="cursor-pointer hover:text-amber-600 hover:underline transition-all" onClick={() => window.open('https://www.youtube.com/watch?v=RUV3lw9C21M', '_blank')}>Kode Otorisasi DJP</strong>
            </p>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Jika Gabung NPWP istri ke Suami : <strong>Istri Ajukan Non-Aktif Sebelum 31 Maret 2026*</strong>
            </p>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Batas pelaporan SPT Tahunan PPh Orang Pribadi adalah <strong>31 Maret 2026</strong>. Segera laporkan sebelum terlambat!
            </p>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Batas pelaporan SPT Tahunan Badan adalah <strong>30 April 2026</strong>. Segera laporkan sebelum terlambat!
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
