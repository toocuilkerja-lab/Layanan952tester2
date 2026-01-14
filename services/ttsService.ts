
import { GoogleGenAI } from "@google/genai";

// Standard way to fix "Cannot find name 'process'" in Vite/React TS
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string;
  };
};

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playQueueAnnouncement = async (queueNumber: string, label: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Pecah nomor agar penyebutan lebih jelas (misal: A042 -> A, nol, empat, dua)
    const letter = queueNumber.charAt(0);
    const digits = queueNumber.substring(1).split('').join(' ');
    const prompt = `Sebutkan dengan suara wanita yang ramah, sopan, dan profesional: "Nomor antrian, ${letter}, ${digits}, silakan menuju loket, ${label}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore memiliki karakter suara wanita yang tenang dan sopan
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioData = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);
    
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();

    return new Promise((resolve) => {
      source.onended = () => {
        audioCtx.close();
        resolve(true);
      };
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return false;
  }
};
