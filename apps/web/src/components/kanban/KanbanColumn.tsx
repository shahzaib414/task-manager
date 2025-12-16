/**
 * KanbanColumn Component
 * Displays a column with tasks that can be sorted
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onViewTask?: (taskId: string) => void;
}

export function KanbanColumn({ status, title, tasks, onViewTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <h3 className={styles.columnTitle}>{title}</h3>
        <span className={styles.taskCount}>{tasks.length}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={styles.columnContent}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tasks</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onViewClick={onViewTask}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
