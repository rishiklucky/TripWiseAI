import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg tw-navbar sticky-top py-3">
      <div className="container">
        <Link to="/" className="tw-nav-logo text-decoration-none d-flex align-items-center gap-2">
          <img src="/tripwise_ai_logo.png" alt="TripWise AI" style={{ height: '34px', width: 'auto' }} />
          <span>TripWise<span style={{ color: 'var(--tw-teal)' }}>.AI</span></span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-medium gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/create">Plan Trip</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/dashboard">My Trips</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-sky-tw dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{user?.name || 'Account'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>Profile & Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="bi bi-journal-bookmark me-2"></i>My Saved Trips
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-link text-dark text-decoration-none fw-semibold">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-tw">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
