import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('pos_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('pos_language', language);
    // This dynamically flips the entire layout automatically for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // t('key')                       -> translated text (falls back to English, then to the key)
  // t('key', 'English fallback')   -> same, but uses the given text when the key does not exist
  // t('key', { count: 3 })         -> fills {count} in the translated text
  const t = (key, arg) => {
    const text = translations[language]?.[key] || translations['en']?.[key];
    if (!text) return typeof arg === 'string' ? arg : key;
    if (arg && typeof arg === 'object') return text.replace(/\{(\w+)\}/g, (match, name) => (arg[name] ?? match));
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);