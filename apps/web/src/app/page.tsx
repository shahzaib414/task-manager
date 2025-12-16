/**
 * Root Page - Redirects to Dashboard
 * This is the landing page that redirects authenticated users to dashboard
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard
  redirect('/dashboard');
}
