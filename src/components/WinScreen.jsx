import { useState, useEffect } from 'react';
import styles from './WinScreen.module.css';

function getTimeToMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds };
}

export default function WinScreen({ gameStatus, attempts, answer, lastGuess, prompt, puzzleNumber, generateShareText }) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(getTimeToMidnight());
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeToMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    const text = generateShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const pad = (n) => String(n).padStart(2, '0');
  const won = gameStatus === 'won';

  return (
    <div className={`${styles.overlay} ${showContent ? styles.visible : ''}`}>
      <div className={styles.modal}>
        {won && <div className={styles.starsContainer} aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className={styles.star}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
                '--size': `${3 + Math.random() * 5}px`,
              }}
            />
          ))}
        </div>}

        <div className={styles.resultHeader}>
          <span className={styles.emoji}>{won ? '\u{1f3af}' : '\u{1f4cb}'}</span>
          <h2 className={styles.title}>
            {won ? 'Perfect Sequence!' : 'Not quite'}
          </h2>
          <p className={styles.subtitle}>
            {won
              ? `Solved in ${attempts.length} ${attempts.length === 1 ? 'attempt' : 'attempts'}`
              : 'Better luck tomorrow'}
          </p>
        </div>

        <div className={styles.grid}>
          {attempts.map((attempt, row) => (
            <div key={row} className={styles.gridRow}>
              {attempt.map((r, col) => (
                <span
                  key={col}
                  className={`${styles.gridCell} ${r === 'correct' ? styles.gridCorrect : styles.gridWrong}`}
                />
              ))}
            </div>
          ))}
        </div>

        {won ? (
          <div className={styles.comparisonSection} style={{ gridTemplateColumns: '1fr' }}>
            <div className={styles.comparisonColumn}>
              <p className={styles.answerLabel}>Correct order</p>
              <div className={styles.answerList}>
                {answer.map((item, i) => (
                  <div key={item} className={styles.answerItem}>
                    <span className={`${styles.answerIndex} ${styles.indexCorrect}`}>{i + 1}</span>
                    <span className={styles.answerText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.comparisonSection}>
            <div className={styles.comparisonColumn}>
              <p className={styles.answerLabel}>Your last guess</p>
              <div className={styles.answerList}>
                {lastGuess.map((item, i) => {
                  const isCorrect = item === answer[i];
                  return (
                    <div key={`guess-${i}`} className={styles.answerItem}>
                      <span className={`${styles.answerIndex} ${isCorrect ? styles.indexCorrect : styles.indexWrong}`}>{i + 1}</span>
                      <span className={`${styles.answerText} ${isCorrect ? '' : styles.textWrong}`}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.comparisonColumn}>
              <p className={styles.answerLabel}>Correct order</p>
              <div className={styles.answerList}>
                {answer.map((item, i) => (
                  <div key={item} className={styles.answerItem}>
                    <span className={`${styles.answerIndex} ${styles.indexCorrect}`}>{i + 1}</span>
                    <span className={styles.answerText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          className={`${styles.shareButton} ${copied ? styles.copied : ''}`}
          onClick={handleShare}
        >
          {copied ? '\u2713 Copied to clipboard' : 'Share your result'}
        </button>

        <div className={styles.countdown}>
          <span className={styles.countdownLabel}>Next puzzle in</span>
          <span className={styles.countdownTime}>
            {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
