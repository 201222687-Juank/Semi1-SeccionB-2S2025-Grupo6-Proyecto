const express = require('express');
const router = express.Router();
const TranslateService = require('../services/TraslateService');

// POST /api/translate - Traducir un solo texto
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    // Validar campos requeridos
    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren los campos "text" y "targetLanguage"'
      });
    }

    // Validar que el texto no esté vacío
    if (text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El campo "text" no puede estar vacío'
      });
    }


    const translation = await TranslateService.translateText(text, targetLanguage);
    
    
    res.json(translation);
  } catch (error) {
    console.error(' Error en endpoint de traducción:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al traducir',
      details: error.message
    });
  }
});

// POST /api/translate/batch - Traducir múltiples textos
router.post('/batch', async (req, res) => {
  try {
    const { texts, targetLanguage } = req.body;

    // Validar campos requeridos
    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren los campos "texts" (array) y "targetLanguage"'
      });
    }

    // Validar que el array no esté vacío
    if (texts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El array "texts" no puede estar vacío'
      });
    }

    // Filtrar textos vacíos
    const validTexts = texts.filter(text => text && text.trim() !== '');
    
    if (validTexts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay textos válidos para traducir'
      });
    }

    console.log(` Solicitando traducción batch: ${validTexts.length} textos -> ${targetLanguage}`);

    const translations = await TranslateService.translateMultiple(validTexts, targetLanguage);
    
    console.log(` Traducción batch completada: ${translations.filter(t => t.success).length}/${validTexts.length} textos traducidos`);
    
    res.json({
      success: true,
      totalTexts: validTexts.length,
      successfulTranslations: translations.filter(t => t.success).length,
      translations
    });
  } catch (error) {
    console.error(' Error en endpoint de traducción batch:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al traducir textos',
      details: error.message
    });
  }
});

// GET /api/translate/languages - Obtener idiomas soportados
router.get('/languages', (req, res) => {
  const supportedLanguages = [
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

  res.json({
    success: true,
    languages: supportedLanguages,
    total: supportedLanguages.length
  });
});

// GET /api/translate/test - Endpoint de prueba
router.get('/test', async (req, res) => {
  try {
    const testText = "Hola mundo, esta es una prueba de AWS Translate";
    const targetLanguage = 'en';
    
    console.log(` Ejecutando prueba de traducción...`);
    
    const translation = await TranslateService.translateText(testText, targetLanguage);
    
    res.json({
      success: true,
      test: 'AWS Translate Connection Test',
      originalText: testText,
      targetLanguage: targetLanguage,
      result: translation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      test: 'AWS Translate Connection Test',
      error: error.message,
      details: 'Verifica las credenciales AWS y los permisos de Translate',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;