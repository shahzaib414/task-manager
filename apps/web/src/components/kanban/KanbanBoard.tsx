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
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { useTasks, useTaskOperations } from '@/lib/hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { TaskViewModal } from './TaskViewModal';
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
  const { tasks, isLoading, isError } = useTasks(initialTasks);
  const { addTask, modifyTask, removeTask, reorderTaskList, updateTasksOptimistic } = useTaskOperations();
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    const originalStatus = activeTask.status; // Original status before any optimistic updates

    // Determine final status
    const overTask = tasks.find(t => t.id === overId);
    const overColumn = COLUMNS.find(col => col.status === overId);
    
    const finalStatus = overTask?.status || overColumn?.status || originalStatus;

    const statusChanged = originalStatus !== finalStatus;
    
    setActiveTask(null);

    if (statusChanged) {
      if (overTask) { 
        const targetColumnTasks = tasks
          .filter(task => task.status === finalStatus)
          .sort((a, b) => a.order - b.order);
        
        const dropIndex = targetColumnTasks.findIndex(t => t.id === overId);
        
        if (dropIndex !== -1) {
          const newColumnTasks = [
            ...targetColumnTasks.slice(0, dropIndex),
            { ...activeTask, status: finalStatus, order: dropIndex },
            ...targetColumnTasks.slice(dropIndex),
          ];
          
          const reorderedWithNewOrder = newColumnTasks.map((task, index) => ({
            id: task.id,
            status: finalStatus,
            order: index,
          }));
          
          await reorderTaskList(reorderedWithNewOrder);
        } else {
          await modifyTask(activeId, { status: finalStatus });
        }
      } else {
        await modifyTask(activeId, { status: finalStatus });
      }
      return;
    }

    if (!statusChanged && overTask && activeId !== overId) {
      const columnTasks = tasks
        .filter(task => task.status === finalStatus)
        .sort((a, b) => a.order - b.order);

      const oldIndex = columnTasks.findIndex(t => t.id === activeId);
      const newIndex = columnTasks.findIndex(t => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
        
        const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
          ...task,
          order: index,
        }));

        const changedTasks = tasksWithNewOrder.filter(newTask => {
          const originalTask = columnTasks.find(t => t.id === newTask.id);
          return originalTask && originalTask.order !== newTask.order;
        });
        
        if (changedTasks.length > 0) {
          const reorderData = changedTasks.map(task => ({
            id: task.id,
            status: task.status,
            order: task.order,
          }));
          
          await reorderTaskList(reorderData);
        }
      }
    }
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      await addTask(input);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await removeTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId: string, input: UpdateTaskInput) => {
    try {
      await modifyTask(taskId, input);
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error; // Re-throw to let modal handle the error
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
                onViewTask={handleViewTask}
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

      <TaskViewModal
        isOpen={isViewModalOpen}
        taskId={selectedTaskId}
        onClose={handleCloseViewModal}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}
