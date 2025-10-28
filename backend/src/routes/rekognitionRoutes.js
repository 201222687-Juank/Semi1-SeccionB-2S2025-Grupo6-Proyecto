const express = require('express');
const router = express.Router();
const multer = require('multer');
const RekognitionService = require('../services/rekognitionService');

// Configurar multer para upload de imágenes
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

/**
 * POST /api/rekognition/search
 * Buscar jugadores por imagen
 */
router.post('/search', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere una imagen'
      });
    }

    console.log('Procesando imagen para búsqueda de jugadores...');
    
    const analysisResult = await RekognitionService.analyzeImage(req.file.buffer);
    
    if (analysisResult.success) {
      res.json({
        success: true,
        message: `Análisis completado. Encontrados ${analysisResult.faceCount} rostros`,
        data: analysisResult
      });
    } else {
      res.status(400).json({
        success: false,
        error: analysisResult.error
      });
    }
  } catch (error) {
    console.error('Error en endpoint de búsqueda por imagen:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al procesar imagen'
    });
  }
});

/**
 * POST /api/rekognition/index
 * Indexar nuevo jugador en Rekognition
 */
router.post('/index', upload.single('image'), async (req, res) => {
  try {
    const { playerId, playerName } = req.body;
    
    if (!req.file || !playerId || !playerName) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren imagen, playerId y playerName'
      });
    }

    console.log(`Indexando jugador: ${playerName} (ID: ${playerId})`);
    
    const indexResult = await RekognitionService.indexPlayerFace(
      req.file.buffer,
      playerId,
      playerName
    );

    res.json(indexResult);
  } catch (error) {
    console.error('Error indexando jugador:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al indexar jugador'
    });
  }
});

/**
 * POST /api/rekognition/collection/create
 * Crear colección de rostros
 */
router.post('/collection/create', async (req, res) => {
  try {
    const result = await RekognitionService.createCollection();
    res.json({
      success: true,
      message: 'Colección creada exitosamente',
      data: result
    });
  } catch (error) {
    console.error('Error creando colección:', error);
    res.status(500).json({
      success: false,
      error: 'Error creando colección de rostros'
    });
  }
});

module.exports = router;