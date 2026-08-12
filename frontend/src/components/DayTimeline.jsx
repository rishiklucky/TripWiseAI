import React from 'react';
import { ActivityCard } from './ActivityCard';
import { WeatherCard } from './WeatherCard';

export const DayTimeline = ({ day = {}, currency = 'INR' }) => {
  const { dayNumber, date, title, summary, weather, activities = [], meals = {}, transportation = [] } = day;

  return (
    <div className="tw-card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="badge bg-primary px-3 py-2 me-2">Day {dayNumber}</span>
          <span className="text-muted small">{date}</span>
          <h5 className="fw-bold mt-2 mb-0">{title}</h5>
        </div>
        {weather && <WeatherCard weather={weather} />}
      </div>

      {summary && <p className="text-secondary small mb-4">{summary}</p>}

      <div className="ms-2">
        <h6 className="fw-semibold mb-3 text-uppercase text-muted small">Daily Schedule & Activities</h6>

        {activities.map((act, idx) => (
          <div key={idx} className="timeline-item">
            <div className="timeline-dot"></div>
            <ActivityCard activity={act} currency={currency} />
          </div>
        ))}
      </div>

      {/* Meals & Transportation */}
      <div className="row g-3 mt-2 pt-3 border-top">
        <div className="col-md-6">
          <h6 className="fw-semibold text-muted small mb-2"><i className="bi bi-cup-straw me-1"></i> Recommended Meals</h6>
          <div className="bg-light p-2 rounded small">
            {meals.breakfast && <div><strong>Breakfast:</strong> {meals.breakfast.title} ({currency} {meals.breakfast.estimatedCost})</div>}
            {meals.lunch && <div><strong>Lunch:</strong> {meals.lunch.title} ({currency} {meals.lunch.estimatedCost})</div>}
            {meals.dinner && <div><strong>Dinner:</strong> {meals.dinner.title} ({currency} {meals.dinner.estimatedCost})</div>}
          </div>
        </div>
        <div className="col-md-6">
          <h6 className="fw-semibold text-muted small mb-2"><i className="bi bi-bus-front me-1"></i> Daily Transport</h6>
          <div className="bg-light p-2 rounded small">
            {transportation.length > 0 ? (
              transportation.map((t, i) => (
                <div key={i}>
                  <strong>{t.type}:</strong> {t.from} → {t.to} ({currency} {t.estimatedCost})
                </div>
              ))
            ) : (
              <span className="text-muted">Local walking & rideshares.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
