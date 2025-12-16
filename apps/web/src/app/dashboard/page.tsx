/**
 * Dashboard Page - Server Component with SSR
 * Protected by middleware - fetches initial data server-side
 * Main dashboard for authenticated users
 */

import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { getTasksServerSide } from '@/lib/api/server-tasks';

export default async function DashboardPage() {
  // Fetch initial tasks server-side for SSR
  const initialTasks = await getTasksServerSide();
  
  // Pass initial data to client component
  return <DashboardClient initialTasks={initialTasks} />;
}

// Page metadata
export const metadata = {
  title: 'Dashboard | Task Manager',
  description: 'Manage your tasks with drag-and-drop',
};
