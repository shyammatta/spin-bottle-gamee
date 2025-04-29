// src/pages/LetsBegin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LetsBegin() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '200px' }}>
      <h1>Welcome to Spin the Bottle Game</h1>
      <button onClick={() => navigate('/categories')}>Let's Begin</button>
    </div>
  );
}

export default LetsBegin;