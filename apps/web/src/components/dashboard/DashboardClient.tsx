/**
 * Dashboard Client Component
 * Client component for interactivity (logout, auth context)
 * Receives initial data from Server Component
 */

'use client';

import { useAuthContext } from '@/lib/contexts/AuthContext';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Task } from '@/types/task';
import styles from './DashboardClient.module.css';

interface DashboardClientProps {
  initialTasks: Task[];
}

export function DashboardClient({ initialTasks }: DashboardClientProps) {
  const { user, logout } = useAuthContext();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Dashboard</h1>
          <div className={styles.headerRight}>
            <span className={styles.userName}>
              {user?.firstName || 'User'}
            </span>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <KanbanBoard initialTasks={initialTasks} />
      </main>
    </div>
  );
}
