import React, { useState } from 'react';
import { useLanguage } from '../context/LenguajeContext';
import './LanguageSelector.css';

const languages = [
    { code: 'es', name: 'Español', nativeName: 'Español' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (language) => {
    changeLanguage(language.code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button 
        className="language-current"
        onClick={() => setIsOpen(!isOpen)}
        title={t('common.language')}
      >
        <span className="language-flag">{currentLang.flag}</span>
        <span className="language-name">{currentLang.nativeName}</span>
        <span className="language-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`language-option ${
                currentLanguage === language.code ? 'selected' : ''
              }`}
              onClick={() => handleLanguageSelect(language)}
            >
              <span className="language-flag">{language.flag}</span>
              <span className="language-name">{language.nativeName}</span>
              <span className="language-english">({language.name})</span>
              {currentLanguage === language.code && (
                <span className="language-check">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;