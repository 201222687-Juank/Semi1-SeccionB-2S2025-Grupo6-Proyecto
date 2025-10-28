import React, { createContext, useContext, useState, useEffect } from 'react';
import { realApiService } from '../services/realApiService';

// Textos base en español (idioma fuente de la aplicación)
const baseTexts = {
  header: {
    title: "App de Fútbol",
    subtitle: "Descubre estadísticas de jugadores y equipos"
  },
  search: {
    title: "Buscar Jugadores",
    textTab: "Búsqueda por Texto",
    imageTab: "Búsqueda por Imagen",
    textPlaceholder: "Ej: Benzema, Modric, Lewandowski...",
    imagePlaceholder: "Sube una foto o usa la cámara",
    welcomeText: "Busca jugadores por nombre para ver sus estadísticas",
    welcomeImage: "Sube una foto o usa la cámara para buscar jugadores",
    loadingText: "Buscando jugadores...",
    loadingImage: "Analizando imagen con IA...",
    noResults: "No se encontraron jugadores",
    results: "Resultados",
    viewDetails: "Ver detalle de"
  },
  player: {
    goals: "Goles",
    assists: "Asistencias",
    matches: "Minutos jugados",
    position: "Posición",
    nationality: "Nacionalidad",
    team: "Equipo"
  },
  imageSearch: {
    upload: "Subir Foto",
    uploadDesc: "Selecciona una imagen desde tu dispositivo",
    camera: "Usar Cámara",
    cameraDesc: "Toma una foto con tu cámara",
    cancelCamera: "Cancelar",
    capture: "Capturar",
    analyzing: "Analizando imagen con IA..."
  },
  common: {
    language: "Idioma",
    developedWith: "Desarrollado con React & AWS",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito"
  }
};

// Creación del contexto para manejo de idiomas
const LanguageContext = createContext();

// Hook personalizado para usar el contexto de idioma
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de LanguageProvider');
  }
  return context;
};

// Proveedor del contexto de idioma
export const LanguageProvider = ({ children }) => {
  // Estado para el idioma actual
  const [currentLanguage, setCurrentLanguage] = useState('es');
  // Estado para las traducciones actuales
  const [translations, setTranslations] = useState(baseTexts);
  // Estado para indicar si se está realizando una traducción
  const [isTranslating, setIsTranslating] = useState(false);

  /**
   * Convierte un objeto anidado de textos en un objeto plano
   * @param {Object} texts - Objeto con textos anidados
   * @param {string} prefix - Prefijo para las claves (uso interno en recursión)
   * @returns {Object} Objeto plano con todas las claves
   */
  const flattenTexts = (texts, prefix = '') => {
    let flat = {};
    for (const [key, value] of Object.entries(texts)) {
      if (typeof value === 'object') {
        // Recursión para objetos anidados
        flat = { ...flat, ...flattenTexts(value, `${prefix}${key}.`) };
      } else {
        // Texto final, agregar al objeto plano
        flat[`${prefix}${key}`] = value;
      }
    }
    return flat;
  };

  /**
   * Convierte un objeto plano de textos en una estructura anidada
   * @param {Object} flatTexts - Objeto plano con claves separadas por puntos
   * @returns {Object} Objeto con estructura anidada
   */
  const unflattenTexts = (flatTexts) => {
    const nested = {};
    for (const [key, value] of Object.entries(flatTexts)) {
      const keys = key.split('.');
      let current = nested;
      
      // Navegar por la estructura anidada
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Asignar el valor en el nivel final
      current[keys[keys.length - 1]] = value;
    }
    return nested;
  };

  /**
   * Cambia el idioma de la aplicación y traduce todos los textos
   * @param {string} languageCode - Código del idioma destino (ej: 'en', 'fr')
   */
  const changeLanguage = async (languageCode) => {
    // Si el idioma es español, usar textos base sin traducción
    if (languageCode === 'es') {
      setCurrentLanguage('es');
      setTranslations(baseTexts);
      localStorage.setItem('futbol-app-language', 'es');
      return;
    }

    setIsTranslating(true);
    try {
      // Preparar textos para traducción
      const flatTexts = flattenTexts(baseTexts);
      const textArray = Object.values(flatTexts);
      const keys = Object.keys(flatTexts);

      console.log(`Cambiando idioma a: ${languageCode}`);
      
      // Realizar traducción de todos los textos
      const result = await realApiService.translateMultiple(textArray, languageCode);
      
      if (result.success) {
        // Reconstruir la estructura de traducciones
        const translatedFlatTexts = {};
        keys.forEach((key, index) => {
          translatedFlatTexts[key] = result.translations[index]?.translatedText || textArray[index];
        });

        const translatedNestedTexts = unflattenTexts(translatedFlatTexts);
        
        // Actualizar estado con las nuevas traducciones
        setCurrentLanguage(languageCode);
        setTranslations(translatedNestedTexts);
        localStorage.setItem('futbol-app-language', languageCode);
        
        console.log(`Idioma cambiado exitosamente a: ${languageCode}`);
      } else {
        console.error('Error en traducción:', result.error);
        // Fallback a español en caso de error
        setCurrentLanguage('es');
        setTranslations(baseTexts);
      }
    } catch (error) {
      console.error('Error cambiando idioma:', error);
      // Fallback a español en caso de error excepcional
      setCurrentLanguage('es');
      setTranslations(baseTexts);
    } finally {
      setIsTranslating(false);
    }
  };

  /**
   * Traduce datos de jugadores (posición, nacionalidad, equipo)
   * @param {Array} players - Array de objetos de jugadores
   * @param {string} languageCode - Código del idioma destino
   * @returns {Array} Array de jugadores con datos traducidos
   */
  const translatePlayers = async (players, languageCode = currentLanguage) => {
    try {
      // No es necesario traducir si el idioma es español
      if (languageCode === 'es') {
        return players;
      }

      console.log(`Solicitando traducción de ${players.length} jugadores...`);
      const translatedPlayers = await realApiService.translatePlayerData(players, languageCode);
      return translatedPlayers;
    } catch (error) {
      console.error('Error en translatePlayers:', error);
      // Devolver jugadores originales en caso de error
      return players;
    }
  };

  /**
   * Función de traducción para textos de la interfaz
   * @param {string} key - Clave del texto a traducir (ej: 'header.title')
   * @returns {string} Texto traducido o la clave original si no se encuentra
   */
  const translate = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    // Navegar por la estructura anidada
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key; // Devolver la clave si no se encuentra la traducción
      }
    }
    
    return value;
  };

  // Cargar idioma guardado al inicializar la aplicación
  useEffect(() => {
    const savedLanguage = localStorage.getItem('futbol-app-language');
    if (savedLanguage) {
      changeLanguage(savedLanguage);
    }
  }, []);

  // Valores proporcionados por el contexto
  const value = {
    currentLanguage,      // Idioma actual
    changeLanguage,       // Función para cambiar idioma
    t: translate,         // Función de traducción para textos de UI
    translations,         // Objeto con todas las traducciones
    isTranslating,        // Estado de carga de traducción
    translatePlayers      // Función para traducir datos de jugadores
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};