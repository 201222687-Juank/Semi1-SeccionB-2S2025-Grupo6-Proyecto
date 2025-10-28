// Define la URL base de tu servidor backend. 
// **Importante:** Esta debe ser la dirección donde corre tu API Express (ej. http://localhost:5000).
// Se utiliza 'http://localhost:3000' según tu indicación, asumiendo que es donde está la API.
const BASE_URL = 'http://balanceadorfutbol-969715451.us-east-1.elb.amazonaws.com';

/**
 * Función auxiliar para realizar llamadas Fetch y manejar la respuesta JSON,
 * incluyendo el manejo de errores HTTP.
 * * @param {string} url - La URL del endpoint al que llamar (ej. '/api/jugadores?nombre=...').
 * @returns {Promise<any>} - La respuesta parseada como JSON.
 * @throws {Error} - Lanza un error si la respuesta HTTP no es exitosa (código >= 400).
 */
const fetchData = async (url) => {
    try {
        // Concatenamos la BASE_URL con la ruta relativa para formar la URL completa.
        const fullUrl = BASE_URL + url;
        console.log(`Realizando fetch a: ${fullUrl}`);
        
        const response = await fetch(fullUrl);

        // Verifica si la respuesta HTTP fue exitosa (código 200-299).
        if (!response.ok) {
            // Si la respuesta no es OK, intenta obtener el texto de la respuesta para el error.
            const errorText = await response.text();
            
            // Loguea el texto del error devuelto por el servidor para su depuración.
            console.error("Error devuelto por el servidor (Texto Crudo):", errorText);
            
            // Lanza un error con el estado HTTP.
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}. Respuesta del servidor: ${errorText.substring(0, 100)}...`);
        }
        
        // Parsea la respuesta como JSON y la retorna.
        return await response.json();
    } catch (error) {
        // Si el error es una falla de red o el SyntaxError de JSON, se imprime aquí.
        console.error("Error al realizar la solicitud a la API o al parsear JSON:", error);
        // Propaga el error para que pueda ser manejado por el componente que llama.
        throw error;
    }
};

/**
 * Objeto 'api' que contiene los métodos para interactuar con el backend de jugadores y equipos.
 * La ruta base para los jugadores es '/api/jugadores'.
 */
export const api = {
    /**
     * Busca jugadores en el backend usando el término de búsqueda.
     * * **ALINEACIÓN CON BACKEND:** Este método utiliza el parámetro 'nombre' en el query, 
     * lo cual se alinea con 'req.query.nombre' esperado por JugadoresController.buscarJugadores.
     * * @param {string} searchTerm - El nombre o parte del nombre a buscar.
     * @returns {Promise<Array<object>>} - Una promesa que resuelve con la lista de jugadores filtrados.
     */
    searchPlayers: async (searchTerm) => {
        console.log(`Buscando jugadores en el backend usando 'nombre': ${searchTerm}`);
        
        // Si no hay término de búsqueda o es vacío, se devuelve un array vacío.
        if (!searchTerm || searchTerm.trim() === '') {
            return [];
        }

        // Construye la URL. Usa 'nombre' como parámetro de consulta para coincidir con el backend.
        // Endpoint: GET /api/jugadores?nombre=Benzema
        const url = `/api/jugadores/buscarjugador/${encodeURIComponent(searchTerm)}`;
        
        return await fetchData(url);
    },

    /**
     * Obtiene un jugador específico por su ID.
     * * **ALINEACIÓN CON BACKEND:** Este método coincide con la ruta 'GET /api/jugadores/:id' 
     * y el controlador JugadoresController.obtenerJugador.
     * * @param {number|string} playerId - El identificador del jugador.
     * @returns {Promise<object>} - El objeto jugador.
     */
    getPlayer: async (playerId) => {
        console.log(`Obteniendo jugador ID del backend: ${playerId}`);
        // Endpoint: GET /api/jugadores/1
        const url = `/api/jugadores/${playerId}`;
        return await fetchData(url);
    },
    
    /**
     * Obtiene todos los jugadores.
     * * **ALINEACIÓN CON BACKEND:** Este método coincide con la ruta 'GET /api/jugadores/todos' 
     * y el controlador JugadoresController.obtenerTodos.
     * * @returns {Promise<Array<object>>} - Lista de todos los jugadores.
     */
    getAllPlayers: async () => {
        console.log('Obteniendo todos los jugadores del backend.');
        // Endpoint: GET /api/jugadores/todos
        const url = `/api/jugadores/todos`;
        return await fetchData(url);
    },


    // NOTA: Los siguientes métodos asumen la existencia de rutas de backend que no
    // fueron provistas en el archivo jugadoresRoutes.js, o requieren lógica
    // adicional en el controlador buscarJugadores.

    /**
     * Obtiene todos los equipos.
     * **REQUERIMIENTO DE BACKEND:** Asume la existencia de la ruta 'GET /api/equipos'.
     * * @returns {Promise<Array<object>>} - Lista de equipos.
     */
    getTeams: async () => {
        console.log('Obteniendo todos los equipos del backend (Ruta /api/equipos).');
        const url = `/api/equipos`; 
        return await fetchData(url);
    },

    /**
     * Obtiene jugadores que pertenecen a un equipo específico.
     * * **REQUERIMIENTO DE BACKEND:** Este filtro DEBE ser implementado dentro 
     * de JugadoresController.buscarJugadores o en una ruta separada, 
     * ya que el controlador actual solo filtra por 'nombre'.
     * * @param {number|string} teamId - El identificador del equipo.
     * @returns {Promise<Array<object>>} - Lista de jugadores del equipo.
     */
    getPlayersByTeam: async (teamId) => {
        console.log(`Obteniendo jugadores por equipo ID: ${teamId} (Requiere backend para manejar teamId).`);
        // Endpoint supuesto: GET /api/jugadores?teamId=1
        const url = `/api/jugadores?teamId=${teamId}`;
        return await fetchData(url);
    }
};
