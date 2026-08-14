import React from 'react';
import { ActivityCard } from './ActivityCard';
import { WeatherCard } from './WeatherCard';

export const DayTimeline = ({ day = {}, currency = 'INR' }) => {
  const { dayNumber, date, title, summary, weather, activities = [] } = day;

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
    </div>
  );
};
