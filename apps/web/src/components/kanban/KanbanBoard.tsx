/**
 * KanbanBoard Component
 * Main board with drag-and-drop functionality
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
import { createTask, reorderTasks } from '@/lib/services/taskService';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import styles from './KanbanBoard.module.css';

const COLUMNS = [
  { status: 'TODO' as TaskStatus, title: 'Todo' },
  { status: 'IN_PROGRESS' as TaskStatus, title: 'In Progress' },
  { status: 'DONE' as TaskStatus, title: 'Done' },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
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
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === activeId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Determine final status
    const overTask = tasks.find(t => t.id === overId);
    const overColumn = COLUMNS.find(col => col.status === overId);
    
    const finalStatus = overTask?.status || overColumn?.status || activeTask.status;

    setTasks(prevTasks => {
      // Update status if changed
      let updatedTasks = prevTasks.map(task => 
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

      // Prepare data for backend (will be implemented later)
      const reorderData = updatedTasks.map(task => ({
        id: task.id,
        status: task.status,
        order: task.order,
      }));
      
      // Call service to persist (currently just logs)
      reorderTasks(reorderData);

      return updatedTasks;
    });
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      // Call service (currently returns mock data)
      const newTask = await createTask(input);
      
      // Calculate order (last position in TODO column)
      const todoTasks = getTasksByStatus('TODO');
      const maxOrder = todoTasks.length > 0 
        ? Math.max(...todoTasks.map(t => t.order))
        : -1;
      
      const taskWithOrder = {
        ...newTask,
        order: maxOrder + 1,
      };

      setTasks(prev => [...prev, taskWithOrder]);
    } catch (error) {
      console.error('Failed to create task:', error);
      // TODO: Show error notification
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Task Board</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={styles.createButton}
        >
          + Create Task
        </button>
      </div>

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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
