import React from 'react';
import { LanguageProvider, useLanguage } from './context/LenguajeContext';
import './App.css';
import Search from './pages/Search';

// Componente que usa el hook de lenguaje
function AppContent() {
  const { t, isTranslating } = useLanguage();

  return (
    <div className="App">
      <header className="App-header">
        <h1> {t('header.title')}</h1>
        <p>{t('header.subtitle')}</p>
        {isTranslating && (
          <div className="language-loading">
            <span>🔄 {t('common.loading')}</span>
          </div>
        )}
      </header>
      
      <main className="App-main">
        <Search />
      </main>
      
      <footer className="App-footer">
        <p>{t('common.developedWith')}</p>
      </footer>
    </div>
  );
}

// Provider en el nivel más alto
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;