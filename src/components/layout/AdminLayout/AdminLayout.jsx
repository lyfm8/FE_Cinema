import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
