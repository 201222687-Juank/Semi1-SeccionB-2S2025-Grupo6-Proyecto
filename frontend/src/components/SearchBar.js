// Importa la biblioteca React y el hook 'useState' para gestionar el estado del componente.
import React, { useState } from 'react';
// Importa los estilos CSS específicos para este componente.
import './SearchBar.css';

/**
 * Componente funcional SearchBar.
 * Implementa una barra de búsqueda controlada por React.
 *
 * @param {object} props - Propiedades pasadas al componente.
 * @param {function} props.onSearch - Función de callback que se ejecuta al enviar la búsqueda. Recibe el término de búsqueda.
 * @param {string} [props.placeholder="Buscar jugador..."] - Texto que se muestra en el campo de entrada cuando está vacío.
 */
const SearchBar = ({ onSearch, placeholder = "Buscar jugador..." }) => {
  // Inicializa el estado 'searchTerm' con una cadena vacía.
  // 'searchTerm' almacenará la entrada actual del usuario.
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Manejador de evento para el envío del formulario.
   *
   * @param {object} e - Objeto de evento sintético de React.
   */
  const handleSubmit = (e) => {
    // Previene el comportamiento por defecto del formulario (recarga de página).
    e.preventDefault();
    // Llama a la función 'onSearch' pasada por el componente padre,
    // enviando el término de búsqueda actual como argumento.
    onSearch(searchTerm);
  };

  // Renderiza la estructura de la barra de búsqueda.
  return (
    // El formulario se vincula con 'handleSubmit' para manejar el envío.
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        {/* Campo de entrada de texto */}
        <input
          type="text"
          // El valor del campo está controlado por el estado 'searchTerm'.
          value={searchTerm}
          // El evento 'onChange' actualiza el estado 'searchTerm' con el valor de entrada.
          onChange={(e) => setSearchTerm(e.target.value)}
          // Asigna el texto de marcador de posición (placeholder) recibido por props.
          placeholder={placeholder}
          className="search-input"
        />
        {/* Botón de envío */}
        <button type="submit" className="search-button">
          {/* Símbolo de lupa, que actúa como ícono de búsqueda */}
          🔍
        </button>
      </div>
    </form>
  );
};

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación.
export default SearchBar;