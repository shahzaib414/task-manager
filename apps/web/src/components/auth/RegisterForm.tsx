/**
 * Registration form component
 */

'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import styles from './LoginForm.module.css';

export function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAuth();
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await register({ firstName, lastName, email, password });
    } catch (err) {
      // Error is handled in useAuth hook
      console.error('Registration failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="firstName" className={styles.label}>
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className={styles.input}
          placeholder="Enter your first name"
          autoComplete="given-name"
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="lastName" className={styles.label}>
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className={styles.input}
          placeholder="Enter your last name"
          autoComplete="family-name"
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          placeholder="Enter your password"
          autoComplete="new-password"
          disabled={isLoading}
          minLength={6}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
          placeholder="Confirm your password"
          autoComplete="new-password"
          disabled={isLoading}
          minLength={6}
        />
      </div>

      {(error || validationError) && (
        <div className={styles.error}>
          {validationError || error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
