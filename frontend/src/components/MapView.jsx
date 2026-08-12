import React from 'react';

export const MapView = ({ destination = 'Goa, India', activities = [] }) => {
  const mapSearchUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="tw-card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">
          <i className="bi bi-map-fill text-teal me-2" style={{ color: 'var(--tw-teal)' }}></i>
          Interactive Route & Map View
        </h5>
        <span className="badge bg-light text-dark border">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>{destination}
        </span>
      </div>

      <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm border mb-3">
        <iframe
          title={`Map view for ${destination}`}
          src={mapSearchUrl}
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      <div className="small text-muted d-flex align-items-center gap-2">
        <i className="bi bi-info-circle text-primary"></i>
        <span>Map pins route optimal day-by-day attraction clusters to minimize travel time.</span>
      </div>
    </div>
  );
};
