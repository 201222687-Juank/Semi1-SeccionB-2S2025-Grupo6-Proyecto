// backend/src/models/jugadoresModel.js
const { dbConfig } = require('../config/database');

class JugadorModel {
  // Datos mock para pruebas locales
  static async buscarPorNombre(nombre) {
    try {
      // Simular delay de base de datos
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const jugadoresMock = [
        {
          id: 1,
          nombre: "Karim Benzema",
          posicion: "Delantero",
          nacionalidad: "Francia",
          fecha_nacimiento: "1987-12-19",
          numero_camiseta: 9,
          foto_url: "/images/benzema.jpg",
          equipo_nombre: "Real Madrid",
          goles: 27,
          asistencias: 7,
          partidos_jugados: 35,
          tarjetas_amarillas: 3,
          tarjetas_rojas: 0
        },
        {
          id: 2,
          nombre: "Luka Modric",
          posicion: "Centrocampista",
          nacionalidad: "Croacia",
          fecha_nacimiento: "1985-09-09",
          numero_camiseta: 10,
          foto_url: "/images/modric.jpg",
          equipo_nombre: "Real Madrid",
          goles: 5,
          asistencias: 8,
          partidos_jugados: 32,
          tarjetas_amarillas: 4,
          tarjetas_rojas: 0
        },
        {
          id: 3,
          nombre: "Robert Lewandowski",
          posicion: "Delantero",
          nacionalidad: "Polonia",
          fecha_nacimiento: "1988-08-21",
          numero_camiseta: 9,
          foto_url: "/images/lewa.jpg",
          equipo_nombre: "FC Barcelona",
          goles: 23,
          asistencias: 6,
          partidos_jugados: 30,
          tarjetas_amarillas: 2,
          tarjetas_rojas: 0
        }
      ];

      // Si no hay nombre, devolver todos los jugadores
      if (!nombre || nombre.trim() === '') {
        return jugadoresMock;
      }

      // Filtrar jugadores por nombre
      const jugadoresFiltrados = jugadoresMock.filter(jugador =>
        jugador.nombre.toLowerCase().includes(nombre.toLowerCase())
      );

      return jugadoresFiltrados;
    } catch (error) {
      console.error(' Error en modelo buscarPorNombre:', error);
      throw error;
    }
  }

  // Obtener jugador por ID
  static async obtenerPorId(id) {
    try {
      // Simular delay de base de datos
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const jugadoresMock = [
        {
          id: 1,
          nombre: "Karim Benzema",
          posicion: "Delantero",
          nacionalidad: "Francia",
          fecha_nacimiento: "1987-12-19",
          numero_camiseta: 9,
          foto_url: "/images/benzema.jpg",
          equipo_nombre: "Real Madrid",
          goles: 27,
          asistencias: 7,
          partidos_jugados: 35,
          tarjetas_amarillas: 3,
          tarjetas_rojas: 0
        },
        {
          id: 2,
          nombre: "Luka Modric",
          posicion: "Centrocampista",
          nacionalidad: "Croacia",
          fecha_nacimiento: "1985-09-09",
          numero_camiseta: 10,
          foto_url: "/images/modric.jpg",
          equipo_nombre: "Real Madrid",
          goles: 5,
          asistencias: 8,
          partidos_jugados: 32,
          tarjetas_amarillas: 4,
          tarjetas_rojas: 0
        },
        {
          id: 3,
          nombre: "Robert Lewandowski",
          posicion: "Delantero",
          nacionalidad: "Polonia",
          fecha_nacimiento: "1988-08-21",
          numero_camiseta: 9,
          foto_url: "/images/lewa.jpg",
          equipo_nombre: "FC Barcelona",
          goles: 23,
          asistencias: 6,
          partidos_jugados: 30,
          tarjetas_amarillas: 2,
          tarjetas_rojas: 0
        }
      ];

      const jugador = jugadoresMock.find(j => j.id === parseInt(id));
      return jugador || null;
    } catch (error) {
      console.error(' Error en modelo obtenerPorId:', error);
      throw error;
    }
  }
}

module.exports = JugadorModel;