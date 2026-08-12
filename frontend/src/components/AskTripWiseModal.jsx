import React, { useState } from 'react';

export const AskTripWiseModal = ({ isOpen, onClose, onApplyInstruction, loading }) => {
  const [instruction, setInstruction] = useState('');

  const suggestions = [
    'Make Day 2 more relaxed with fewer activities.',
    'Replace the expensive dinner on Day 1 with local street food.',
    'Add a sunset beach walk and local photography spots.',
    'Reduce overall accommodation budget by switching to boutique stays.',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    onApplyInstruction(instruction);
    setInstruction('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content tw-card border-0 shadow-lg p-3">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-chat-left-dots-fill text-teal" style={{ color: 'var(--tw-teal)' }}></i>
              Ask TripWise AI Editor
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          <div className="modal-body">
            <p className="text-muted small mb-3">
              Type any edit or custom preference. TripWise AI will update your itinerary seamlessly while maintaining logical timings.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Can you make Day 3 more relaxed and add a local seafood restaurant for dinner?"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Quick Suggestions:</label>
                <div className="d-flex flex-wrap gap-1">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn btn-outline-secondary btn-sm text-start"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setInstruction(sug)}
                      disabled={loading}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button type="button" className="btn btn-light" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-teal-tw d-flex align-items-center gap-2" disabled={loading || !instruction.trim()}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span> Editing Itinerary...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill"></i> Apply Edit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
