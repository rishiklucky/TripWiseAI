import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-compass-fill text-teal" style={{ color: '#14b8a6' }}></i>
              TripWise AI
            </h5>
            <p className="text-secondary small mb-3">
              AI-powered travel intelligence platform that plans realistic, budget-optimized, and customized travel itineraries.
            </p>
            <p className="small text-secondary mb-0">© 2026 TripWise AI Inc. All rights reserved.</p>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="fw-semibold mb-3">Product</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/create" className="text-secondary text-decoration-none">AI Trip Planner</Link></li>
              <li><Link to="/" className="text-secondary text-decoration-none">Budget Optimizer</Link></li>
              <li><Link to="/" className="text-secondary text-decoration-none">Live Travel Estimates</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="fw-semibold mb-3">Account</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/login" className="text-secondary text-decoration-none">Login</Link></li>
              <li><Link to="/register" className="text-secondary text-decoration-none">Sign Up</Link></li>
              <li><Link to="/dashboard" className="text-secondary text-decoration-none">My Dashboard</Link></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h6 className="fw-semibold mb-3">Travel Tech Architecture</h6>
            <span className="badge bg-secondary me-2 mb-2">Gemini AI</span>
            <span className="badge bg-secondary me-2 mb-2">OpenRouter Fallback</span>
            <span className="badge bg-secondary me-2 mb-2">Groq Acceleration</span>
            <span className="badge bg-secondary me-2 mb-2">MongoDB Atlas</span>
            <span className="badge bg-secondary me-2 mb-2">REST API Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
