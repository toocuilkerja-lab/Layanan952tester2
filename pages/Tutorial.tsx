
import React, { useState } from 'react';

interface TutorialItem {
  id: string;
  title: string;
  category: 'PPh Badan' | 'PPh Orang Pribadi';
  version: string;
  description: string;
  icon: string;
}

interface TutorialProps {
  onSelectTutorial: (id: string) => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onSelectTutorial }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const tutorials: TutorialItem[] = [
    {
      id: '1',
      title: 'SPT Tahunan PPh Badan (Sektor Perdagangan)',
      category: 'PPh Badan',
      version: '20250910',
      description: 'Materi edukasi pengisian SPT Tahunan PPh Badan khusus untuk sektor usaha perdagangan pada sistem Coretax.',
      icon: 'fa-file-pdf',
    },
    {
      id: '2',
      title: 'Pengenalan Induk & Lampiran SPT Tahunan Badan',
      category: 'PPh Badan',
      version: '20250819',
      description: 'Panduan mendalam mengenai struktur formulir induk dan rincian lampiran (L1-L14) untuk Wajib Pajak Badan.',
      icon: 'fa-book',
    },
    {
      id: '3',
      title: 'SPT Tahunan PPh Orang Pribadi',
      category: 'PPh Orang Pribadi',
      version: '20250910',
      description: 'Langkah-langkah persiapan draft dan pengisian induk SPT Tahunan untuk Wajib Pajak Orang Pribadi.',
      icon: 'fa-user-gear',
    },
    {
      id: '4',
      title: 'Tata Cara Pelaporan SPT OP Karyawan',
      category: 'PPh Orang Pribadi',
      version: '20250910',
      description: 'Panduan praktis pelaporan SPT Tahunan bagi karyawan menggunakan aplikasi Coretax terbaru.',
      icon: 'fa-id-badge',
    }
  ];

  const handleDownload = (item: TutorialItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah navigasi ke halaman detail
    
    // Simulasi konten PDF (Dalam aplikasi nyata, ini adalah URL ke file .pdf di server)
    const simulatedContent = `
      MATERI EDUKASI CORETAX - KPP PRATAMA JAYAPURA
      ============================================
      Judul: ${item.title}
      Kategori: ${item.category}
      Versi: ${item.version}
      
      DESKRIPSI:
      ${item.description}
      
      ---
      Dokumen ini dihasilkan secara otomatis oleh sistem pelayanan digital.
      Silakan kunjungi coretaxdjp.pajak.go.id untuk panduan interaktif selengkapnya.
      © 2025 KPP Pratama Jayapura
    `;

    const blob = new Blob([simulatedContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Format nama file agar bersih
    const fileName = item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `Materi_${fileName}_v${item.version}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredTutorials = tutorials.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 animate-fadeIn space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold text-slate-800">Pusat Edukasi Coretax</h2>
        <p className="text-xs text-slate-500">Materi resmi perpajakan KPP Pratama Jayapura Versi 2025</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input 
          type="text" 
          placeholder="Cari materi tutorial..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tutorial List */}
      <div className="space-y-4">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectTutorial(item.id)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${item.category === 'PPh Badan' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                    <i className={`fa-solid ${item.icon} text-xl`}></i>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wider">
                    v.{item.version}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-tighter ${item.category === 'PPh Badan' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                    {item.category}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center text-slate-400 text-[10px]">
                    <i className="fa-solid fa-eye mr-1"></i> Klik untuk baca detail
                  </div>
                  <button 
                    onClick={(e) => handleDownload(item, e)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center"
                  >
                    <i className="fa-solid fa-download mr-1.5"></i> Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <i className="fa-solid fa-file-circle-exclamation text-slate-200 text-5xl mb-4"></i>
            <p className="text-slate-400 text-sm font-medium">Materi tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start space-x-3">
        <i className="fa-solid fa-info-circle text-blue-400 mt-0.5"></i>
        <p className="text-[10px] text-blue-700 leading-relaxed">
          <strong>Tip:</strong> Klik pada kartu untuk melihat rincian materi secara langsung di aplikasi, atau klik tombol <strong>Download</strong> untuk menyimpan dokumen.
        </p>
      </div>
    </div>
  );
};

export default Tutorial;
