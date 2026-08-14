import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TripContext } from '../context/TripContext';
import { tripService } from '../services/tripService';
import { LoadingState } from '../components/LoadingState';

export const CreateTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftWizard, setDraftWizard, setActiveTrip } = useContext(TripContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill destination if passed from Home search
  useEffect(() => {
    if (location.state?.destination) {
      setDraftWizard((prev) => ({ ...prev, destination: location.state.destination }));
    }
  }, [location.state]);

  const getTodayStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayStr();

  // Reset past dates if loaded in draft
  useEffect(() => {
    if (draftWizard.startDate && draftWizard.startDate < todayStr) {
      setDraftWizard((prev) => ({
        ...prev,
        startDate: todayStr,
        endDate: !prev.endDate || prev.endDate < todayStr ? todayStr : prev.endDate,
      }));
    }
  }, [todayStr]);

  const handleStartDateChange = (val) => {
    setError('');
    setDraftWizard((prev) => {
      let nextEnd = prev.endDate;
      if (!nextEnd || nextEnd < val) {
        nextEnd = val;
      }
      return { ...prev, startDate: val, endDate: nextEnd };
    });
  };

  const handleEndDateChange = (val) => {
    setError('');
    setDraftWizard((prev) => ({ ...prev, endDate: val }));
  };

  const handleNextStep1 = () => {
    setError('');
    if (!draftWizard.origin || !draftWizard.origin.trim()) {
      setError('Please enter a starting location.');
      return;
    }
    if (!draftWizard.destination || !draftWizard.destination.trim()) {
      setError('Please enter a destination.');
      return;
    }
    if (!draftWizard.startDate) {
      setError('Please select a start date.');
      return;
    }
    if (draftWizard.startDate < todayStr) {
      setError('Start date cannot be in the past. Please select today or a future date.');
      return;
    }
    if (!draftWizard.endDate) {
      setError('Please select an end date.');
      return;
    }
    if (draftWizard.endDate < draftWizard.startDate) {
      setError('End date cannot be earlier than the start date.');
      return;
    }
    setStep(2);
  };

  const availableInterests = [
    'Beaches', 'Nature', 'Adventure', 'Trekking', 'Food', 'Shopping',
    'Nightlife', 'Culture', 'History', 'Museums', 'Photography',
    'Religious Places', 'Family Activities', 'Local Experiences', 'Wellness', 'Entertainment'
  ];

  const handleInputChange = (field, value) => {
    setDraftWizard((prev) => ({ ...prev, [field]: value }));
  };

  const handleTravelerChange = (type, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setDraftWizard((prev) => ({
      ...prev,
      travelers: { ...prev.travelers, [type]: val },
    }));
  };

  const toggleInterest = (interest) => {
    const current = draftWizard.interests || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    setDraftWizard((prev) => ({ ...prev, interests: updated }));
  };

  const toggleAccessibility = (req) => {
    const current = draftWizard.accessibilityRequirements || [];
    const updated = current.includes(req)
      ? current.filter((r) => r !== req)
      : [...current, req];
    setDraftWizard((prev) => ({ ...prev, accessibilityRequirements: updated }));
  };

  // Calculate duration automatically
  const start = new Date(draftWizard.startDate);
  const end = new Date(draftWizard.endDate);
  const diffDays = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);
  const diffNights = Math.max(0, diffDays - 1);

  // Budget warning check
  const perDayBudget = draftWizard.budget / diffDays;
  const isBudgetLow = perDayBudget < (draftWizard.currency === 'INR' ? 2000 : 30);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...draftWizard,
        durationDays: diffDays,
        durationNights: diffNights,
        mustVisit: typeof draftWizard.mustVisit === 'string'
          ? draftWizard.mustVisit.split(',').map((s) => s.trim()).filter(Boolean)
          : draftWizard.mustVisit,
      };

      const res = await tripService.generateTrip(payload);
      if (res.success && res.data) {
        setActiveTrip(res.data);
        navigate('/trip-details', { state: { trip: res.data } });
      } else {
        setError(res.message || 'Failed to generate itinerary. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating AI itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState destination={draftWizard.destination} />;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header & Step Indicator */}
          <div className="text-center mb-4">
            <h2 className="fw-bold">Build Your AI Trip Itinerary</h2>
            <p className="text-muted small">Step {step} of 4 — {step === 1 ? 'Trip Logistics' : step === 2 ? 'Budget & Style' : step === 3 ? 'Preferences' : 'Personalization'}</p>

            <div className="wizard-progress-bar mx-auto" style={{ maxWidth: '400px' }}>
              <div className="wizard-progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="tw-card p-4 p-md-5 shadow-sm">
            {/* STEP 1: LOGISTICS */}
            {step === 1 && (
              <div>
                <h4 className="fw-bold mb-4">Step 1: Where & When Are You Traveling?</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Starting Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Hyderabad, India"
                      value={draftWizard.origin}
                      onChange={(e) => handleInputChange('origin', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Destination</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Goa, India"
                      value={draftWizard.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      min={todayStr}
                      value={draftWizard.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      min={draftWizard.startDate || todayStr}
                      value={draftWizard.endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center border">
                      <span className="small text-muted fw-semibold">Auto-Calculated Duration:</span>
                      <span className="badge bg-primary fs-6">{diffDays} Days / {diffNights} Nights</span>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Adults (12+ yrs)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={draftWizard.travelers.adults}
                      onChange={(e) => handleTravelerChange('adults', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Children (2-11 yrs)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={draftWizard.travelers.children}
                      onChange={(e) => handleTravelerChange('children', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Infants (Under 2 yrs)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={draftWizard.travelers.infants}
                      onChange={(e) => handleTravelerChange('infants', e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-primary-tw" onClick={handleNextStep1}>
                    Next: Budget & Style <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: BUDGET & STYLE */}
            {step === 2 && (
              <div>
                <h4 className="fw-bold mb-4">Step 2: Budget & Travel Style</h4>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label fw-semibold small">Total Trip Budget</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        style={{ maxWidth: '100px' }}
                        value={draftWizard.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="30000"
                        value={draftWizard.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                      />
                    </div>
                  </div>

                  {isBudgetLow && (
                    <div className="col-12">
                      <div className="alert alert-warning small d-flex align-items-center gap-2 mb-0 py-2">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        Your current budget ({draftWizard.currency} {draftWizard.budget}) may be tight for a {diffDays}-day trip. Our AI will optimize cost options.
                      </div>
                    </div>
                  )}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Travel Style</label>
                    <select
                      className="form-select"
                      value={draftWizard.travelStyle}
                      onChange={(e) => handleInputChange('travelStyle', e.target.value)}
                    >
                      <option value="Budget">Backpacker / Budget</option>
                      <option value="Standard">Standard / Balanced</option>
                      <option value="Premium">Premium Boutique</option>
                      <option value="Luxury">5-Star Luxury</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Trip Pace</label>
                    <select
                      className="form-select"
                      value={draftWizard.pace}
                      onChange={(e) => handleInputChange('pace', e.target.value)}
                    >
                      <option value="Relaxed">Relaxed (2-3 spots/day, leisurely)</option>
                      <option value="Balanced">Balanced (3-4 spots/day, optimal)</option>
                      <option value="Packed">Packed (5+ spots/day, fast-paced)</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-light" onClick={() => setStep(1)}>
                    <i className="bi bi-arrow-left me-1"></i> Back
                  </button>
                  <button className="btn btn-primary-tw" onClick={() => setStep(3)}>
                    Next: Preferences <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PREFERENCES */}
            {step === 3 && (
              <div>
                <h4 className="fw-bold mb-3">Step 3: What Do You Love to Experience?</h4>
                <p className="text-muted small mb-3">Select one or more interests to tailor attraction highlights:</p>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {availableInterests.map((interest) => {
                    const isSelected = draftWizard.interests?.includes(interest);
                    return (
                      <span
                        key={interest}
                        className={`interest-badge-toggle ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </span>
                    );
                  })}
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Food Preference</label>
                    <select
                      className="form-select"
                      value={draftWizard.foodPreference}
                      onChange={(e) => handleInputChange('foodPreference', e.target.value)}
                    >
                      <option value="No Preference">No Preference</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Jain">Jain</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Accommodation Type</label>
                    <select
                      className="form-select"
                      value={draftWizard.accommodationPreference}
                      onChange={(e) => handleInputChange('accommodationPreference', e.target.value)}
                    >
                      <option value="No Preference">No Preference</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Resort">Resort</option>
                      <option value="Homestay">Homestay</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Transport Preference</label>
                    <select
                      className="form-select"
                      value={draftWizard.transportationPreference}
                      onChange={(e) => handleInputChange('transportationPreference', e.target.value)}
                    >
                      <option value="No Preference">No Preference</option>
                      <option value="Flight">Flight</option>
                      <option value="Train">Train</option>
                      <option value="Cab">Cab / Taxi</option>
                      <option value="Public Transport">Public Transport</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-light" onClick={() => setStep(2)}>
                    <i className="bi bi-arrow-left me-1"></i> Back
                  </button>
                  <button className="btn btn-primary-tw" onClick={() => setStep(4)}>
                    Next: Personalization <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PERSONALIZATION */}
            {step === 4 && (
              <div>
                <h4 className="fw-bold mb-4">Step 4: Optional Personalization</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Must-Visit Spots</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Fort Aguada, Baga Beach"
                      value={typeof draftWizard.mustVisit === 'string' ? draftWizard.mustVisit : draftWizard.mustVisit.join(', ')}
                      onChange={(e) => handleInputChange('mustVisit', e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Special Occasion</label>
                    <select
                      className="form-select"
                      value={draftWizard.specialOccasion}
                      onChange={(e) => handleInputChange('specialOccasion', e.target.value)}
                    >
                      <option value="Normal Trip">Normal Trip</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Family Vacation">Family Vacation</option>
                      <option value="Solo Trip">Solo Trip</option>
                      <option value="Friends Trip">Friends Trip</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Accessibility & Special Needs</label>
                    <div className="d-flex flex-wrap gap-2">
                      {['Avoid excessive walking', 'Elderly travelers', 'Wheelchair accessibility', 'Child friendly'].map((req) => (
                        <button
                          key={req}
                          type="button"
                          className={`btn btn-sm ${draftWizard.accessibilityRequirements?.includes(req) ? 'btn-primary-tw' : 'btn-outline-secondary'}`}
                          onClick={() => toggleAccessibility(req)}
                        >
                          {req}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Additional Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Prefer less crowded spots, local food, and scenic sunset views."
                      value={draftWizard.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-light" onClick={() => setStep(3)}>
                    <i className="bi bi-arrow-left me-1"></i> Back
                  </button>
                  <button className="btn btn-teal-tw btn-lg px-4" onClick={handleSubmit}>
                    <i className="bi bi-magic me-2"></i> Generate AI Itinerary
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
