import { useCallback, useEffect, useMemo, useState } from 'react';
import { LanguageContext } from '@/features/i18n/store/languageStore';
import { LANGUAGE_STORAGE_KEYS, SUPPORTED_LANGUAGES } from '@/utils/constants';

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEYS.LANGUAGE);

  if (storedLanguage === SUPPORTED_LANGUAGES.VI || storedLanguage === SUPPORTED_LANGUAGES.EN) {
    return storedLanguage;
  }

  return SUPPORTED_LANGUAGES.EN;
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) =>
      current === SUPPORTED_LANGUAGES.EN ? SUPPORTED_LANGUAGES.VI : SUPPORTED_LANGUAGES.EN,
    );
  }, []);

  const tx = useCallback(
    (englishText, vietnameseText) =>
      language === SUPPORTED_LANGUAGES.VI ? vietnameseText : englishText,
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      isVietnamese: language === SUPPORTED_LANGUAGES.VI,
      toggleLanguage,
      setLanguage,
      tx,
    }),
    [language, toggleLanguage, tx],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export { LanguageProvider };
export default LanguageProvider;
