import React from 'react';

export const ActivityCard = ({ activity = {}, currency = 'INR' }) => {
  const { time, title, location, durationMinutes, estimatedCost, priceType, description, category } = activity;

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span className="badge bg-light text-primary border me-2">
              <i className="bi bi-clock me-1"></i>{time || 'Flex Time'}
            </span>
            {category && (
              <span className="badge badge-tw-sky">
                {category}
              </span>
            )}
          </div>
          <span className="badge bg-light text-dark border">
            {estimatedCost === 0 ? 'Free' : `${currency} ${estimatedCost}`}
            <small className="text-muted ms-1">({priceType || 'estimated'})</small>
          </span>
        </div>

        <h6 className="fw-bold mb-1">{title}</h6>
        <p className="text-muted small mb-2">{description}</p>

        <div className="d-flex align-items-center gap-3 small text-secondary">
          {location && (
            <span><i className="bi bi-geo-alt-fill text-danger me-1"></i>{location}</span>
          )}
          {durationMinutes && (
            <span><i className="bi bi-hourglass-split text-warning me-1"></i>{durationMinutes} mins</span>
          )}
        </div>
      </div>
    </div>
  );
};
