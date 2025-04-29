// src/pages/QuestionPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = {
  kids: {
    truth: ['What is your favorite cartoon?'],
    dare: ['Dance like a chicken!'],
    bunnify: ['Tell a bunny joke!']
  },
  teens: {
    truth: ['Who was your first crush?'],
    dare: ['Text someone randomly!'],
    bunnify: ['Talk in bunny voice!']
  },
  adults: {
    truth: ['What’s your guilty pleasure?'],
    dare: ['Sing a song loudly!'],
    bunnify: ['Hop like a bunny!']
  }
};

function QuestionPage() {
  const [question, setQuestion] = useState('');
  const [timer, setTimer] = useState(30);
  const [player, setPlayer] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setPlayer(localStorage.getItem('selectedPlayer'));
    setCategory(localStorage.getItem('category'));
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const showQuestion = (type) => {
    const qList = questions[category][type];
    const random = Math.floor(Math.random() * qList.length);
    setQuestion(qList[random]);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{player}</h2>
      {!question && (
        <>
          <button onClick={() => showQuestion('truth')}>Truth</button>
          <button onClick={() => showQuestion('dare')}>Dare</button>
          <button onClick={() => showQuestion('bunnify')}>Bunnify</button>
        </>
      )}
      {question && (
        <>
          <p>{question}</p>
          <p>Time left: {timer}s</p>
          <button onClick={() => navigate('/spin')}>Done</button>
        </>
      )}
    </div>
  );
}

export default QuestionPage;