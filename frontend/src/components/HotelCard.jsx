import React from 'react';

export const HotelCard = ({ hotel = {}, currency = 'INR' }) => {
  const { name, rating, location, pricePerNight, amenities = [], distanceFromCenter, priceType, imageUrl } = hotel;

  return (
    <div className="card h-100 border-0 shadow-sm">
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={name}
          style={{ height: '160px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="badge bg-warning text-dark"><i className="bi bi-star-fill me-1"></i>{rating || 4.5}</span>
            <span className="badge bg-light text-muted border">{priceType || 'estimated price'}</span>
          </div>
          <h6 className="fw-bold mb-1 text-truncate">{name}</h6>
          <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{location}</p>
          {distanceFromCenter && <p className="text-secondary small mb-2">{distanceFromCenter}</p>}

          <div className="d-flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '0.7rem' }}>
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
          <div>
            <span className="fw-bold text-primary fs-6">{currency} {pricePerNight?.toLocaleString()}</span>
            <span className="text-muted small"> / night</span>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={() => alert(`View details for ${name}`)}>
            View Hotel
          </button>
        </div>
      </div>
    </div>
  );
};
