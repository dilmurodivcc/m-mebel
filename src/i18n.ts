import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uzTranslations from './locales/uz.json';
import ruTranslations from './locales/ru.json';

const resources = {
  uz: {
    translation: uzTranslations
  },
  ru: {
    translation: ruTranslations
  }
};

const getStoredLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.state?.language || 'ru';
      } catch {
        return 'ru';
      }
    }
  }
  return 'ru';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    lng: getStoredLanguage(), 
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly',
    preload: ['ru', 'uz'],
  });

export default i18n; 