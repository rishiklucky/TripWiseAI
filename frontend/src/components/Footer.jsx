import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-4 mt-5" style={{ backgroundColor: '#181e24', color: '#94a3b8' }}>
      <div className="container text-center text-md-start">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <img src="/tripwise_ai_logo.png" alt="TripWise AI" style={{ height: '28px', width: 'auto' }} />
            <span className="fw-bold fs-5 text-white">
              TripWise<span style={{ color: '#00cbb4' }}>.AI</span>
            </span>
          </div>

          <p className="small mb-0" style={{ color: '#64748b' }}>
            © 2026 TripWise AI Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
