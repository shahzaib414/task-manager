/**
 * TaskCard Component
 * Displays a single task card that can be dragged
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onViewClick?: (taskId: string) => void;
}

export function TaskCard({ task, onViewClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag from triggering
    if (onViewClick) {
      onViewClick(task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.taskCard}
      {...attributes}
      {...listeners}
    >
      <div className={styles.cardHeader}>
        <h4 className={styles.taskTitle}>{task.title}</h4>
        {onViewClick && (
          <button
            onClick={handleViewClick}
            className={styles.viewButton}
            aria-label="View task details"
            type="button"
          >
            View
          </button>
        )}
      </div>
      {task.description && (
        <p className={styles.taskDescription}>{task.description}</p>
      )}
      <div className={styles.taskMeta}>
        <span className={styles.taskId}>#{task.id.slice(0, 8)}</span>
      </div>
    </div>
  );
}
