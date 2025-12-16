/**
 * Dashboard Page - Protected by middleware
 * No need for 'use client' or ProtectedRoute wrapper!
 * Middleware handles authentication before this component even loads
 */

import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default function DashboardPage() {
  // This is a Server Component by default!
  // Middleware already verified the user is authenticated
  // So this page will never render for unauthenticated users
  
  return <DashboardClient />;
}
