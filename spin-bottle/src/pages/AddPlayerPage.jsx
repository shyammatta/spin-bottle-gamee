// src/pages/AddPlayers.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddPlayers() {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  const addPlayer = () => {
    if (name.trim()) {
      setPlayers([...players, name]);
      setName('');
    }
  };

  const removePlayer = (index) => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };

  const startGame = () => {
    localStorage.setItem('players', JSON.stringify(players));
    navigate('/spin');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Add Players</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter player name"
      />
      <button onClick={addPlayer}>Add</button>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player} <button onClick={() => removePlayer(index)}>❌</button>
          </li>
        ))}
      </ul>
      {players.length > 0 && <button onClick={startGame}>Spin</button>}
    </div>
  );
}

export default AddPlayers;
