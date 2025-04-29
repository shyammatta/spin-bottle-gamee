// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeginPage from './pages/BeginPage';
import CategoryPage from './pages/CategoryPage';
import AddPlayerPage from './pages/AddPlayerPage';
import SpinBottlePage from './pages/SpinBottlePage';
import QuestionPage from './pages/QuestionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BeginPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/add-players" element={<AddPlayerPage />} />
        <Route path="/spin" element={<SpinBottlePage />} />
        <Route path="/question" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;