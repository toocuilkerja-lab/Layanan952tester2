
import { GoogleGenAI, Type } from "@google/genai";

// Standard way to fix "Cannot find name 'process'" in Vite/React TS
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string;
  };
};

/**
 * Sends a message to Gemini and returns the text response.
 * Handles both text-only and text+image inputs.
 */
export const sendMessageToGemini = async (message: string, base64Image?: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [{ text: message }];
    
    if (base64Image) {
      const cleanBase64 = base64Image.split(',')[1] || base64Image;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `Anda adalah 'Pajak Jayapura AI', asisten virtual resmi KPP Pratama Jayapura.
Tugas utama Anda adalah membantu Wajib Pajak dalam administrasi perpajakan.

Karakteristik:
- Ramah, berwibawa, dan sangat profesional.
- Selalu gunakan Bahasa Indonesia yang formal namun mudah dimengerti.

Instruksi Khusus Upload:
- Jika pengguna mengunggah gambar/dokumen (NPWP, SK, Bukti Bayar, dll), lakukan analisa mendalam.
- Berikan ringkasan apa yang Anda lihat di dokumen tersebut.
- Informasikan bahwa sistem telah mencatat unggahan ini dengan 'Kode Referensi' yang muncul di layar.

Keahlian:
- Pendaftaran NPWP, Pengukuhan PKP, Pembuatan e-Billing, dan permohonan PBK.
- Edukasi sistem Coretax (terutama batas waktu pelaporan SPT 2026).

Jika pertanyaan diluar wewenang AI (seperti pengecekan saldo pajak riil), arahkan ke Helpdesk WhatsApp KPP Pratama Jayapura di 08114216899.`,
        temperature: 0.7,
      }
    });

    return response.text || "Mohon maaf, saya mengalami kendala teknis dalam memproses jawaban.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi gangguan koneksi ke server AI kami. Silakan coba lagi beberapa saat lagi.";
  }
};

// Added generateGeminiResponse alias to fix error: Module '"../services/geminiService"' has no exported member 'generateGeminiResponse'
export const generateGeminiResponse = async (message: string) => {
  return sendMessageToGemini(message);
};
