import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TripContext } from '../context/TripContext';
import { AuthContext } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { BudgetCard } from '../components/BudgetCard';
import { DayTimeline } from '../components/DayTimeline';
import { MapView } from '../components/MapView';
import { HotelCard } from '../components/HotelCard';
import { TransportCard } from '../components/TransportCard';
import { AskTripWiseModal } from '../components/AskTripWiseModal';
import { ItineraryPDFModal } from '../components/ItineraryPDFModal';

export const TripDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTrip, setActiveTrip } = useContext(TripContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [trip, setTrip] = useState(location.state?.trip || activeTrip);
  const [loadingAction, setLoadingAction] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.trip) {
      setTrip(location.state.trip);
      setActiveTrip(location.state.trip);
    }
  }, [location.state]);

  if (!trip) {
    return (
      <div className="container py-5 text-center">
        <div className="tw-card p-5 my-5">
          <i className="bi bi-compass fs-1 text-muted d-block mb-3"></i>
          <h4>No Active Trip Selected</h4>
          <p className="text-muted">Generate a new trip or view saved itineraries from your dashboard.</p>
          <button onClick={() => navigate('/create')} className="btn btn-primary-tw mt-2">
            Plan a New Trip
          </button>
        </div>
      </div>
    );
  }

  const {
    _id,
    destination,
    origin,
    startDate,
    endDate,
    durationDays,
    durationNights,
    travelers = {},
    budget,
    currency = 'INR',
    travelStyle,
    itinerary = [],
    budgetBreakdown = {},
    hotels = [],
    transportOptions = [],
    generatedBy,
    recommendations = [],
    warnings = [],
  } = trip;

  const handleOptimizeBudget = async () => {
    setLoadingAction('optimizing');
    try {
      const res = await tripService.optimizeTrip(trip, budget);
      if (res.success && res.data) {
        const historySnapshot = {
          itinerary: trip.itinerary,
          budgetBreakdown: trip.budgetBreakdown,
          label: 'Before Budget Optimization',
        };
        const updatedTrip = {
          ...res.data,
          history: [...(trip.history || []), historySnapshot],
        };
        setTrip(updatedTrip);
        setActiveTrip(updatedTrip);
      }
    } catch (err) {
      alert('Optimization failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction('');
    }
  };

  const handleConversationalEdit = async (instruction) => {
    setLoadingAction('editing');
    try {
      const res = await tripService.editTripAI(trip, instruction);
      if (res.success && res.data) {
        const historySnapshot = {
          itinerary: trip.itinerary,
          budgetBreakdown: trip.budgetBreakdown,
          label: `Before: "${instruction}"`,
        };
        const updatedTrip = {
          ...res.data,
          history: [...(trip.history || []), historySnapshot],
        };
        setTrip(updatedTrip);
        setActiveTrip(updatedTrip);
        setIsAskModalOpen(false);
      }
    } catch (err) {
      alert('Edit failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction('');
    }
  };

  const handleRevertVersion = () => {
    const currentHistory = trip.history || [];
    if (currentHistory.length === 0) return;

    const previousSnapshot = currentHistory[currentHistory.length - 1];
    const remainingHistory = currentHistory.slice(0, -1);

    const revertedTrip = {
      ...trip,
      itinerary: previousSnapshot.itinerary,
      budgetBreakdown: previousSnapshot.budgetBreakdown,
      history: remainingHistory,
    };

    setTrip(revertedTrip);
    setActiveTrip(revertedTrip);
  };

  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      alert('Please log in or create an account to save your trip.');
      navigate('/login');
      return;
    }

    setLoadingAction('saving');
    try {
      const res = await tripService.saveTrip(trip);
      if (res.success && res.data) {
        setTrip(res.data);
        setActiveTrip(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="tw-card p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1c32 0%, #1e3a66 100%)', color: '#ffffff' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-teal-light text-teal fw-semibold">
                <i className="bi bi-stars me-1"></i>AI Generated ({generatedBy || 'Gemini'})
              </span>
              <span className="badge bg-light text-dark fw-semibold">{travelStyle} Style</span>
            </div>
            <h1 className="fw-extrabold text-white mb-2">{durationDays}-Day Trip to {destination}</h1>
            <p className="text-light opacity-90 small mb-0">
              <i className="bi bi-geo-alt me-1"></i>From {origin} • {startDate} to {endDate} ({durationNights} Nights) • {travelers.adults || 1} Adult(s)
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {trip.history && trip.history.length > 0 && (
              <button
                className="btn btn-warning btn-sm px-3 fw-bold"
                onClick={handleRevertVersion}
                title="Revert to previous version before AI edit"
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Revert to Prev Version ({trip.history.length})
              </button>
            )}

            <button
              className="btn btn-teal-tw btn-sm px-3"
              onClick={handleOptimizeBudget}
              disabled={Boolean(loadingAction)}
            >
              {loadingAction === 'optimizing' ? 'Optimizing...' : '✨ Optimize Budget'}
            </button>

            <button
              className="btn btn-sky-tw btn-sm px-3"
              onClick={() => setIsAskModalOpen(true)}
              disabled={Boolean(loadingAction)}
            >
              <i className="bi bi-chat-dots me-1"></i> Ask TripWise
            </button>

            <button
              className="btn btn-light btn-sm px-3"
              onClick={handleSaveTrip}
              disabled={Boolean(loadingAction)}
            >
              <i className="bi bi-bookmark-fill me-1"></i> {saveSuccess ? 'Saved!' : 'Save Trip'}
            </button>

            <button className="btn btn-outline-light btn-sm px-3" onClick={() => setIsPDFModalOpen(true)}>
              <i className="bi bi-file-earmark-pdf me-1"></i> Custom PDF / Print
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>Trip saved successfully to your dashboard!
          <button type="button" className="btn-close" onClick={() => setSaveSuccess(false)}></button>
        </div>
      )}

      {/* Warnings / Notifications */}
      {warnings.length > 0 && (
        <div className="alert alert-warning mb-4">
          <h6 className="fw-bold mb-1"><i className="bi bi-exclamation-triangle me-1"></i> Trip Alerts</h6>
          <ul className="mb-0 small ps-3">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="row g-4">
        {/* Left Column: Itinerary Days */}
        <div className="col-lg-8">
          <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
            <span>Day-by-Day Itinerary ({itinerary.length} Days)</span>
            <span className="text-muted small">Generated by TripWise Engine</span>
          </h5>

          {itinerary.map((day, idx) => (
            <DayTimeline key={idx} day={day} currency={currency} />
          ))}
        </div>

        {/* Right Column: Budget Breakdown, Map, Hotels & Transport */}
        <div className="col-lg-4">
          {/* Budget Overview Card */}
          <BudgetCard
            budgetBreakdown={budgetBreakdown}
            currency={currency}
            onOptimize={handleOptimizeBudget}
          />

          {/* Interactive Map Component */}
          <MapView destination={destination} />

          {/* Hotel Recommendations */}
          {hotels.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Recommended Stays</h5>
              <div className="row g-3">
                {hotels.map((hotel, idx) => (
                  <div key={idx} className="col-12">
                    <HotelCard hotel={hotel} currency={currency} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transport Options */}
          {transportOptions.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Transportation Options</h5>
              {transportOptions.map((opt, idx) => (
                <TransportCard key={idx} option={opt} currency={currency} />
              ))}
            </div>
          )}

          {/* Recommendations Tips */}
          {recommendations.length > 0 && (
            <div className="tw-card p-4">
              <h6 className="fw-bold mb-2"><i className="bi bi-lightbulb text-warning me-1"></i> AI Travel Tips</h6>
              <ul className="small text-muted mb-0 ps-3">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="mb-1">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Conversational AI Editor Modal */}
      <AskTripWiseModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onApplyInstruction={handleConversationalEdit}
        loading={loadingAction === 'editing'}
      />

      {/* Customized PDF Document & Print Preview Modal */}
      <ItineraryPDFModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        trip={trip}
      />
    </div>
  );
};
