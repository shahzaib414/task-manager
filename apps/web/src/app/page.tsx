import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Task Manager</h1>
      <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
        Welcome to the Task Manager application!
      </p>
      <Link 
        href="/login" 
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '500',
          textDecoration: 'none',
        }}
      >
        Go to Login
      </Link>
    </main>
  )
}
