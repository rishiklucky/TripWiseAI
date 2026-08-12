import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Register = () => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await register({ name, email, password });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container py-5 my-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="tw-card p-4 p-md-5 shadow-sm">
            <div className="text-center mb-4">
              <h3 className="fw-bold">Create an Account</h3>
              <p className="text-muted small">Join TripWise AI to plan, optimize, and save custom itineraries.</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn btn-primary-tw w-100 py-2.5 mb-3" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center small text-muted">
                Already have an account? <Link to="/login" className="text-teal text-decoration-none fw-semibold">Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
