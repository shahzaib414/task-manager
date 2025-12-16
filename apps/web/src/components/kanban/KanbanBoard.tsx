/**
 * KanbanBoard Component
 * Main board with drag-and-drop functionality using SWR
 */

'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Task, TaskStatus, CreateTaskInput } from '@/types/task';
import { useTasks, useTaskOperations } from '@/lib/hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import styles from './KanbanBoard.module.css';

const COLUMNS = [
  { status: 'TODO' as TaskStatus, title: 'Todo' },
  { status: 'IN_PROGRESS' as TaskStatus, title: 'In Progress' },
  { status: 'DONE' as TaskStatus, title: 'Done' },
];

interface KanbanBoardProps {
  initialTasks?: Task[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  // Use SWR for data fetching and caching
  const { tasks, isLoading, isError } = useTasks(initialTasks);
  const { addTask, reorderTaskList, updateTasksOptimistic } = useTaskOperations();
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by status
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Determine if we're over a column or another task
    const overTask = tasks.find(t => t.id === overId);
    const overColumn = COLUMNS.find(col => col.status === overId);

    let newStatus: TaskStatus | undefined;

    if (overTask) {
      newStatus = overTask.status;
    } else if (overColumn) {
      newStatus = overColumn.status;
    }

    // If status changed, update immediately for smooth UX
    if (newStatus && activeTask.status !== newStatus) {
      updateTasksOptimistic(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === activeId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggedTask = tasks.find(t => t.id === activeId);
    if (!draggedTask) return;

    // Determine final status
    const overTask = tasks.find(t => t.id === overId);
    const overColumn = COLUMNS.find(col => col.status === overId);
    
    const finalStatus = overTask?.status || overColumn?.status || draggedTask.status;

    // Calculate new order for all tasks
    let updatedTasks = tasks.map(task => 
      task.id === activeId ? { ...task, status: finalStatus } : task
    );

    // Get tasks in the target column
    const columnTasks = updatedTasks
      .filter(task => task.status === finalStatus)
      .sort((a, b) => a.order - b.order);

    // If we're reordering within the same column or between columns
    if (overTask && activeId !== overId) {
      const oldIndex = columnTasks.findIndex(t => t.id === activeId);
      const newIndex = columnTasks.findIndex(t => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
        
        // Update order values
        const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
          ...task,
          order: index,
        }));

        // Replace tasks in the target column
        updatedTasks = updatedTasks.map(task => {
          if (task.status === finalStatus) {
            const updatedTask = tasksWithNewOrder.find(t => t.id === task.id);
            return updatedTask || task;
          }
          return task;
        });
      }
    } else {
      // Just dropped into a column, reorder
      const reorderedTasks = columnTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      updatedTasks = updatedTasks.map(task => {
        if (task.status === finalStatus) {
          const updatedTask = reorderedTasks.find(t => t.id === task.id);
          return updatedTask || task;
        }
        return task;
      });
    }

    // Optimization: Only send tasks that actually changed
    // Compare updated tasks with original tasks to find changes
    const changedTasks = updatedTasks.filter(task => {
      const original = tasks.find(t => t.id === task.id);
      // Task changed if order or status is different from original
      return !original || 
             original.order !== task.order || 
             original.status !== task.status;
    });
    
    // Only send changed tasks to backend (typically 3-5 instead of 50+)
    const reorderData = changedTasks.map(task => ({
      id: task.id,
      status: task.status,
      order: task.order,
    }));
    
    // Use SWR mutation to update and persist
    await reorderTaskList(reorderData);
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      // Use SWR mutation to create and update cache
      await addTask(input);
    } catch (error) {
      console.error('Failed to create task:', error);
      // TODO: Show error notification
    }
  };

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Failed to load tasks. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Task Board</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={styles.createButton}
          disabled={isLoading}
        >
          + Create Task
        </button>
      </div>

      {isLoading && !initialTasks ? (
        <div className={styles.loading}>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.board}>
            {COLUMNS.map(column => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                title={column.title}
                tasks={getTasksByStatus(column.status)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
