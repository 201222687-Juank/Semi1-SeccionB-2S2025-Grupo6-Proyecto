const { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand, CreateCollectionCommand } = require('@aws-sdk/client-rekognition');
const { rekognitionClient } = require('../config/aws');

class RekognitionService {
  // Nombre de la colección para rostros de jugadores
  static collectionId = 'futbol-players-collection';

  /**
   * Crear colección de rostros en Rekognition
   */
  static async createCollection() {
    try {
      const command = new CreateCollectionCommand({
        CollectionId: this.collectionId
      });

      const response = await rekognitionClient.send(command);
      console.log('Colección de Rekognition creada:', response);
      return response;
    } catch (error) {
      console.error('Error creando colección Rekognition:', error);
      throw error;
    }
  }

  /**
   * Indexar rostro de jugador en la colección
   * @param {string} imageBytes - Imagen en formato base64 o buffer
   * @param {string} playerId - ID del jugador
   * @param {string} playerName - Nombre del jugador
   */
  static async indexPlayerFace(imageBytes, playerId, playerName) {
    try {
      const command = new IndexFacesCommand({
        CollectionId: this.collectionId,
        Image: {
          Bytes: imageBytes
        },
        ExternalImageId: playerId,
        DetectionAttributes: ['ALL'],
        MaxFaces: 1,
        QualityFilter: 'AUTO'
      });

      const response = await rekognitionClient.send(command);
      
      console.log(`Rostro indexado para jugador: ${playerName} (ID: ${playerId})`);
      return {
        success: true,
        faceRecords: response.FaceRecords,
        faceId: response.FaceRecords[0]?.Face?.FaceId
      };
    } catch (error) {
      console.error('Error indexando rostro:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Buscar jugador por imagen
   * @param {Buffer} imageBytes - Imagen a analizar
   * @param {number} maxFaces - Número máximo de rostros a buscar
   * @param {number} similarityThreshold - Umbral de similitud (0-100)
   */
  static async searchPlayerByImage(imageBytes, maxFaces = 5, similarityThreshold = 80) {
    try {
      const command = new SearchFacesByImageCommand({
        CollectionId: this.collectionId,
        Image: {
          Bytes: imageBytes
        },
        MaxFaces: maxFaces,
        FaceMatchThreshold: similarityThreshold
      });

      const response = await rekognitionClient.send(command);
      
      // Procesar resultados
      const matches = response.FaceMatches?.map(match => ({
        faceId: match.Face?.FaceId,
        playerId: match.Face?.ExternalImageId,
        similarity: match.Similarity,
        confidence: match.Face?.Confidence
      })) || [];

      console.log(`Encontrados ${matches.length} coincidencias de rostros`);
      
      return {
        success: true,
        matches: matches,
        searchedFace: response.SearchedFaceBoundingBox,
        searchedFaceConfidence: response.SearchedFaceConfidence
      };
    } catch (error) {
      console.error('Error buscando rostro:', error);
      return {
        success: false,
        error: error.message,
        matches: []
      };
    }
  }

  /**
   * Procesar imagen y buscar jugadores (método principal)
   * @param {Buffer} imageBuffer - Buffer de la imagen
   */
  static async analyzeImage(imageBuffer) {
    try {
      console.log('Analizando imagen con Rekognition...');
      
      const searchResult = await this.searchPlayerByImage(imageBuffer);
      
      if (!searchResult.success) {
        throw new Error(searchResult.error);
      }

      // Simular datos de jugadores basados en las coincidencias
      // En producción, aquí buscarías en tu base de datos usando los playerIds
      const simulatedPlayers = this.simulatePlayerResults(searchResult.matches);
      
      return {
        success: true,
        analysis: searchResult,
        players: simulatedPlayers,
        faceCount: searchResult.matches.length
      };
    } catch (error) {
      console.error('Error en análisis de imagen:', error);
      return {
        success: false,
        error: error.message,
        players: []
      };
    }
  }

  /**
   * Simular resultados de jugadores (para desarrollo)
   * @param {Array} matches - Coincidencias de Rekognition
   */
  static simulatePlayerResults(matches) {
    // Mapeo de IDs simulados a datos de jugadores
    const playerDatabase = {
      '1': {
        id: 1,
        nombre: 'Karim Benzema',
        posicion: 'Delantero',
        nacionalidad: 'Francia',
        equipo_nombre: 'Real Madrid',
        similitud: 95
      },
      '2': {
        id: 2,
        nombre: 'Luka Modric',
        posicion: 'Centrocampista', 
        nacionalidad: 'Croacia',
        equipo_nombre: 'Real Madrid',
        similitud: 87
      },
      '3': {
        id: 3,
        nombre: 'Robert Lewandowski',
        posicion: 'Delantero',
        nacionalidad: 'Polonia',
        equipo_nombre: 'FC Barcelona',
        similitud: 92
      }
    };

    return matches.map(match => {
      const playerData = playerDatabase[match.playerId] || {
        id: parseInt(match.playerId) || 0,
        nombre: `Jugador ${match.playerId}`,
        posicion: 'Desconocida',
        nacionalidad: 'Desconocida',
        equipo_nombre: 'Equipo Desconocido',
        similitud: match.similarity
      };

      return {
        ...playerData,
        confidence: match.confidence,
        similarity: match.similarity,
        faceId: match.faceId
      };
    });
  }
}

module.exports = RekognitionService;