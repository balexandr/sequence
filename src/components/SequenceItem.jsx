import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './SequenceItem.module.css';

export default function SequenceItem({ id, label, index, feedback, disabled, isGhost, isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, disabled: disabled || isOverlay });

  const baseStyle = {};
  if (!isOverlay) {
    baseStyle.transform = CSS.Transform.toString(transform);
    baseStyle.transition = transition;
  }

  if (feedback) {
    baseStyle.animationDelay = `${index * 90}ms`;
  }

  const classNames = [styles.item];
  if (isGhost) classNames.push(styles.ghost);
  if (isOverlay) classNames.push(styles.overlay);
  if (feedback === 'correct') classNames.push(styles.correct);
  if (feedback === 'wrong') classNames.push(styles.wrong);

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={baseStyle}
      className={classNames.join(' ')}
      {...(isOverlay ? {} : { ...attributes, ...listeners })}
    >
      <span className={styles.index}>{index + 1}</span>
      <span className={styles.label}>{label}</span>
      <span className={styles.handle} aria-hidden="true">
        <span className={styles.gripDot} />
        <span className={styles.gripDot} />
        <span className={styles.gripDot} />
        <span className={styles.gripDot} />
        <span className={styles.gripDot} />
        <span className={styles.gripDot} />
      </span>
    </div>
  );
}
