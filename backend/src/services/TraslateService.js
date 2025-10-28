


// Importa la clase
// Esto es parte del patrón Command de AWS SDK v3.
const { TranslateTextCommand } = require('@aws-sdk/client-translate');

// Importa el cliente de AWS Translate previamente configurado y autenticado.
// se encuentra en '../config/aws'.
const { translateClient } = require('../config/aws');

/**
 * Clase de servicio que encapsula toda la lógica de negocio 
 * relacionada con el servicio Amazon Translate.
 */
class TranslateService {
  
  // --- Método principal de traducción singular ---
  /**
   * Traduce un fragmento de texto utilizando el cliente de AWS Translate.
   * text - El texto a traducir.
   * targetLanguage - El código del idioma de destino (ej: 'es', 'en').
   *  Un objeto con el resultado de la traducción o el error.
   */
  static async translateText(text, targetLanguage) {
    try {
      // Registro de inicio de la operación. Se trunca el texto para la visualización en consola.
      console.log(`Iniciando traducción: "${text.substring(0, 50)}..." -> ${targetLanguage}`);

      // Crea el comando con los parámetros necesarios para la API TranslateText.
      const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: 'auto', // Configura a AWS para detectar automáticamente el idioma fuente.
        TargetLanguageCode: targetLanguage // Idioma al que se debe traducir el texto.
      });

      // Envía el comando al cliente de AWS Translate y espera la respuesta.
      const response = await translateClient.send(command);
      
      // Registro de éxito de la operación.
      console.log(`Traducción exitosa: ${response.SourceLanguageCode} -> ${targetLanguage}`);
      
      // Retorna el resultado estructurado de la operación.
      return {
        success: true,
        translatedText: response.TranslatedText,
        sourceLanguage: response.SourceLanguageCode,
        targetLanguage: targetLanguage,
        characterCount: text.length
      };
    } catch (error) {
      // Manejo de cualquier error de la API de AWS o de la red.
      console.error('Error en AWS Translate:', error);
      // Retorna el error y el texto original en caso de fallo, manteniendo la estructura de respuesta.
      return {
        success: false,
        error: error.message,
        translatedText: text, // Devuelve texto original para facilitar la gestión en el cliente.
        targetLanguage: targetLanguage,
        characterCount: text.length
      };
    }
  }

  // --- Método de traducción de múltiples textos (Batch) ---

  static async translateMultiple(texts, targetLanguage) {
    console.log(`Iniciando traducción batch de ${texts.length} textos...`);
    
    const translations = [];
    let successCount = 0;
    let errorCount = 0;
    
    // Itera sobre cada texto y llama a la función de traducción singular.
    for (const text of texts) {
      try {
        const translation = await this.translateText(text, targetLanguage);
        translations.push(translation);
        
        if (translation.success) {
          successCount++;
        } else {
          errorCount++;
        }
        
        // Introduce un pequeño retraso para mitigar problemas de límites de tasa (rate limiting) de la API.
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errorCount++;
        // Captura el error de promesa para el texto específico.
        translations.push({
          success: false,
          translatedText: text,
          error: error.message,
          targetLanguage: targetLanguage
        });
      }
    }
    
    console.log(`Batch completado: ${successCount} éxitos, ${errorCount} errores`);
    
    return translations;
  }

  // --- Método de verificación de estado (Health Check) ---

  static async healthCheck() {
    try {
      const testText = "Hello";
      const command = new TranslateTextCommand({
        Text: testText,
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'es'
      });

      // Envía el comando de prueba sin esperar un resultado específico.
      await translateClient.send(command);
      return { success: true, message: 'AWS Translate está funcionando correctamente' };
    } catch (error) {
      // Captura cualquier error de conexión o autenticación.
      return { 
        success: false, 
        message: 'Error conectando con AWS Translate',
        error: error.message 
      };
    }
  }
}

// Exporta la clase de servicio para su uso en la capa de la aplicación.
module.exports = TranslateService;