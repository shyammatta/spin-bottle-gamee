// src/pages/CategorySelection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function CategorySelection() {
  const navigate = useNavigate();

  const selectCategory = (cat) => {
    localStorage.setItem('category', cat);
    navigate('/add-players');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Select a Category</h2>
      <button onClick={() => selectCategory('kids')}>Kids</button>
      <button onClick={() => selectCategory('teens')}>Teens</button>
      <button onClick={() => selectCategory('adults')}>Adults</button>
    </div>
  );
}

export default CategorySelection;
