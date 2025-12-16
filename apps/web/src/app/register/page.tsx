/**
 * Registration page
 */

import { RegisterForm } from '@/components/auth/RegisterForm';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Sign up to get started with task management</p>
        </div>
        
        <RegisterForm />
        
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account? <a href="/login" className={styles.link}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
