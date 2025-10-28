// backend/src/routes/jugadoresRoutes.js
const express = require('express');
const router = express.Router();
const JugadoresController = require('../controllers/jugadoresController');

// GET /api/jugadores - Obtener todos los jugadores
router.get('/buscar', JugadoresController.buscarJugadores);

// GET /api/jugadores/todos - Obtener todos los jugadores (alternativa)
router.get('/todos', JugadoresController.obtenerTodos);

// GET /api/jugadores/1 - Obtener jugador por ID
router.get('/:id', JugadoresController.obtenerJugador);

// GET /api/jugadores/1/estadisticas - Obtener estadísticas del jugador
router.get('/:id/estadisticas', JugadoresController.obtenerEstadisticas);

//

// NUEVO ENDPOINT: /api/jugadores/buscarjugador/:nombre
router.get('/buscarjugador/:nombre', JugadoresController.informacionJugador);

module.exports = router;