import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Profile = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || 'INR');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await updateProfile({
        name,
        preferredCurrency,
        ...(password && { password }),
      });
      if (res.success) {
        setMsg('Profile updated successfully!');
        setPassword('');
      }
    } catch (err) {
      setMsg('Update failed. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="tw-card p-4 p-md-5 shadow-sm">
            <h4 className="fw-bold mb-4">Account & Profile Settings</h4>

            {msg && <div className="alert alert-info py-2 small">{msg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  value={user?.email || ''}
                  disabled
                />
                <span className="text-muted small">Email cannot be changed.</span>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Preferred Currency</label>
                <select
                  className="form-select"
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value)}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">New Password (optional)</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Leave blank to keep unchanged"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary-tw w-100 py-2.5" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
