import styles from './HowToPlay.module.css';

export default function HowToPlay({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>How to Play</h2>
        <p className={styles.intro}>Put the 8 items in the correct order based on the prompt.</p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepIcon}>👆</span>
            <div>
              <p className={styles.stepTitle}>Drag to reorder</p>
              <p className={styles.stepDesc}>Drag the items up and down to arrange them in what you think is the correct sequence.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>🎯</span>
            <div>
              <p className={styles.stepTitle}>Submit your guess</p>
              <p className={styles.stepDesc}>Green means correct position. Red means wrong. You get 3 attempts.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>📤</span>
            <div>
              <p className={styles.stepTitle}>Share your result</p>
              <p className={styles.stepDesc}>After you finish, share your emoji grid with friends.</p>
            </div>
          </div>
        </div>

        <div className={styles.example}>
          <p className={styles.exampleLabel}>Example result</p>
          <div className={styles.exampleGrid}>
            <div className={styles.exampleRow}>
              <span className={styles.cellGreen} />
              <span className={styles.cellRed} />
              <span className={styles.cellRed} />
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
              <span className={styles.cellRed} />
              <span className={styles.cellGreen} />
              <span className={styles.cellRed} />
            </div>
            <div className={styles.exampleRow}>
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
              <span className={styles.cellGreen} />
            </div>
          </div>
        </div>

        <button className={styles.playButton} onClick={onClose}>
          Let's play
        </button>
      </div>
    </div>
  );
}
