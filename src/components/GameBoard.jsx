import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SequenceItem from './SequenceItem';
import styles from './GameBoard.module.css';

export default function GameBoard({ items, feedback, showFeedback, disabled, onReorder }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  const activeIndex = activeId ? items.indexOf(activeId) : -1;

  return (
    <div className={styles.board}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={({ active, over }) => {
          setActiveId(null);
          if (!over || active.id === over.id) return;
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          onReorder(arrayMove(items, oldIndex, newIndex));
        }}
        onDragCancel={() => setActiveId(null)}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item, i) => (
            <SequenceItem
              key={item}
              id={item}
              label={item}
              index={i}
              feedback={showFeedback && feedback ? feedback[i] : null}
              disabled={disabled}
              isGhost={activeId === item}
            />
          ))}
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeId != null ? (
            <SequenceItem
              id={activeId}
              label={activeId}
              index={activeIndex}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
