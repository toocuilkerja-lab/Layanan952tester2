
import React from 'react';

interface TutorialDetailProps {
  tutorialId: string;
  onBack: () => void;
}

const TutorialDetail: React.FC<TutorialDetailProps> = ({ tutorialId, onBack }) => {
  const renderContent = () => {
    switch (tutorialId) {
      case '1': // PPh Badan Perdagangan
        return (
          <div className="space-y-6">
            <header className="space-y-2">
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Edukasi Coretax</span>
              <h3 className="text-xl font-bold text-slate-800 uppercase">SPT Tahunan PPh Badan - Sektor Perdagangan</h3>
            </header>

            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center">
                <i className="fa-solid fa-star text-yellow-500 mr-2"></i> Perubahan Utama
              </h4>
              <ul className="space-y-3">
                <InfoItem icon="fa-1" text="Pengisian SPT dilakukan mulai dari Induk SPT." />
                <InfoItem icon="fa-2" text="Lampiran L2 (Daftar Kepemilikan) dan L-11B muncul otomatis." />
                <InfoItem icon="fa-3" text="Terdapat 12 sektor usaha pada Lampiran L1 (Perdagangan = L1-C)." />
                <InfoItem icon="fa-4" text="Koreksi Fiskal dilakukan langsung di laporan laba rugi." />
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="font-bold text-slate-700 text-sm">Tahap Pengisian (Skenario PT NYA BADAN)</h4>
              <div className="space-y-4">
                <StepCard num="1" title="Login Coretax" desc="Gunakan NIK/NPWP 16 digit dan passphrase yang valid." />
                <StepCard num="2" title="Pilih Modul SPT" desc="Masuk ke Modul SPT > Konsep SPT > Buat Konsep SPT." />
                <StepCard num="3" title="Header & Identitas" desc="Pilih metode pembukuan Stelsel Akrual dan verifikasi data prefill." />
                <StepCard num="4" title="Laporan Keuangan" desc="Isi Lampiran 1 (Laba/Rugi & Neraca) sesuai rincian fiskal." />
              </div>
            </section>
          </div>
        );

      case '3': // PPh Orang Pribadi
      case '4': // OP Karyawan
        return (
          <div className="space-y-6">
            <header className="space-y-2">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Panduan Karyawan</span>
              <h3 className="text-xl font-bold text-slate-800 uppercase">Pelaporan SPT OP Karyawan</h3>
            </header>

            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <i className="fa-solid fa-file-invoice text-blue-600"></i>
                <p className="text-xs text-blue-800 font-medium">Pastikan sudah mengunduh Bukti Potong BPA1 dari Portal DJP sebelum memulai.</p>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Langkah-Langkah:</h4>
              <div className="space-y-3">
                <StepItem step="1" text="Login ke coretaxdjp.pajak.go.id" />
                <StepItem step="2" text="Pilih Modul SPT > Konsep SPT" />
                <StepItem step="3" text="Pilih Jenis SPT PPh Orang Pribadi" />
                <StepItem step="4" text="Pilih Tahun Pajak (Januari - Desember 2025)" />
                <StepItem step="5" text="Pilih Sumber Penghasilan 'Pekerjaan'" />
                <StepItem step="6" text="Verifikasi Data Penghasilan & Klik Bayar/Lapor" />
              </div>
            </section>
          </div>
        );

      default:
        return (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <i className="fa-solid fa-hourglass-half text-3xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Materi Masih Diproses</h3>
              <p className="text-xs text-slate-400">Konten rincian sedang dalam tahap digitalisasi.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-slideInRight bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center sticky top-[64px] z-40 shadow-sm">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <i className="fa-solid fa-arrow-left text-slate-600"></i>
        </button>
        <h2 className="text-sm font-bold text-slate-800 line-clamp-1 uppercase tracking-tight">Rincian Materi Edukasi</h2>
      </div>

      <div className="p-6 pb-28">
        {renderContent()}
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <li className="flex items-start space-x-3">
    <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center shrink-0 mt-0.5">
      <i className={`fa-solid ${icon} text-[10px]`}></i>
    </div>
    <span className="text-xs text-slate-600 leading-relaxed">{text}</span>
  </li>
);

const StepCard: React.FC<{ num: string; title: string; desc: string }> = ({ num, title, desc }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 flex space-x-4">
    <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
      {num}
    </div>
    <div>
      <h5 className="text-sm font-bold text-slate-800">{title}</h5>
      <p className="text-[11px] text-slate-500 mt-1">{desc}</p>
    </div>
  </div>
);

const StepItem: React.FC<{ step: string; text: string }> = ({ step, text }) => (
  <div className="flex items-center space-x-3">
    <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
      {step}
    </div>
    <p className="text-xs text-slate-600">{text}</p>
  </div>
);

export default TutorialDetail;
