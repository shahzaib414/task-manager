/**
 * Login page
 */

import { LoginForm } from '@/components/auth/LoginForm';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account to continue</p>
        </div>
        
        <LoginForm />
        
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don&apos;t have an account? <a href="/register" className={styles.link}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
