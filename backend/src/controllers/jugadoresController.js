const pool = require('../config/database');

class JugadoresController {

  // Obtener todos los jugadores
  static async obtenerTodos(req, res) {
    try {
      const [jugadores] = await pool.query('SELECT * FROM jugador');
      console.log(`Obtenidos ${jugadores.length} jugadores`);
      res.json(jugadores);
    } catch (error) {
      console.error('Error obteniendo jugadores:', error.message);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Buscar jugadores por nombre o apellido
  static async buscarJugadores(req, res) {
    try {
      const { nombre } = req.query;
      if (!nombre) return res.status(400).json({ error: 'El parámetro "nombre" es requerido' });

      const [jugadores] = await pool.query(
        'SELECT * FROM jugador WHERE nombre LIKE ? OR apellido LIKE ?',
        [`%${nombre}%`, `%${nombre}%`]
      );

      console.log(`Encontrados ${jugadores.length} jugadores`);
      res.json(jugadores);
    } catch (error) {
      console.error('Error buscando jugadores:', error.message);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Obtener un jugador por ID
  static async obtenerJugador(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) return res.status(400).json({ error: 'ID de jugador válido es requerido' });

      const [rows] = await pool.query('SELECT * FROM jugador WHERE id_jugador = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Jugador no encontrado' });

      res.json(rows[0]);
    } catch (error) {
      console.error('Error obteniendo jugador:', error.message);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Obtener estadísticas de un jugador
  static async obtenerEstadisticas(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) return res.status(400).json({ error: 'ID de jugador válido es requerido' });

      const [jugador] = await pool.query('SELECT * FROM jugador WHERE id_jugador = ?', [id]);
      if (jugador.length === 0) return res.status(404).json({ error: 'Jugador no encontrado' });

      const [estadisticas] = await pool.query(
        `SELECT 
           SUM(goles) AS goles,
           SUM(asistencias) AS asistencias,
           SUM(minutos_jugados) AS minutos_jugados,
           SUM(tarjetas_amarillas) AS tarjetas_amarillas,
           SUM(tarjetas_rojas) AS tarjetas_rojas
         FROM estadistica_jugador_partido
         WHERE id_jugador = ?`,
        [id]
      );

      res.json({
        jugador: jugador[0],
        estadisticas: estadisticas[0] || {}
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error.message);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }


 // ==============================
  // NUEVO MÉTODO: Buscar información completa del jugador
  // ==============================
  static async informacionJugador(req, res) {
    try {
      const { nombre } = req.params;
      if (!nombre) return res.status(400).json({ error: 'El parámetro "nombre" es requerido' });

      const [rows] = await pool.query(`
        SELECT 
          j.id_jugador,
          j.nombre,
          j.apellido,
          j.posicion,
          j.fecha_nacimiento,
          j.posicion,
          j.nacionalidad,
          e.id_equipo,
          e.nombre as nombredelequipo,
          e.pais,                    
          ejp.goles,
          ejp.asistencias,
          ejp.minutos_jugados          
        FROM jugador j
        LEFT JOIN equipo e ON j.id_equipo = e.id_equipo
        LEFT JOIN estadistica_jugador_partido ejp ON j.id_jugador = ejp.id_jugador
        WHERE j.nombre LIKE ? OR j.apellido LIKE ?
      `, [`%${nombre}%`, `%${nombre}%`]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Jugador no encontrado' });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener la información del jugador:', error.message);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }


}

module.exports = JugadoresController;
