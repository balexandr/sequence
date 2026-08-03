import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useStats } from './hooks/useStats';
import PromptBox from './components/PromptBox';
import GameBoard from './components/GameBoard';
import ScoreBar from './components/ScoreBar';
import WinScreen from './components/WinScreen';
import HowToPlay from './components/HowToPlay';
import StatsScreen from './components/StatsScreen';
import styles from './App.module.css';
import { GameLogo } from './components/GameLogo';
import { NoodleLogoIcon } from './components/NoodleLogo';
import { recordTodayShare, getCompletedTodayCount, buildShareAllText } from './utils/shareAll';

const HOW_TO_PLAY_KEY = 'sequence-how-to-play-seen';

export default function App() {
  const {
    puzzle,
    items,
    attempts,
    attemptNumber,
    maxAttempts,
    gameStatus,
    feedback,
    showFeedback,
    initialized,
    dateKey,
    puzzleNumber,
    lastGuessOrder,
    reorderItems,
    submitGuess,
    generateShareText,
  } = useGameState();

  const { stats, history, winPct, recordGame } = useStats();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [winDismissed, setWinDismissed] = useState(false);
  const [shareAllCount, setShareAllCount] = useState(0);
  const [shareAllCopied, setShareAllCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleShareAll = async () => {
    const text = buildShareAllText(dateKey);
    if (!text) return;
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShareAllCopied(true);
    setTimeout(() => setShareAllCopied(false), 2500);
  };

  const footer = (
    <footer className={styles.footer}>
      <a href="https://noodlegames.co" target="_blank" rel="noopener noreferrer" className={styles.footerLogo}>
        <NoodleLogoIcon size={18} /> NoodleGames
      </a>
      {shareAllCount > 0 && (
        <button
          className={`${styles.footerShareAll} ${shareAllCopied ? styles.copied : ''}`}
          onClick={handleShareAll}
        >
          {shareAllCopied ? '✓ Copied' : `⬆ Share all completed (${shareAllCount}/8)`}
        </button>
      )}
      <span className={styles.footerCopy}>© {currentYear} NoodleGames.co</span>
    </footer>
  );

  useEffect(() => {
    try {
      if (!localStorage.getItem(HOW_TO_PLAY_KEY)) {
        setShowHowToPlay(true);
      }
    } catch {}
  }, []);

  const dismissHowToPlay = () => {
    setShowHowToPlay(false);
    try { localStorage.setItem(HOW_TO_PLAY_KEY, '1'); } catch {}
  };

  // Record stats when game ends
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      recordGame(dateKey, gameStatus === 'won', attemptNumber, attempts);
      recordTodayShare('sequence', dateKey, generateShareText());
    }
  }, [gameStatus]);

  useEffect(() => {
    setShareAllCount(getCompletedTodayCount(dateKey));
  }, [gameStatus, dateKey]);

  if (!initialized) return null;

  if (!puzzle) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.logo}><GameLogo />Sequence</h1>
          </div>
        </header>
        <div className={styles.noPuzzle}>
          <span className={styles.noPuzzleEmoji}>📋</span>
          <p>No puzzle for today yet.</p>
          <p className={styles.muted}>Check back tomorrow!</p>
        </div>
        {footer}
      </div>
    );
  }

  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}><GameLogo />Sequence</h1>
          {puzzleNumber && <span className={styles.puzzleNumber}>#{puzzleNumber}</span>}
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.iconButton}
            onClick={() => setShowStats(true)}
            aria-label="Statistics"
          >
            <svg
              className={styles.statsIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M4 20H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <rect x="6" y="11" width="2.8" height="7" rx="1" fill="currentColor" />
              <rect x="10.6" y="7" width="2.8" height="11" rx="1" fill="currentColor" opacity="0.9" />
              <rect x="15.2" y="4" width="2.8" height="14" rx="1" fill="currentColor" opacity="0.8" />
            </svg>
          </button>
          <button
            className={styles.iconButton}
            onClick={() => setShowHowToPlay(true)}
            aria-label="How to play"
          >
            ?
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <PromptBox prompt={puzzle.prompt} hint={puzzle.hint} />

        <ScoreBar
          feedback={showFeedback ? feedback : null}
          attemptNumber={attemptNumber}
          maxAttempts={maxAttempts}
        />

        <GameBoard
          items={items}
          feedback={feedback}
          showFeedback={showFeedback}
          disabled={isGameOver}
          onReorder={reorderItems}
        />

        {!isGameOver && (
          <button
            className={styles.submitButton}
            onClick={submitGuess}
            disabled={showFeedback}
          >
            {showFeedback
              ? 'Drag to rearrange'
              : attemptNumber === 0
                ? 'Lock it in'
                : `Try again (${maxAttempts - attemptNumber} left)`}
          </button>
        )}
      </main>

      {isGameOver && !winDismissed && (
        <WinScreen
          gameStatus={gameStatus}
          attempts={attempts}
          answer={puzzle.answer}
          lastGuess={lastGuessOrder}
          prompt={puzzle.prompt}
          puzzleNumber={puzzleNumber}
          generateShareText={generateShareText}
          stats={stats}
          winPct={winPct}
          onDismiss={() => setWinDismissed(true)}
        />
      )}

      {showHowToPlay && (
        <HowToPlay onClose={dismissHowToPlay} />
      )}

      {showStats && (
        <StatsScreen
          stats={stats}
          winPct={winPct}
          history={history}
          maxAttempts={maxAttempts}
          onClose={() => setShowStats(false)}
        />
      )}

      {footer}
    </div>
  );
}
