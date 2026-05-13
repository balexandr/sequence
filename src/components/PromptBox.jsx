import styles from './PromptBox.module.css';

export default function PromptBox({ prompt, hint }) {
  return (
    <div className={styles.promptBox}>
      <p className={styles.prompt}>{prompt}</p>
      {hint && (
        <div className={styles.hintRow}>
          <span className={styles.hintArrow}>▸</span>
          <span className={styles.hint}>{hint}</span>
        </div>
      )}
    </div>
  );
}
