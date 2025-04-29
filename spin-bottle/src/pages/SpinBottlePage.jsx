import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import bottleImg from '../assests/bottlee.png';
import '../styles/SpinPage.css';
import { truthQuestions, dareQuestions, bunnifyQuestions } from '../data/Questions';

const SpinBottlePage = () => {
  const location = useLocation();
  const players = location.state?.players || [];
  const category = location.state?.category || 'kids';

  const canvasRef = useRef(null);
  const bottleRef = useRef(null);

  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [question, setQuestion] = useState('');
  const [timer, setTimer] = useState(30);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showWheel, setShowWheel] = useState(true);

  useEffect(() => {
    if (players.length > 0) {
      drawWheel();
    }
  }, [players]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const angleStep = (2 * Math.PI) / players.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    players.forEach((player, i) => {
      const angle = i * angleStep;

      // Slice color
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angle, angle + angleStep);
      ctx.fillStyle = i % 2 === 0 ? '#FFDDC1' : '#FFABAB';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.stroke();

      // Divider line
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(radius + radius * Math.cos(angle), radius + radius * Math.sin(angle));
      ctx.stroke();

      // Name label
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle + angleStep / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(player, radius - 10, 5);
      ctx.restore();
    });
  };

  const spinBottle = () => {
    setShowButtons(false);
    setShowQuestion(false);
    setSelectedPlayer('');
    setQuestion('');
    setShowWheel(true);

    const bottle = bottleRef.current;
    const spins = Math.floor(Math.random() * 6 + 5);
    const finalAngle = Math.random() * 360;
    const totalRotation = 360 * spins + finalAngle;

    bottle.style.transition = 'transform 4s ease-out';
    bottle.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      const angleInCircle = finalAngle % 360;
      const selectedIndex =
        Math.floor(players.length - (angleInCircle / 360) * players.length) % players.length;
      const player = players[selectedIndex];
      setSelectedPlayer(player);
      setShowButtons(true);
      setShowWheel(false);
    }, 4000);
  };

  const handleQuestionType = (type) => {
    let questionList = [];
    if (type === 'truth') questionList = truthQuestions[category];
    if (type === 'dare') questionList = dareQuestions[category];
    if (type === 'bunnify') questionList = bunnifyQuestions[category];

    const q = questionList[Math.floor(Math.random() * questionList.length)];
    setQuestion(q);
    setShowQuestion(true);
    setShowButtons(false);
    startTimer();
  };

  const startTimer = () => {
    let sec = 30;
    setTimer(sec);
    const interval = setInterval(() => {
      sec--;
      setTimer(sec);
      if (sec === 0) clearInterval(interval);
    }, 1000);
  };

  const handleDone = () => {
    setShowQuestion(false);
    setQuestion('');
    setSelectedPlayer('');
    setShowButtons(false);
    setShowWheel(true);
  };
  

  return (
    <div className="spin-container">
      {showWheel && (
        <>
          <canvas ref={canvasRef} width="400" height="400" className="wheel-canvas"></canvas>
        </>
      )}

      <img
        src={bottleImg}
        ref={bottleRef}
        className="bottle-img"
        onClick={spinBottle}
        alt="Bottle"
      />

      {selectedPlayer && !showQuestion && (
        <h2 className="selected-player">{selectedPlayer}</h2>
      )}

      {showButtons && (
        <div className="action-buttons">
          <button onClick={() => handleQuestionType('truth')}>Truth</button>
          <button onClick={() => handleQuestionType('dare')}>Dare</button>
          <button onClick={() => handleQuestionType('bunnify')}>Bunnify</button>
        </div>
      )}

      {showQuestion && (
        <div className="question-box">
          <h3>{question}</h3>
          <p>Time left: {timer} seconds</p>
          <button onClick={handleDone}>Done</button>
        </div>
      )}
    </div>
  );
};

export default SpinBottlePage;
