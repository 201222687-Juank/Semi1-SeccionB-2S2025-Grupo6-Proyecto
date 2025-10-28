const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/database'); // Importa tu pool de MySQL

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// Middlewares
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Normalizar URLs que tengan varias barras al inicio
app.use((req, res, next) => {
  if (req.url.startsWith('//')) {
    req.url = req.url.replace(/^\/+/, '/');
  }
  next();
});

// Logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// =====================
// Verificar conexión a la base de datos
// =====================
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  }
})();

// =====================
// Rutas
// =====================
app.use('/api/jugadores', require('./src/routes/jugadoresRoutes'));
app.use('/api/translate', require('./src/routes/translateRoutes'));
app.use('/api/rekognition', require('./src/routes/rekognitionRoutes'));

// =====================
// Ruta de salud
// =====================
app.get('/health', async (req, res) => {
  let dbStatus = 'Desconectada';
  try {
    const connection = await pool.getConnection();
    dbStatus = 'Conectada';
    connection.release();
  } catch (err) {
    dbStatus = 'Error: ' + err.message;
  }

  res.json({
    status: 'OK',
    message: 'API de Fútbol funcionando',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    endpoints: {
      jugadores: '/api/jugadores',
      translate: '/api/translate',
      rekognition: '/api/rekognition',
      health: '/health'
    }
  });
});

// =====================
// Manejo de errores global
// =====================
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// =====================
// Ruta no encontrada
// =====================
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// =====================
// Iniciar servidor
// =====================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
