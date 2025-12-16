/**
 * Dashboard Client Component
 * Only this component needs 'use client' for interactivity
 */

'use client';

import { useAuthContext } from '@/lib/contexts/AuthContext';
import styles from './DashboardClient.module.css';

export function DashboardClient() {
  const { user, logout } = useAuthContext();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Dashboard</h1>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <h2 className={styles.welcomeTitle}>
            Welcome back, {user?.firstName || 'User'}! 👋
          </h2>
          <p className={styles.welcomeText}>
            You're successfully logged in to your Task Manager dashboard.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>User Info</h3>
            <div className={styles.cardContent}>
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>ID:</strong> {user?.id}</p>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Quick Stats</h3>
            <div className={styles.cardContent}>
              <p>📋 Total Tasks: 0</p>
              <p>✅ Completed: 0</p>
              <p>⏳ Pending: 0</p>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Recent Activity</h3>
            <div className={styles.cardContent}>
              <p className={styles.emptyState}>No recent activity</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
