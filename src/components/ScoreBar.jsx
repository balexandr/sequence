import styles from './ScoreBar.module.css';

export default function ScoreBar({ feedback, attemptNumber, maxAttempts }) {
  return (
    <div className={styles.container}>
      <div className={styles.pips}>
        {Array.from({ length: 6 }).map((_, i) => {
          const status = feedback ? feedback[i] : null;
          return (
            <div
              key={i}
              className={`${styles.pip} ${
                status === 'correct' ? styles.correct : status === 'wrong' ? styles.wrong : ''
              }`}
              style={feedback ? { transitionDelay: `${i * 90}ms` } : undefined}
            />
          );
        })}
      </div>
      <div className={styles.attempts}>
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${
              i < attemptNumber ? styles.used : i === attemptNumber ? styles.current : ''
            }`}
          >
            {i < attemptNumber ? i + 1 : null}
          </div>
        ))}
      </div>
    </div>
  );
}
