import React from 'react';
import { useLanguage } from '../context/LenguajeContext';
import './PlayerCard.css';

const PlayerCard = ({ player, onClick }) => {
  const { t } = useLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div className="player-card" onClick={handleClick}>
      <div className="player-header">
        <h3 className="player-name">Nombre: {player.nombre}  </h3>
        <span className="player-number">Apellido: {player.apellido}</span>
      </div>
      
      <div className="player-info">
        <div className="player-position">
          <strong>{t('player.position')}:</strong> {player.posicion}
        </div>
        <div className="player-nationality">
          <strong>{t('player.nationality')}:</strong> {player.nacionalidad}
        </div>
      </div>
      
      <div className="player-team">
        <span className="team-name">
          <strong>{t('player.team')}:</strong> {player.nombredelequipo}
        </span>
      </div>
      
      <div className="player-stats">
        <div className="stat">
          <span className="stat-value">{player.goles}</span>
          <span className="stat-label">{t('player.goals')}</span>
        </div>
        <div className="stat">
          <span className="stat-value">{player.asistencias}</span>
          <span className="stat-label">{t('player.assists')}</span>
        </div>
        <div className="stat">
          <span className="stat-value">{player.minutos_jugados}</span>
          <span className="stat-label">{t('player.matches')}</span>
        </div>
      </div>

      {/* Indicador de traducción */}
      {player._translated && (
        <div className="translation-badge">
           {player._targetLanguage ? player._targetLanguage.toUpperCase() : ''}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;