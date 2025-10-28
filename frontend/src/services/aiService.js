// Servicio para integración con Rekognition
//const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'http://balanceadorfutbol-969715451.us-east-1.elb.amazonaws.com/api';

export const aiService = {
  /**
   * Analizar imagen con Rekognition
   * @param {File} imageFile - Archivo de imagen
   */
  analyzeImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      console.log('Enviando imagen a Rekognition...');
      
      const response = await fetch(`${API_BASE_URL}/rekognition/search`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Análisis de imagen completado:', data.message);
        return {
          success: true,
          matches: data.data.players,
          analysis: data.data.analysis,
          analyzedImage: URL.createObjectURL(imageFile)
        };
      } else {
        throw new Error(data.error || 'Error en el análisis de imagen');
      }
    } catch (error) {
      console.error('Error en análisis de imagen:', error);
      
      // Fallback: simular resultados si el servicio no está disponible
      return await aiService.simulateImageAnalysis(imageFile);
    }
  },

  /**
   * Simular análisis de imagen (para desarrollo)
   */
  simulateImageAnalysis: async (imageFile) => {
    console.log('Simulando análisis de imagen...');
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Resultados simulados basados en el nombre del archivo
    const simulatedResults = [
      { 
        id: 1, 
        confidence: 95, 
        similarity: 95,
        nombre: "Karim Benzema",
        posicion: "Delantero",
        nacionalidad: "Francia",
        equipo_nombre: "Real Madrid"
      },
      { 
        id: 2, 
        confidence: 87, 
        similarity: 87,
        nombre: "Luka Modric", 
        posicion: "Centrocampista",
        nacionalidad: "Croacia",
        equipo_nombre: "Real Madrid"
      },
      { 
        id: 3, 
        confidence: 76, 
        similarity: 76,
        nombre: "Robert Lewandowski",
        posicion: "Delantero",
        nacionalidad: "Polonia", 
        equipo_nombre: "FC Barcelona"
      }
    ];
    
    return {
      success: true,
      matches: simulatedResults,
      analyzedImage: URL.createObjectURL(imageFile),
      isSimulated: true
    };
  }
};