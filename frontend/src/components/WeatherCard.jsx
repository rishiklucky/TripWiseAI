import React from 'react';

export const WeatherCard = ({ weather }) => {
  if (!weather) {
    return <span className="badge bg-light text-muted border">Weather unavailable</span>;
  }

  const { tempC, condition, chanceOfRain } = weather;

  return (
    <div className="d-flex align-items-center gap-2 bg-light px-3 py-2 rounded-3 border">
      <span className="fs-5">{condition?.includes('Sunny') ? '☀️' : condition?.includes('Cloud') ? '⛅' : '🌤️'}</span>
      <div className="text-start leading-tight">
        <div className="fw-bold small">{tempC !== undefined ? `${tempC}°C` : 'N/A'}</div>
        <div className="text-muted text-capitalize" style={{ fontSize: '0.75rem' }}>
          {condition || 'Clear'} {chanceOfRain && `• Rain: ${chanceOfRain}`}
        </div>
      </div>
    </div>
  );
};
