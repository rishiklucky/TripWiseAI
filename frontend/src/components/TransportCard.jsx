import React from 'react';

export const TransportCard = ({ option = {}, currency = 'INR' }) => {
  const { mode, carrier, estimatedPrice, duration, priceType } = option;

  const getIcon = (m = '') => {
    if (m.toLowerCase().includes('flight')) return 'bi-airplane-fill';
    if (m.toLowerCase().includes('train')) return 'bi-train-front-fill';
    if (m.toLowerCase().includes('bus')) return 'bi-bus-front-fill';
    return 'bi-car-front-fill';
  };

  return (
    <div className="tw-card p-3 d-flex align-items-center justify-content-between mb-2">
      <div className="d-flex align-items-center gap-3">
        <div className="bg-light p-3 rounded-circle text-primary">
          <i className={`bi ${getIcon(mode)} fs-4`}></i>
        </div>
        <div>
          <h6 className="fw-bold mb-0">{mode} ({carrier})</h6>
          <span className="text-muted small">Duration: {duration} • {priceType || 'estimated'}</span>
        </div>
      </div>

      <div className="text-end">
        <div className="fw-bold text-primary">{currency} {estimatedPrice?.toLocaleString()}</div>
        <span className="badge bg-light text-success border">Best Route</span>
      </div>
    </div>
  );
};
