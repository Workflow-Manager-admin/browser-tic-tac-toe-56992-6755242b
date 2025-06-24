import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Square - single cell of the Tic Tac Toe board
 * @param {object} props - { value, onClick, highlight }
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell occupied by ${value}` : 'Empty cell'}
      tabIndex={0}
    >
      <span className={`ttt-piece${value ? ` player-${value}` : ''}`}>{value}</span>
    </button>
  );
}

/**
 * StatusBar - Displays current turn, winner, score and restart/new buttons
 */
function StatusBar({ status, xScore, oScore, onRestart, onNewGame }) {
  return (
    <div className="ttt-status-bar">
      <div className="ttt-scores">
        <span className="ttt-x">X: {xScore}</span>
        <span className="ttt-o">O: {oScore}</span>
      </div>
      <div className="ttt-status-text">{status}</div>
      <div className="ttt-actions">
        <button className="btn btn-small" onClick={onRestart}>Restart</button>
        <button className="btn btn-small btn-secondary" onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
}

/**
 * Determines if anyone has won and returns the winner and line
 * @param {array} squares
 * @returns {object} {winner: 'X'|'O'|null, line: array|undefined}
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6] // diagonals
  ];
  for(const line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: undefined };
}

/**
 * App - Main Tic Tac Toe game component
 */
// PUBLIC_INTERFACE
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const [status, setStatus] = useState('');
  const [winnerLine, setWinnerLine] = useState([]);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  // Animates for move
  const [blinkCells, setBlinkCells] = useState([]);

  // Handle cell click
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXisNext(!xIsNext);

    // Simple blink animation for move
    setBlinkCells([i]);
    setTimeout(() => setBlinkCells([]), 150);
  };

  // Restart the board but not scores
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXisNext(true);
    setWinnerLine([]);
    setStatus('');
    setBlinkCells([]);
  };

  // Start completely new game
  const handleNewGame = () => {
    handleRestart();
    setXScore(0);
    setOScore(0);
  };

  useEffect(() => {
    const { winner, line } = calculateWinner(squares);
    if (winner) {
      setWinnerLine(line);
      setStatus(`Winner: ${winner}!`);
      // update score once per win
      if ((winner === 'X' && squares.filter(v=>v).length >= 5) || (winner === 'O' && squares.filter(v=>v).length >= 5)) {
        setTimeout(() => {
          if (winner === 'X') setXScore(s => s + 1);
          else setOScore(s => s + 1);
        }, 400);
      }
    } else if (!squares.includes(null)) {
      setStatus('It\'s a draw!');
      setWinnerLine([]);
    } else {
      setStatus(`Turn: ${xIsNext ? 'X' : 'O'}`);
      setWinnerLine([]);
    }
  }, [squares, xIsNext]);
  
  // Simple keyboard support (restart with R, new game with N)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === 'r') handleRestart();
      if (e.key.toLowerCase() === 'n') handleNewGame();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="ttt-app">
      <main>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <StatusBar
          status={status}
          xScore={xScore}
          oScore={oScore}
          onRestart={handleRestart}
          onNewGame={handleNewGame}
        />
        <div className="ttt-board-ct">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {[...Array(9)].map((_, i) => (
              <Square
                key={i}
                value={squares[i]}
                onClick={() => handleClick(i)}
                highlight={winnerLine && winnerLine.includes(i)}
              />
            ))}
          </div>
        </div>
        <div className="ttt-newgame-hint">
          <span>Press <b>R</b> to restart round, <b>N</b> for new game</span>
        </div>
        <footer className="ttt-footer">
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="ttt-footer-link">
            Powered by React
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;