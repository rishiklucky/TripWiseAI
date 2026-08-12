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
    <div className="tw-card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-1">Budget Overview</h5>
          <span className={`badge ${isOver ? 'bg-danger' : 'bg-success'} px-3 py-2`}>
            {isOver ? `OVER BUDGET BY ${currency} ${difference.toLocaleString()}` : `WITHIN BUDGET (REMAINING: ${currency} ${difference.toLocaleString()})`}
          </span>
        </div>
        {onOptimize && (
          <button className="btn btn-teal-tw btn-sm d-flex align-items-center gap-2" onClick={onOptimize}>
            <i className="bi bi-magic"></i> ✨ Optimize Budget
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between small text-muted mb-1">
          <span>Total Estimated Cost: <strong>{currency} {totalEstimated.toLocaleString()}</strong></span>
          <span>Target Budget: <strong>{currency} {targetBudget.toLocaleString()}</strong></span>
        </div>
        <div className="progress" style={{ height: '12px' }}>
          <div
            className={`progress-bar ${isOver ? 'bg-danger' : 'bg-success'}`}
            role="progressbar"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {savingsFromOptimization > 0 && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-3 py-2">
          <i className="bi bi-piggy-bank-fill fs-5"></i>
          <div>
            <strong>AI Optimization Savings:</strong> Saved <span>{currency} {savingsFromOptimization.toLocaleString()}</span> on this itinerary!
          </div>
        </div>
      )}

      <div className="row g-3 text-center small">
        <div className="col">
          <div className="p-2 border rounded bg-light">
            <i className="bi bi-house-door text-primary d-block mb-1"></i>
            <span className="text-muted d-block">Stay</span>
            <strong className="text-dark">{currency} {accommodation.toLocaleString()}</strong>
          </div>
        </div>
        <div className="col">
          <div className="p-2 border rounded bg-light">
            <i className="bi bi-cup-hot text-danger d-block mb-1"></i>
            <span className="text-muted d-block">Food</span>
            <strong className="text-dark">{currency} {food.toLocaleString()}</strong>
          </div>
        </div>
        <div className="col">
          <div className="p-2 border rounded bg-light">
            <i className="bi bi-car-front text-info d-block mb-1"></i>
            <span className="text-muted d-block">Transport</span>
            <strong className="text-dark">{currency} {transportation.toLocaleString()}</strong>
          </div>
        </div>
        <div className="col">
          <div className="p-2 border rounded bg-light">
            <i className="bi bi-ticket-perforated text-warning d-block mb-1"></i>
            <span className="text-muted d-block">Activities</span>
            <strong className="text-dark">{currency} {activities.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
