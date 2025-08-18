"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  language: 'uz' | 'ru';
  setLanguage: (language: 'uz' | 'ru') => void;
}

export type { ThemeState };

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      language: 'ru',
      setLanguage: (language) => {
        set({ language });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => () => {
        // Theme will be applied by ThemeProvider
      },
    }
  )
); 