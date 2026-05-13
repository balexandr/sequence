import { useState, useCallback, useEffect } from 'react';

const STATS_KEY = 'sequence-stats';
const HISTORY_KEY = 'sequence-history';

function getDefaultStats() {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: { 1: 0, 2: 0, 3: 0 },
    lastPlayedDate: null,
    lastCompletedDate: null,
  };
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return getDefaultStats();
    return { ...getDefaultStats(), ...JSON.parse(raw) };
  } catch {
    return getDefaultStats();
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

function isConsecutiveDay(dateA, dateB) {
  if (!dateA || !dateB) return false;
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diff = Math.abs(b - a);
  return diff >= 86400000 && diff < 172800000;
}

export function useStats() {
  const [stats, setStats] = useState(loadStats);
  const [history, setHistory] = useState(loadHistory);

  const recordGame = useCallback((dateKey, won, attemptNumber, attempts) => {
    setStats((prev) => {
      // Don't double-record
      if (prev.lastCompletedDate === dateKey) return prev;

      const next = { ...prev };
      next.gamesPlayed += 1;
      next.lastPlayedDate = dateKey;
      next.lastCompletedDate = dateKey;

      if (won) {
        next.gamesWon += 1;
        next.distribution = { ...next.distribution };
        next.distribution[attemptNumber] = (next.distribution[attemptNumber] || 0) + 1;

        if (isConsecutiveDay(prev.lastCompletedDate, dateKey) || prev.gamesPlayed === 0) {
          next.currentStreak = prev.currentStreak + 1;
        } else {
          next.currentStreak = 1;
        }
        next.maxStreak = Math.max(next.maxStreak, next.currentStreak);
      } else {
        next.currentStreak = 0;
      }

      saveStats(next);
      return next;
    });

    setHistory((prev) => {
      const next = { ...prev };
      next[dateKey] = {
        won,
        attemptNumber,
        attempts,
        completedAt: new Date().toISOString(),
      };
      saveHistory(next);
      return next;
    });
  }, []);

  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  return {
    stats,
    history,
    winPct,
    recordGame,
  };
}
