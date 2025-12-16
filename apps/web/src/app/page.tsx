/**
 * Dashboard Page - Server Component with SSR
 * Protected by middleware - fetches initial data server-side
 * Takes advantage of Next.js App Router for better performance
 */

import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { getTasksServerSide } from '@/lib/api/server-tasks';

export default async function DashboardPage() {
  // This is a Server Component - runs on the server!
  // Middleware already verified the user is authenticated
  // We can safely fetch data here with the user's cookies
  
  // Fetch initial tasks server-side for SSR
  const initialTasks = await getTasksServerSide();
  
  // Pass initial data to client component
  // Client will use SWR for subsequent updates and caching
  return <DashboardClient initialTasks={initialTasks} />;
}

// Optional: Configure page metadata
export const metadata = {
  title: 'Dashboard | Task Manager',
  description: 'Manage your tasks with drag-and-drop',
};
