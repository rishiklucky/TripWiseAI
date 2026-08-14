import React from 'react';

export const ItineraryPDFModal = ({ isOpen, onClose, trip }) => {
  if (!isOpen || !trip) return null;

  const {
    destination,
    origin,
    startDate,
    endDate,
    durationDays,
    durationNights,
    travelers = {},
    budget,
    currency = 'INR',
    travelStyle = 'Standard',
    pace = 'Balanced',
    itinerary = [],
    budgetBreakdown = {},
    recommendations = [],
    generatedBy = 'Gemini',
  } = trip;

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="modal fade show d-block no-print-modal-wrap"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Modal Header Controls (Hidden during print) */}
          <div
            className="modal-header text-white no-print py-3 px-4 d-flex justify-content-between align-items-center w-100"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <span
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  overflow: 'hidden',
                }}
              >
                <img src="/tripwise_ai_logo.png" alt="TripWise AI" style={{ height: '26px', width: '26px', objectFit: 'contain' }} />
              </span>
              <div>
                <h5 className="modal-title fw-bold mb-0 text-white" style={{ fontSize: '1.1rem' }}>Travel PDF Preview & Print</h5>
                <span className="small text-light opacity-75" style={{ fontSize: '0.82rem' }}>Publication-Grade Document • Designed by TripWise AI</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 ms-auto">
              <button
                className="btn text-white btn-sm px-3 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
                onClick={handlePrint}
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  fontSize: '0.88rem',
                }}
              >
                <i className="bi bi-printer-fill"></i> Print / Save as PDF
              </button>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
            </div>
          </div>

          {/* Modal Body: PDF Live Preview & Printable Container */}
          <div className="modal-body p-3 p-md-4" style={{ backgroundColor: '#f1f5f9' }}>
            <div
              className="pdf-document-container bg-white p-4 p-md-5 mx-auto shadow-sm"
              style={{
                maxWidth: '850px',
                color: '#1e293b',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
              }}
            >
              {/* Document Banner / Header Card */}
              <div
                className="p-4 mb-4 position-relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a66 100%)',
                  borderRadius: '16px',
                  color: '#ffffff',
                  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.15)',
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span
                        className="badge fw-semibold text-white px-3 py-1.5 d-inline-flex align-items-center gap-2"
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <img
                          src="/tripwise_ai_logo.png"
                          alt="TripWise AI Logo"
                          style={{ height: '20px', width: '20px', objectFit: 'contain' }}
                        />
                        TripWise AI Official Itinerary
                      </span>
                      <span
                        className="badge bg-light text-dark fw-semibold px-2.5 py-1"
                        style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                      >
                        {travelStyle} Style
                      </span>
                    </div>
                    <h2 className="fw-extrabold text-white mb-2" style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
                      {durationDays}-Day Trip to {destination}
                    </h2>
                    <p className="text-light opacity-90 small mb-0">
                      <i className="bi bi-geo-alt me-1 text-info"></i>From {origin} • {startDate} to {endDate} ({durationNights} Nights)
                    </p>
                  </div>

                  <div className="text-end d-none d-sm-block">
                    <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-3 py-2 fw-semibold d-block mb-1">
                      AI Verified
                    </span>
                    <span className="text-light opacity-75 extra-small d-block" style={{ fontSize: '0.75rem' }}>
                      Issued: {currentDateStr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Trip Facts Bar */}
              <div
                className="row g-2 mb-4 p-3 rounded-3 text-center align-items-center"
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                }}
              >
                <div className="col-3">
                  <span className="text-muted small d-block fw-medium">Travelers</span>
                  <strong className="text-dark small fw-bold">{travelers.adults || 1} Adult(s)</strong>
                </div>
                <div className="col-3 border-start">
                  <span className="text-muted small d-block fw-medium">Pace</span>
                  <strong className="text-dark small fw-bold">{pace}</strong>
                </div>
                <div className="col-3 border-start">
                  <span className="text-muted small d-block fw-medium">Target Budget</span>
                  <strong className="text-dark small fw-bold">{currency} {Number(budget).toLocaleString()}</strong>
                </div>
                <div className="col-3 border-start">
                  <span className="text-muted small d-block fw-medium">Est. Total Cost</span>
                  <strong className="text-success small fw-extrabold">{currency} {Number(budgetBreakdown.totalEstimated || budget).toLocaleString()}</strong>
                </div>
              </div>

              {/* Financial Budget Breakdown Table */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-pie-chart-fill text-primary"></i>
                  <h6 className="fw-bold mb-0 text-uppercase text-dark small" style={{ letterSpacing: '0.04em' }}>
                    Estimated Cost Allocation
                  </h6>
                </div>
                <div className="table-responsive rounded-3 border overflow-hidden">
                  <table className="table table-bordered table-sm text-center small mb-0">
                    <thead>
                      <tr>
                        <th className="py-2.5 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a66 100%)', color: '#ffffff' }}>Category</th>
                        <th className="py-2.5 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a66 100%)', color: '#ffffff' }}>Stay</th>
                        <th className="py-2.5 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a66 100%)', color: '#ffffff' }}>Food</th>
                        <th className="py-2.5 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a66 100%)', color: '#ffffff' }}>Transport</th>
                        <th className="py-2.5 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a66 100%)', color: '#ffffff' }}>Activities</th>
                        <th className="py-2.5 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a66 100%)', color: '#ffffff' }}>Total Estimated</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="align-middle" style={{ backgroundColor: '#ffffff' }}>
                        <td className="fw-bold text-dark bg-light py-2.5" style={{ color: '#0f172a' }}>Cost ({currency})</td>
                        <td className="py-2.5 fw-semibold text-dark" style={{ color: '#0f172a' }}>{Number(budgetBreakdown.accommodation || 0).toLocaleString()}</td>
                        <td className="py-2.5 fw-semibold text-dark" style={{ color: '#0f172a' }}>{Number(budgetBreakdown.food || 0).toLocaleString()}</td>
                        <td className="py-2.5 fw-semibold text-dark" style={{ color: '#0f172a' }}>{Number(budgetBreakdown.transportation || 0).toLocaleString()}</td>
                        <td className="py-2.5 fw-semibold text-dark" style={{ color: '#0f172a' }}>{Number(budgetBreakdown.activities || 0).toLocaleString()}</td>
                        <td className="py-2.5 fw-extrabold text-success fs-6 bg-light">
                          {Number(budgetBreakdown.totalEstimated || budget).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Day by Day Detailed Schedule */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                    <i className="bi bi-calendar3 text-primary"></i>Day-by-Day Detailed Itinerary
                  </h5>
                  <span className="badge bg-light text-muted border small fw-medium">
                    {itinerary.length} Days Planned
                  </span>
                </div>

                {itinerary.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className="pdf-day-block border rounded-3 p-3 mb-3 bg-white shadow-2xs"
                    style={{ borderRadius: '14px', borderColor: '#e2e8f0' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="badge text-white px-2.5 py-1 fw-bold"
                          style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                          }}
                        >
                          Day {day.dayNumber}
                        </span>
                        <strong className="text-dark fs-6 fw-bold">{day.title}</strong>
                        {day.date && <span className="text-muted small ms-1">({day.date})</span>}
                      </div>
                      {day.weather && (
                        <span
                          className="badge bg-light text-dark border px-2.5 py-1"
                          style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                        >
                          <i className="bi bi-brightness-high-fill text-warning me-1"></i>
                          {day.weather.tempC}°C • {day.weather.condition}
                        </span>
                      )}
                    </div>

                    {day.summary && <p className="small text-secondary mb-3 fst-italic">{day.summary}</p>}

                    {/* Schedule Table */}
                    <div className="table-responsive rounded border">
                      <table className="table table-sm table-hover align-middle small mb-0">
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                          <tr className="extra-small" style={{ fontSize: '0.78rem' }}>
                            <th style={{ width: '15%', backgroundColor: '#f8fafc', color: '#1e293b' }} className="ps-3 py-2 fw-bold">Time</th>
                            <th style={{ width: '38%', backgroundColor: '#f8fafc', color: '#1e293b' }} className="py-2 fw-bold">Activity / Spot</th>
                            <th style={{ width: '17%', backgroundColor: '#f8fafc', color: '#1e293b' }} className="py-2 fw-bold">Category</th>
                            <th style={{ width: '15%', backgroundColor: '#f8fafc', color: '#1e293b' }} className="py-2 fw-bold">Duration</th>
                            <th style={{ width: '15%', backgroundColor: '#f8fafc', color: '#1e293b' }} className="pe-3 py-2 text-end fw-bold">Est. Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(day.activities || []).map((act, aIdx) => (
                            <tr key={aIdx}>
                              <td className="ps-3 fw-bold text-primary" style={{ fontSize: '0.82rem' }}>{act.time}</td>
                              <td>
                                <div className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>{act.title}</div>
                                {act.description && (
                                  <div className="text-muted extra-small" style={{ fontSize: '0.76rem', lineHeight: '1.3' }}>
                                    {act.description}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className="badge bg-secondary-subtle text-secondary-emphasis border px-2 py-1" style={{ fontSize: '0.72rem' }}>
                                  {act.category || 'Sightseeing'}
                                </span>
                              </td>
                              <td className="text-muted" style={{ fontSize: '0.8rem' }}>
                                {act.durationMinutes ? `${act.durationMinutes} mins` : '—'}
                              </td>
                              <td className="pe-3 text-end fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                                {act.estimatedCost ? `${currency} ${act.estimatedCost}` : 'Free'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Recommendations Tips Callout */}
              {recommendations.length > 0 && (
                <div
                  className="p-3 mb-4 pdf-day-block"
                  style={{
                    background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                    border: '1px solid #fef08a',
                    borderRadius: '14px',
                  }}
                >
                  <h6 className="fw-bold mb-2 small text-dark d-flex align-items-center gap-1">
                    <i className="bi bi-lightbulb-fill text-warning me-1 fs-6"></i> Essential AI Travel Tips
                  </h6>
                  <ul className="small text-dark opacity-90 mb-0 ps-3">
                    {recommendations.map((tip, idx) => (
                      <li key={idx} className="mb-1" style={{ fontSize: '0.83rem' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Document Footer */}
              <div className="border-top pt-3 text-center text-muted extra-small" style={{ fontSize: '0.75rem' }}>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                  <i className="bi bi-shield-check text-success"></i>
                  <span>Verified & Generated by <strong>TripWise AI Engine</strong></span>
                  <span>•</span>
                  <span>www.tripwise.ai</span>
                </div>
                <p className="mb-0 text-muted opacity-75">Personal & Confidential Travel Document • All rights reserved</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
