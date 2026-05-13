import styles from './StatsScreen.module.css';

export default function StatsScreen({ stats, winPct, history, maxAttempts, onClose }) {
  const maxDist = Math.max(1, ...Object.values(stats.distribution));

  // Build sorted history entries (most recent first)
  const historyEntries = Object.entries(history)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 30);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">×</button>

        <h2 className={styles.title}>Statistics</h2>

        <div className={styles.statCards}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.gamesPlayed}</span>
            <span className={styles.statLabel}>Played</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{winPct}</span>
            <span className={styles.statLabel}>Win %</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.currentStreak}</span>
            <span className={styles.statLabel}>Streak</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.maxStreak}</span>
            <span className={styles.statLabel}>Max</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Guess Distribution</h3>
          <div className={styles.distribution}>
            {Array.from({ length: maxAttempts }).map((_, i) => {
              const count = stats.distribution[i + 1] || 0;
              const width = count > 0 ? Math.max(12, (count / maxDist) * 100) : 8;
              return (
                <div key={i} className={styles.distRow}>
                  <span className={styles.distLabel}>{i + 1}</span>
                  <div className={styles.distBarTrack}>
                    <div
                      className={`${styles.distBar} ${count > 0 ? styles.distBarFilled : ''}`}
                      style={{ width: `${width}%` }}
                    >
                      <span className={styles.distCount}>{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {historyEntries.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Recent Games</h3>
            <div className={styles.historyList}>
              {historyEntries.map(([dateKey, entry]) => (
                <div key={dateKey} className={styles.historyRow}>
                  <span className={styles.historyDate}>{formatDate(dateKey)}</span>
                  <div className={styles.historyGrid}>
                    {entry.attempts[entry.attempts.length - 1].map((r, i) => (
                      <span
                        key={i}
                        className={`${styles.historyPip} ${
                          r === 'correct' ? styles.historyCorrect : styles.historyWrong
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`${styles.historyResult} ${entry.won ? styles.historyWin : styles.historyLoss}`}>
                    {entry.won ? `${entry.attemptNumber}/${maxAttempts}` : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateKey) {
  const d = new Date(dateKey + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
