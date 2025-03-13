import { create } from 'zustand';

interface AudioStore {
  isMuted: boolean;
  currentAnnouncement: string | null;
  toggleMute: () => void;
  playBeep: () => void;
  playLongBeep: () => void;
  speak: (text: string) => void;
  cancelSpeech: () => void;
}

// Create audio elements once
const shortBeep = new Audio('/sounds/short-beep.mp3');
const longBeep = new Audio('/sounds/long-beep.mp3');

export const useAudioStore = create<AudioStore>((set, get) => ({
  isMuted: localStorage.getItem('isMuted') === 'true',
  currentAnnouncement: null,
  
  toggleMute: () => {
    const newMuted = !get().isMuted;
    set({ isMuted: newMuted });
    localStorage.setItem('isMuted', String(newMuted));
    
    // Cancel any ongoing speech when muting
    if (newMuted) {
      window.speechSynthesis.cancel();
    }
  },
  
  playBeep: () => {
    if (!get().isMuted) {
      shortBeep.currentTime = 0;
      shortBeep.play().catch(console.error);
    }
  },
  
  playLongBeep: () => {
    if (!get().isMuted) {
      longBeep.currentTime = 0;
      longBeep.play().catch(console.error);
    }
  },
  
  speak: (text: string) => {
    if (!get().isMuted && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      set({ currentAnnouncement: text });
      
      utterance.onend = () => {
        set({ currentAnnouncement: null });
      };
      
      window.speechSynthesis.speak(utterance);
    }
  },
  
  cancelSpeech: () => {
    window.speechSynthesis.cancel();
    set({ currentAnnouncement: null });
  }
}));
