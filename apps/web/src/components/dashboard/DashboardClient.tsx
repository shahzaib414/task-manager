/**
 * Dashboard Client Component
 * Only this component needs 'use client' for interactivity
 */

'use client';

import { useAuthContext } from '@/lib/contexts/AuthContext';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import styles from './DashboardClient.module.css';

export function DashboardClient() {
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
        <KanbanBoard />
      </main>
    </div>
  );
}
