
import React from 'react';
import { MainService, SubService } from '../types';

interface ServiceListProps {
  service: MainService;
  onBack: () => void;
  onSelectSubService: (sub: SubService) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ service, onBack, onSelectSubService }) => {
  return (
    <div className="animate-slideInRight">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center sticky top-[64px] z-40">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <i className="fa-solid fa-arrow-left text-slate-600"></i>
        </button>
        <div className="flex items-center space-x-3">
          <div className={`${service.color} w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm`}>
            <i className={`fa-solid ${service.icon}`}></i>
          </div>
          <h2 className="text-lg font-bold text-slate-800">{service.title}</h2>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6">Pilih jenis layanan yang Anda perlukan di bawah ini:</p>
        
        <div className="space-y-3">
          {service.items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onSelectSubService(item)}
              className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span className="font-medium text-slate-700 text-sm pr-4">{item.title}</span>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-300 text-xs group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
