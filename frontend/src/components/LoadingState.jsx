import React, { useState, useEffect } from 'react';

export const LoadingState = ({ destination = 'your destination' }) => {
  const stages = [
    { title: 'Understanding your travel preferences', duration: 1500 },
    { title: `Fetching weather & real-time travel data for ${destination}`, duration: 2000 },
    { title: 'Curating top hotels & transportation options', duration: 2000 },
    { title: 'Building geographical route & day-by-day activities', duration: 2500 },
    { title: 'Calculating budget engine breakdown & savings', duration: 1800 },
    { title: 'Finalizing your TripWise AI Itinerary...', duration: 1500 },
  ];

  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container py-5 my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="tw-card p-5 shadow-lg border-0 text-center position-relative">
            <div className="spinner-border text-teal mb-4" style={{ width: '3.5rem', height: '3.5rem', color: 'var(--tw-teal)' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            
            <h4 className="fw-bold mb-2">Planning your perfect trip to {destination}...</h4>
            <p className="text-muted small mb-4">Our AI travel engine is analyzing routes, budget limits, and curated experiences.</p>

            <div className="text-start bg-light p-4 rounded-3 mb-3 border">
              {stages.map((stage, idx) => {
                let statusClass = 'pending';
                let icon = 'bi-circle';
                if (idx < currentStage) {
                  statusClass = 'completed';
                  icon = 'bi-check-circle-fill';
                } else if (idx === currentStage) {
                  statusClass = 'active';
                  icon = 'bi-arrow-right-circle-fill text-teal';
                }

                return (
                  <div key={idx} className={`stage-step ${statusClass}`}>
                    <i className={`bi ${icon}`}></i>
                    <span>{stage.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
