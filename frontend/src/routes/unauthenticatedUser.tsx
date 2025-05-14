import React from 'react';
import { Link } from 'react-router';

const UnauthenticatedUser: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: '10vh' }}>
    <h2>You are not authenticated</h2>
    <p>Please log in to access this page.</p>
    <Link to="/login">
      <button>Go to Login</button>
    </Link>
  </div>
);

export default UnauthenticatedUser;