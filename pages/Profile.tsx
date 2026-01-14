
import React from 'react';

const Profile: React.FC = () => {
  const socialLinks = [
    { handle: '@pajakjayapura', url: 'https://www.instagram.com/pajakjayapura/' },
    { handle: '@ditjenpajakri', url: 'https://www.instagram.com/ditjenpajakri/' },
    { handle: '@kringpajak1500200', url: 'https://www.instagram.com/kringpajak1500200/' }
  ];

  return (
    <div className="p-6 animate-fadeIn space-y-8">
      {/* Office Header Section */}
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 bg-[#002B5B] rounded-3xl shadow-xl flex items-center justify-center mb-6 border-4 border-white transform -rotate-0 hover:rotate-3 transition-transform duration-300">
          <i className="fa-solid fa-landmark text-white text-5xl"></i>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 text-center uppercase tracking-tight">
          KPP Pratama Jayapura
        </h2>
        <div className="h-1 w-12 bg-blue-600 rounded-full mt-2"></div>
      </div>

      {/* Info Cards */}
      <div className="space-y-4">
        {/* Address Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat Kantor</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Jl. Otonom No.3, Wahno, Kec. Abepura, Kota Jayapura, Papua 99224
            </p>
            <button 
              onClick={() => window.open('https://maps.google.com/?q=KPP+Pratama+Jayapura', '_blank')}
              className="mt-3 text-xs text-blue-600 font-bold flex items-center space-x-1 hover:underline"
            >
              <span>Petunjuk Arah</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
            </button>
          </div>
        </div>

        {/* Service Hours Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start space-x-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jam Pelayanan</h4>
            <p className="text-sm text-slate-700 font-bold">
              08.00 s.d. 13.00 WIT
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Senin s.d. Jumat
            </p>
            <div className="mt-3 inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Sesuai Jam Operasional
            </div>
          </div>
        </div>

        {/* Social Media Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start space-x-4">
          <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shrink-0">
            <i className="fa-brands fa-instagram text-xl"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Media Sosial Resmi</h4>
            <div className="space-y-2">
              {socialLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => window.open(link.url, '_blank')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-pink-50 hover:border-pink-100 transition-all group"
                >
                  <div className="flex items-center space-x-2">
                    <i className="fa-brands fa-instagram text-pink-500 text-xs opacity-60 group-hover:opacity-100"></i>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-pink-700">{link.handle}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:translate-x-1 group-hover:text-pink-400 transition-all"></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
