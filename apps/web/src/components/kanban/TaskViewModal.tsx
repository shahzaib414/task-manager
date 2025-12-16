/**
 * TaskViewModal Component
 * Modal for viewing task details
 */

'use client';

import { useEffect, useState } from 'react';
import { Task, UpdateTaskInput, TaskStatus } from '@/types/task';
import { getTask, deleteTask } from '@/lib/api/tasks';
import styles from './TaskModal.module.css';

interface TaskViewModalProps {
  isOpen: boolean;
  taskId: string | null;
  onClose: () => void;
  onDelete?: (taskId: string) => Promise<void>;
  onUpdate?: (taskId: string, input: UpdateTaskInput) => Promise<void>;
}

export function TaskViewModal({ isOpen, taskId, onClose, onDelete, onUpdate }: TaskViewModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<TaskStatus>('TODO');

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);

    try {
      const taskData = await getTask(taskId);
      setTask(taskData);
      // Initialize edit form with current task data
      setEditTitle(taskData.title);
      setEditDescription(taskData.description || '');
      setEditStatus(taskData.status);
    } catch (err) {
      console.error('Failed to fetch task details:', err);
      setError('Failed to load task details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTask(null);
    setError(null);
    setIsDeleting(false);
    setIsEditing(false);
    setIsSaving(false);
    onClose();
  };

  const handleEdit = () => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description || '');
      setEditStatus(task.status);
      setIsEditing(true);
      setError(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!taskId || !onUpdate) return;

    if (!editTitle.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updateData: UpdateTaskInput = {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        status: editStatus,
      };

      await onUpdate(taskId, updateData);
      
      // Refresh task data
      await fetchTaskDetails();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!taskId || !onDelete) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this task? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(taskId);
      handleClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Task Details</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {isLoading && (
            <div className={styles.loading}>
              <p>Loading task details...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && task && (
            <>
              {isEditing ? (
                // Edit Mode
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="edit-title" className={styles.label}>
                      Title <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className={styles.input}
                      placeholder="Enter task title"
                      disabled={isSaving}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-description" className={styles.label}>
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={styles.textarea}
                      placeholder="Enter task description (optional)"
                      rows={4}
                      disabled={isSaving}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-status" className={styles.label}>
                      Status
                    </label>
                    <select
                      id="edit-status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                      className={styles.select}
                      disabled={isSaving}
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Title</label>
                    <div className={styles.viewField}>
                      {task.title}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <div className={styles.viewField}>
                      {task.description || <span className={styles.emptyText}>No description</span>}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Status</label>
                    <div className={styles.viewField}>
                      <span className={styles.statusBadge} data-status={task.status}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Created</label>
                    <div className={styles.viewField}>
                      {new Date(task.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {task.updatedAt !== task.createdAt && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Last Updated</label>
                      <div className={styles.viewField}>
                        {new Date(task.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            // Edit Mode Actions
            <>
              <button
                onClick={handleCancelEdit}
                className={styles.cancelButton}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={styles.submitButton}
                disabled={isSaving || !editTitle.trim()}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            // View Mode Actions
            <>
              {onDelete && task && (
                <button
                  onClick={handleDelete}
                  className={styles.deleteButton}
                  disabled={isDeleting || isLoading}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
              {onUpdate && task && (
                <button
                  onClick={handleEdit}
                  className={styles.editButton}
                  disabled={isLoading}
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleClose}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
