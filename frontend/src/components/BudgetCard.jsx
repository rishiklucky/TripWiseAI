import React from 'react';

export const BudgetCard = ({ budgetBreakdown = {}, currency = 'INR', onOptimize }) => {
  const {
    transportation = 0,
    accommodation = 0,
    food = 0,
    activities = 0,
    miscellaneous = 0,
    totalEstimated = 0,
    targetBudget = 0,
    difference = 0,
    status = 'WITHIN_BUDGET',
    savingsFromOptimization = 0,
  } = budgetBreakdown;

  const isOver = status === 'OVER_BUDGET';
  const percentage = targetBudget > 0 ? Math.min(100, Math.round((totalEstimated / targetBudget) * 100)) : 0;

  return (
    <div className="tw-card p-3 p-sm-4 mb-4 shadow-sm position-relative overflow-hidden" style={{ borderRadius: '16px', border: '1px solid #e5e7eb', background: '#ffffff' }}>
      {/* Top Header Row */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 className="fw-bold mb-2 text-dark" style={{ color: '#0f172a', fontSize: '1.35rem' }}>Budget Overview</h4>
          <span
            className="badge fw-bold text-uppercase px-3 py-2 text-wrap text-start"
            style={{
              backgroundColor: isOver ? '#dc2626' : '#059669',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.75rem',
              letterSpacing: '0.03em',
              lineHeight: '1.4',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              display: 'inline-block',
              maxWidth: '100%',
            }}
          >
            {isOver
              ? `OVER BUDGET BY ${currency} ${difference.toLocaleString()}`
              : `WITHIN BUDGET (REMAINING: ${currency} ${difference.toLocaleString()})`}
          </span>
        </div>

        {onOptimize && (
          <button
            className="btn d-flex align-items-center justify-content-center gap-2 fw-bold text-white shadow-sm flex-shrink-0 align-self-stretch align-self-sm-auto"
            onClick={onOptimize}
            style={{
              backgroundColor: '#0d9488',
              borderRadius: '12px',
              padding: '0.6rem 1rem',
              fontSize: '0.9rem',
              border: 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <i className="bi bi-magic fs-5"></i>
            <span className="text-start leading-tight">
              ✨ Optimize Budget
            </span>
          </button>
        )}
      </div>

      {/* Second Row: Totals Key-Values */}
      <div className="row g-3 mb-3">
        <div className="col-6">
          <span className="d-block text-muted small fw-medium text-truncate" style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Total Estimated Cost: <strong style={{ color: '#0f172a' }}>{currency}</strong>
          </span>
          <span className="fw-bold text-dark fs-5 text-break" style={{ color: '#0f172a' }}>
            {totalEstimated.toLocaleString()}
          </span>
        </div>
        <div className="col-6">
          <span className="d-block text-muted small fw-medium text-truncate" style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Target Budget: <strong style={{ color: '#0f172a' }}>{currency}</strong>
          </span>
          <span className="fw-bold text-dark fs-5 text-break" style={{ color: '#0f172a' }}>
            {targetBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Third Row: Progress Bar */}
      <div className="mb-4">
        <div className="progress" style={{ height: '12px', borderRadius: '999px', backgroundColor: '#f1f5f9' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${percentage}%`,
              backgroundColor: isOver ? '#dc2626' : '#059669',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          ></div>
        </div>
      </div>

      {savingsFromOptimization > 0 && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4 py-2" style={{ borderRadius: '10px' }}>
          <i className="bi bi-piggy-bank-fill fs-5"></i>
          <div className="small">
            <strong>AI Optimization Savings:</strong> Saved <span>{currency} {savingsFromOptimization.toLocaleString()}</span> on this itinerary!
          </div>
        </div>
      )}

      {/* Fourth Row: 4 Category Cards */}
      <div className="row g-2 g-sm-3 text-center">
        {/* Stay */}
        <div className="col-6 col-sm-3">
          <div
            className="p-2 p-sm-3 border rounded-3 h-100 d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: '12px' }}
          >
            <i className="bi bi-house-door text-primary fs-4 fs-sm-3 mb-1 mb-sm-2"></i>
            <span className="fw-medium d-block mb-1" style={{ color: '#475569', fontSize: '0.85rem' }}>Stay</span>
            <div className="lh-1">
              <span className="d-block fw-bold text-dark" style={{ color: '#0f172a', fontSize: '0.8rem' }}>{currency}</span>
              <strong className="fw-extrabold text-dark" style={{ color: '#0f172a', fontSize: '1rem' }}>
                {accommodation.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Food */}
        <div className="col-6 col-sm-3">
          <div
            className="p-2 p-sm-3 border rounded-3 h-100 d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: '12px' }}
          >
            <i className="bi bi-cup-hot text-danger fs-4 fs-sm-3 mb-1 mb-sm-2"></i>
            <span className="fw-medium d-block mb-1" style={{ color: '#475569', fontSize: '0.85rem' }}>Food</span>
            <div className="lh-1">
              <span className="d-block fw-bold text-dark" style={{ color: '#0f172a', fontSize: '0.8rem' }}>{currency}</span>
              <strong className="fw-extrabold text-dark" style={{ color: '#0f172a', fontSize: '1rem' }}>
                {food.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Transport */}
        <div className="col-6 col-sm-3">
          <div
            className="p-2 p-sm-3 border rounded-3 h-100 d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: '12px' }}
          >
            <i className="bi bi-car-front text-info fs-4 fs-sm-3 mb-1 mb-sm-2"></i>
            <span className="fw-medium d-block mb-1 text-truncate w-100" style={{ color: '#475569', fontSize: '0.85rem' }}>Transport</span>
            <div className="lh-1">
              <span className="d-block fw-bold text-dark" style={{ color: '#0f172a', fontSize: '0.8rem' }}>{currency}</span>
              <strong className="fw-extrabold text-dark" style={{ color: '#0f172a', fontSize: '1rem' }}>
                {transportation.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="col-6 col-sm-3">
          <div
            className="p-2 p-sm-3 border rounded-3 h-100 d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: '12px' }}
          >
            <i className="bi bi-ticket-perforated text-warning fs-4 fs-sm-3 mb-1 mb-sm-2"></i>
            <span className="fw-medium d-block mb-1 text-truncate w-100" style={{ color: '#475569', fontSize: '0.85rem' }}>Activities</span>
            <div className="lh-1">
              <span className="d-block fw-bold text-dark" style={{ color: '#0f172a', fontSize: '0.8rem' }}>{currency}</span>
              <strong className="fw-extrabold text-dark" style={{ color: '#0f172a', fontSize: '1rem' }}>
                {activities.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
