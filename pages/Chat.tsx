
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
  image?: string;
  refCode?: string;
}

const ReferenceCard: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 bg-slate-800 rounded-xl p-4 text-white border-l-4 border-blue-500 shadow-lg animate-slideUp">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Kode Referensi Layanan</span>
        <i className="fa-solid fa-shield-check text-blue-400 text-xs"></i>
      </div>
      <div className="flex items-center justify-between bg-black/20 rounded-lg p-2 border border-white/10">
        <code className="text-sm font-mono font-bold tracking-wider text-white bg-transparent p-0">{code}</code>
        <button 
          onClick={handleCopy}
          className={`text-[10px] px-2 py-1 rounded font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          {copied ? 'TERSALIN' : 'SALIN'}
        </button>
      </div>
      <p className="text-[9px] mt-2 opacity-60 leading-tight">
        *Gunakan kode ini saat berkonsultasi dengan petugas di kantor pajak atau via WhatsApp.
      </p>
    </div>
  );
};

const Chat: React.FC<{ onOpenWhatsApp?: () => void }> = ({ onOpenWhatsApp }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Halo! Saya asisten virtual KPP Pratama Jayapura. Ada yang bisa saya bantu hari ini?\n\nAnda bisa bertanya seputar NPWP, PKP, atau mengunggah foto dokumen untuk saya bantu analisa.' }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateReferenceCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `JYP-${year}-${random}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMsg = input || (selectedImage ? "Tolong analisa dokumen yang saya lampirkan ini." : "");
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, image: currentImage || undefined }]);
    setLoading(true);

    const botRes = await sendMessageToGemini(userMsg, currentImage || undefined);
    
    // Generate code only if image was uploaded
    const newRefCode = currentImage ? generateReferenceCode() : undefined;

    setMessages(prev => [...prev, { 
      role: 'bot', 
      text: botRes,
      refCode: newRefCode
    }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#002B5B] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Pajak Virtual Assistant</h3>
            <span className="text-[10px] text-green-500 font-bold flex items-center uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Online
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onOpenWhatsApp}
            className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
          </button>
          <button 
            className="w-8 h-8 bg-slate-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-colors" 
            onClick={() => setMessages([{ role: 'bot', text: 'Sesi chat telah diperbarui. Apa yang bisa saya bantu sekarang?' }])}
          >
            <i className="fa-solid fa-rotate-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[88%] shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none'
            }`}>
              {m.image && (
                <div className="p-1.5">
                  <img src={m.image} alt="Upload" className="rounded-xl w-full max-h-64 object-cover border border-white/20" />
                </div>
              )}
              <div className="p-4 text-sm whitespace-pre-wrap leading-relaxed prose prose-sm">
                {m.text}
                {m.refCode && <ReferenceCard code={m.refCode} />}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-[env(safe-area-inset-bottom)]">
        {selectedImage && (
          <div className="mb-4 relative inline-block group">
            <img src={selectedImage} alt="Preview" className="h-24 w-24 object-cover rounded-2xl border-2 border-blue-500 shadow-xl" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg active:scale-90 hover:bg-red-600 transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl pointer-events-none"></div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${selectedImage ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <i className="fa-solid fa-camera-retro text-lg"></i>
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedImage ? "Berikan keterangan foto..." : "Tanya pajak atau upload dokumen..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-inner"
            />
          </div>
          
          <button
            onClick={handleSend}
            className="bg-[#002B5B] text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-40 disabled:grayscale"
            disabled={(!input.trim() && !selectedImage) || loading}
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
        <div className="flex items-center justify-center space-x-2 mt-3 opacity-40">
           <i className="fa-solid fa-lock text-[8px]"></i>
           <p className="text-[8px] uppercase tracking-widest font-bold">Encrypted AI Analysis</p>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Chat;
