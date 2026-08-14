import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  const [quickDestination, setQuickDestination] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickDestination.trim()) {
      navigate('/create', { state: { destination: quickDestination } });
    } else {
      navigate('/create');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container position-relative z-1">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <span className="badge bg-teal-light text-teal border px-3 py-2 rounded-pill fw-semibold mb-3">
                ✨ Next-Gen AI Travel Intelligence
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3">
                Plan Your Perfect Trip with AI
              </h1>
              <p className="lead text-light opacity-90 mx-auto mb-4" style={{ maxWidth: '720px' }}>
                Tell us where you're going, your budget and what you love. We'll build a personalized itinerary using real travel information.
              </p>

              {/* Quick Destination Search Form */}
              <div className="tw-card p-3 shadow-lg bg-white rounded-4 mx-auto mb-4 text-start" style={{ maxWidth: '640px' }}>
                <form onSubmit={handleQuickSearch} className="d-flex flex-column flex-sm-row gap-2">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-0 text-muted">
                      <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none fs-6"
                      placeholder="Where do you want to go? (e.g. Goa, Paris, Tokyo)"
                      value={quickDestination}
                      onChange={(e) => setQuickDestination(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-teal-tw px-4 py-3 text-nowrap d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-stars"></i> Start Planning
                  </button>
                </form>
              </div>

              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button onClick={() => navigate('/create')} className="btn btn-primary-tw btn-lg px-4 py-3">
                  Start Planning
                </button>
                <a href="#features" className="btn btn-outline-light btn-lg px-4 py-3">
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-teal fw-bold text-uppercase small">Simple 4-Step Process</span>
            <h2 className="fw-bold mt-1">How TripWise AI Works</h2>
            <p className="text-muted">Effortlessly transform your trip ideas into realistic, actionable day-by-day itineraries.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="tw-card p-4 h-100 text-center border-0 shadow-sm">
                <div className="bg-light text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-geo-alt fs-3"></i>
                </div>
                <h6 className="fw-bold mb-2">1. Enter Trip Details</h6>
                <p className="text-muted small mb-0">Specify origin, destination, travel dates, and group count.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="tw-card p-4 h-100 text-center border-0 shadow-sm">
                <div className="bg-light text-teal rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', color: 'var(--tw-teal)' }}>
                  <i className="bi bi-sliders fs-3"></i>
                </div>
                <h6 className="fw-bold mb-2">2. Budget & Style</h6>
                <p className="text-muted small mb-0">Set your total budget limit, preferred currency, and travel pace.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="tw-card p-4 h-100 text-center border-0 shadow-sm">
                <div className="bg-light text-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-heart-fill fs-3 text-danger"></i>
                </div>
                <h6 className="fw-bold mb-2">3. Personal Preferences</h6>
                <p className="text-muted small mb-0">Select interests (beaches, food, history), dietary needs, and must-visit spots.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="tw-card p-4 h-100 text-center border-0 shadow-sm">
                <div className="bg-light text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-magic fs-3 text-success"></i>
                </div>
                <h6 className="fw-bold mb-2">4. AI Generation</h6>
                <p className="text-muted small mb-0">Receive a complete day-by-day plan, weather forecast, route map, and budget breakdown.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5" style={{ backgroundColor: 'var(--tw-bg)' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Designed for Smart Travelers</h2>
            <p className="text-muted">Built with robust AI fallback architectures, live data abstractions, and independent budget engines.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="tw-card p-4 h-100">
                <i className="bi bi-cpu-fill fs-2 text-primary mb-3 d-block"></i>
                <h5 className="fw-bold mb-2">Google Gemini 2.5 AI Engine</h5>
                <p className="text-muted small">
                  Powered by Google Gemini 2.5 Flash API for ultra-fast, structured, budget-aware day-by-day travel planning.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tw-card p-4 h-100">
                <i className="bi bi-calculator-fill fs-2 text-teal mb-3 d-block" style={{ color: 'var(--tw-teal)' }}></i>
                <h5 className="fw-bold mb-2">Independent Budget Engine</h5>
                <p className="text-muted small">
                  The backend independently computes stays, meals, transport, and activities to verify if your trip stays within budget.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tw-card p-4 h-100">
                <i className="bi bi-cloud-sun-fill fs-2 text-warning mb-3 d-block"></i>
                <h5 className="fw-bold mb-2">Weather & Route Mapping</h5>
                <p className="text-muted small">
                  Integrates real-time weather forecasts and interactive route map views to ensure sensible activity scheduling.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tw-card p-4 h-100">
                <i className="bi bi-chat-dots-fill fs-2 text-info mb-3 d-block"></i>
                <h5 className="fw-bold mb-2">Ask TripWise AI Editor</h5>
                <p className="text-muted small">
                  Edit your trip naturally. Ask AI to swap dinners, make day 3 relaxed, or add hidden photo spots instantly.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tw-card p-4 h-100">
                <i className="bi bi-currency-exchange fs-2 text-success mb-3 d-block"></i>
                <h5 className="fw-bold mb-2">Multi-Currency & Budget Optimizer</h5>
                <p className="text-muted small">
                  Supports INR, USD, EUR, and GBP with instant cost-trimming recommendations to fix over-budget itineraries.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tw-card p-4 h-100">
                <i className="bi bi-shield-check fs-2 text-danger mb-3 d-block"></i>
                <h5 className="fw-bold mb-2">No Price Hallucinations</h5>
                <p className="text-muted small">
                  Strict live data rule ensures prices are either retrieved from configured API providers or clearly marked as estimated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
