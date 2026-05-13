import { useState, useCallback, useEffect } from 'react';
import puzzles from '../data/puzzles.json';

const STORAGE_KEY = 'sequence-game-state';
const MAX_ATTEMPTS = 3;
const EPOCH = '2026-05-12';

function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function loadState(dateKey) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.dateKey !== dateKey) return null;
    return saved;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

export function useGameState() {
  const dateKey = getTodayKey();
  const puzzle = puzzles[dateKey];
  const puzzleNumber = Math.floor((new Date(dateKey) - new Date(EPOCH)) / 86400000) + 1;

  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [guessOrders, setGuessOrders] = useState([]);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [feedback, setFeedback] = useState(null); // array of 'correct'|'wrong' or null
  const [showFeedback, setShowFeedback] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize state
  useEffect(() => {
    if (!puzzle) {
      setInitialized(true);
      return;
    }

    const saved = loadState(dateKey);
    if (saved) {
      setItems(saved.items);
      setAttempts(saved.attempts);
      setGuessOrders(saved.guessOrders || []);
      setAttemptNumber(saved.attemptNumber);
      setGameStatus(saved.gameStatus);
      setFeedback(saved.feedback);
      setShowFeedback(saved.gameStatus !== 'playing');
    } else {
      // Shuffle items ensuring they don't start in the correct order
      let shuffled = shuffleArray(puzzle.items);
      while (shuffled.every((item, i) => item === puzzle.answer[i])) {
        shuffled = shuffleArray(puzzle.items);
      }
      setItems(shuffled);
    }
    setInitialized(true);
  }, [dateKey]);

  // Persist state changes
  useEffect(() => {
    if (!initialized || !puzzle) return;
    saveState({
      dateKey,
      items,
      attempts,
      guessOrders,
      attemptNumber,
      gameStatus,
      feedback,
    });
  }, [items, attempts, guessOrders, attemptNumber, gameStatus, feedback, initialized]);

  const reorderItems = useCallback((newOrder) => {
    if (gameStatus !== 'playing') return;
    if (showFeedback) {
      setShowFeedback(false);
      setFeedback(null);
      setAttemptNumber((n) => n);
    }
    setItems(newOrder);
  }, [gameStatus, showFeedback]);

  const submitGuess = useCallback(() => {
    if (!puzzle || gameStatus !== 'playing' || showFeedback) return;

    const result = items.map((item, i) =>
      item === puzzle.answer[i] ? 'correct' : 'wrong'
    );

    const isCorrect = result.every((r) => r === 'correct');
    const newAttempts = [...attempts, result];
    const newGuessOrders = [...guessOrders, [...items]];
    const newAttemptNumber = attemptNumber + 1;

    setFeedback(result);
    setShowFeedback(true);
    setAttempts(newAttempts);
    setGuessOrders(newGuessOrders);

    if (isCorrect) {
      setGameStatus('won');
      setAttemptNumber(newAttemptNumber);
    } else if (newAttemptNumber >= MAX_ATTEMPTS) {
      setGameStatus('lost');
      setAttemptNumber(newAttemptNumber);
    } else {
      setAttemptNumber(newAttemptNumber);
    }
  }, [puzzle, items, attempts, guessOrders, attemptNumber, gameStatus, showFeedback]);

  const generateShareText = useCallback(() => {
    if (!puzzle) return '';
    const won = gameStatus === 'won';
    const lines = attempts.map((attempt) =>
      attempt.map((r) => (r === 'correct' ? '🟩' : '🟥')).join('')
    );
    const header = `Sequence #${puzzleNumber}`;
    const result = won ? `${attemptNumber}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
    return `${header} ${result}\n\n${lines.join('\n')}`;
  }, [attempts, attemptNumber, gameStatus, dateKey, puzzle]);

  return {
    puzzle,
    items,
    attempts,
    attemptNumber,
    maxAttempts: MAX_ATTEMPTS,
    gameStatus,
    feedback,
    showFeedback,
    initialized,
    dateKey,
    puzzleNumber,
    lastGuessOrder: guessOrders.length > 0 ? guessOrders[guessOrders.length - 1] : items,
    reorderItems,
    submitGuess,
    generateShareText,
  };
}
