// Para configuracion de la API REAL 
const API_BASE_URL = 'http://balanceadorfutbol-969715451.us-east-1.elb.amazonaws.com/api';

export const realApiService = {
  // Traducir texto usando el backend con AWS Translate
  translateText: async (text, targetLanguage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en traducción:', error);
      return {
        success: false,
        translatedText: text, // Texto original como fallback
        error: error.message
      };
    }
  },

  // Traducir múltiples textos
  translateMultiple: async (texts, targetLanguage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/translate/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en traducción múltiple:', error);
      return {
        success: false,
        translations: texts.map(text => ({
          success: false,
          translatedText: text
        }))
      };
    }
  }, 

  // Traducir la carta y datos de un Jugador 
  translatePlayerData: async (players, targetLanguage) => {
    try {
      // Si el idioma es español, no necesitamos traducir
      if (targetLanguage === 'es') {
        return players;
      }

      console.log(`Traduciendo datos de ${players.length} jugadores a ${targetLanguage}`);
      
      // Extraer todos los textos que necesitan traducción
      const textsToTranslate = [];
      const textMap = new Map(); // Para mapear textos originales a traducidos
      
      players.forEach(player => {
        // Agregar campos que necesitan traducción
        if (player.posicion) {
          textsToTranslate.push(player.posicion);
          textMap.set(player.posicion, 'posicion');
        }
        if (player.nacionalidad) {
          textsToTranslate.push(player.nacionalidad);
          textMap.set(player.nacionalidad, 'nacionalidad');
        }
        if (player.equipo_nombre) {
          textsToTranslate.push(player.equipo_nombre);
          textMap.set(player.equipo_nombre, 'equipo_nombre');
        }
      });

      // Agregar traducciones de posiciones comunes
      const commonPositions = ['Delantero', 'Centrocampista', 'Defensa', 'Portero'];
      commonPositions.forEach(pos => {
        if (!textsToTranslate.includes(pos)) {
          textsToTranslate.push(pos);
          textMap.set(pos, 'position_common');
        }
      });

      // Eliminar duplicados
      const uniqueTexts = [...new Set(textsToTranslate)];

      if (uniqueTexts.length === 0) {
        return players;
      }

      // Traducir todos los textos
      const translationResult = await realApiService.translateMultiple(uniqueTexts, targetLanguage);
      
      if (!translationResult.success) {
        console.error('Error en traducción de jugadores:', translationResult.error);
        return players;
      }

      // Crear mapa de traducciones
      const translationMap = new Map();
      uniqueTexts.forEach((text, index) => {
        if (translationResult.translations[index] && translationResult.translations[index].success) {
          translationMap.set(text, translationResult.translations[index].translatedText);
        }
      });

      // Aplicar traducciones a los jugadores
      const translatedPlayers = players.map(player => ({
        ...player,
        posicion: translationMap.get(player.posicion) || player.posicion,
        nacionalidad: translationMap.get(player.nacionalidad) || player.nacionalidad,
        equipo_nombre: translationMap.get(player.equipo_nombre) || player.equipo_nombre,
        // Marcar que estos datos están traducidos
        _translated: true,
        _targetLanguage: targetLanguage
      }));

      console.log(`Jugadores traducidos exitosamente a ${targetLanguage}`);
      return translatedPlayers;

    } catch (error) {
      console.error('Error traduciendo datos de jugadores:', error);
      return players; // Devolver jugadores originales en caso de error
    }
  }

};