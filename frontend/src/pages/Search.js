import React, { useState } from 'react';
import { useLanguage } from '../context/LenguajeContext';
import SearchBar from '../components/SearchBar';
import ImageSearch from '../components/ImageSearch';
import LanguageSelector from '../components/LenguajeSelector';
import PlayerCard from '../components/PlayerCard';
import { api } from '../services/api';
import { aiService } from '../services/aiService';
import './Search.css';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const { t, currentLanguage, translatePlayers } = useLanguage();

  // Búsqueda por texto
  const handleTextSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      const results = await api.searchPlayers(searchTerm);
      
      // Traducir los datos de los jugadores
      const translatedResults = await translatePlayers(results);
      setSearchResults(translatedResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda por imagen
  const handleImageSearch = async (imageFile) => {
    setLoading(true);
    setSearchPerformed(true);

    try {
      const analysisResult = await aiService.analyzeImage(imageFile);
      
      if (analysisResult.success && analysisResult.matches.length > 0) {
        const playerDetails = await Promise.all(
          analysisResult.matches.map(async (match) => {
            try {
              return await api.getPlayer(match.id);
            } catch (error) {
              console.error(`Error obteniendo jugador ${match.id}:`, error);
              return null;
            }
          })
        );
        
        const validPlayers = playerDetails.filter(player => player !== null);
        
        // Traducir los datos de los jugadores
        const translatedPlayers = await translatePlayers(validPlayers);
        setSearchResults(translatedPlayers);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error en búsqueda por imagen:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de idioma para retraducir resultados existentes
  React.useEffect(() => {
    const retranslateExistingResults = async () => {
      if (searchResults.length > 0 && currentLanguage !== 'es') {
        console.log(`Retraduciendo ${searchResults.length} jugadores a ${currentLanguage}`);
        setLoading(true);
        try {
          const retranslatedPlayers = await translatePlayers(searchResults);
          setSearchResults(retranslatedPlayers);
        } catch (error) {
          console.error('Error retraduciendo jugadores:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    retranslateExistingResults();
  }, [currentLanguage]); // Se ejecuta cuando cambia el idioma

  const handlePlayerClick = (player) => {
    console.log('Jugador clickeado:', player);
    alert(`${t('search.viewDetails')}: ${player.nombre} (${t('common.language')}: ${currentLanguage})`);
  };

  return (
    <div className="search-page">
      {/* Header con selector de idioma */}
      <div className="search-header">
        <h1>{t('search.title')}</h1>
        <LanguageSelector />
      </div>

      {/* Tabs de búsqueda */}
      <div className="search-tabs">
        <button 
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          {t('search.textTab')}
        </button>
        <button 
          className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          {t('search.imageTab')}
        </button>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'text' && (
        <div className="tab-content">
          <SearchBar 
            onSearch={handleTextSearch}
            placeholder={t('search.textPlaceholder')}
          />
        </div>
      )}

      {activeTab === 'image' && (
        <div className="tab-content">
          <ImageSearch 
            onImageUpload={handleImageSearch}
            onCameraCapture={handleImageSearch}
            loading={loading}
          />
        </div>
      )}

      {/* Resultados (compartidos) */}
      {loading && (
        <div className="loading">
          <p>
            {activeTab === 'image' 
              ? t('search.loadingImage')
              : t('search.loadingText')
            }
          </p>
        </div>
      )}

      {!loading && searchPerformed && (
        <div className="search-results">
          <h2>
            {searchResults.length === 0 
              ? t('search.noResults')
              : `${t('search.results')} (${searchResults.length})`
            }
          </h2>
          
          <div className="players-grid">
            {searchResults.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                onClick={handlePlayerClick}
              />
            ))}
          </div>
        </div>
      )}

      {!searchPerformed && (
        <div className="welcome-message">
          <p>
            {activeTab === 'text' 
              ? t('search.welcomeText')
              : t('search.welcomeImage')
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;