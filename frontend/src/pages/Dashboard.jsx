import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TripContext } from '../context/TripContext';
import { tripService } from '../services/tripService';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setActiveTrip } = useContext(TripContext);

  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await tripService.getUserTrips();
      if (res.success && res.data) {
        setSavedTrips(res.data);
      }
    } catch (err) {
      setError('Could not fetch saved trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTrip = (trip) => {
    setActiveTrip(trip);
    navigate('/trip-details', { state: { trip } });
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      const res = await tripService.deleteTrip(id);
      if (res.success) {
        setSavedTrips((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="tw-card p-4 p-md-5 mb-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #0d1c32 0%, #1e3a66 100%)', color: '#ffffff' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-teal-light text-teal mb-2">Member Dashboard</span>
            <h2 className="fw-extrabold text-white mb-1">Welcome back, {user?.name || 'Traveler'}!</h2>
            <p className="text-light opacity-90 small mb-0">Manage your AI-generated travel plans and saved itineraries.</p>
          </div>
          <button onClick={() => navigate('/create')} className="btn btn-teal-tw btn-lg px-4 fs-6">
            <i className="bi bi-plus-lg me-1"></i> Create New Trip
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* Trips Gallery */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">My Saved Trips ({savedTrips.length})</h4>
        <button onClick={fetchTrips} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-teal" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : savedTrips.length === 0 ? (
        <div className="tw-card p-5 text-center my-3">
          <i className="bi bi-journal-x fs-1 text-muted d-block mb-3"></i>
          <h5>No Saved Trips Yet</h5>
          <p className="text-muted small">You haven't saved any travel itineraries. Generate one now with TripWise AI!</p>
          <button onClick={() => navigate('/create')} className="btn btn-primary-tw mt-2">
            Plan My First Trip
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {savedTrips.map((trip) => (
            <div key={trip._id} className="col-md-6 col-lg-4">
              <div className="tw-card h-100 p-4 d-flex flex-column justify-content-between shadow-sm position-relative">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary">{trip.durationDays} Days</span>
                    <span className="badge bg-light text-dark border">{trip.currency || 'INR'} {trip.budget?.toLocaleString()}</span>
                  </div>

                  <h5 className="fw-bold mb-1">{trip.destination}</h5>
                  <p className="text-muted small mb-2"><i className="bi bi-calendar-event me-1"></i>{trip.startDate} to {trip.endDate}</p>

                  <div className="d-flex flex-wrap gap-1 mb-3">
                    <span className="badge bg-light text-secondary border fw-normal">{trip.travelStyle} Style</span>
                    <span className="badge bg-light text-secondary border fw-normal">{trip.pace} Pace</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
                  <button className="btn btn-sky-tw btn-sm px-3" onClick={() => handleViewTrip(trip)}>
                    <i className="bi bi-eye me-1"></i> View Itinerary
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={(e) => handleDeleteTrip(trip._id, e)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
