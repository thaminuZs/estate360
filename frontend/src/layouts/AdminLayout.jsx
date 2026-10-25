import { Alert } from '../components/ui/alert';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminStatsBar } from '../components/admin/AdminStatsBar';
import { AdminNavBar } from '../components/admin/AdminNavBar';
import { Navigate } from '../router';
import { useAdmin } from '../context/AdminContext';
import { X } from 'lucide-react';

export function AdminLayout({ children }) {
  const { adminUser, token, authLoading, feedbackMsg, setFeedbackMsg } = useAdmin();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#1F3D2C] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#4B5563] font-medium">Loading Estate 360 Admin...</p>
        </div>
      </div>
    );
  }

  if (!adminUser || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937] flex flex-col font-sans">
      <AdminHeader />
      <AdminStatsBar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {feedbackMsg.text && (
          <Alert
            variant={feedbackMsg.type === 'error' ? 'error' : 'success'}
            className="rounded-none text-xs flex items-center justify-between"
          >
            <span>{feedbackMsg.text}</span>
            <button
              type="button"
              onClick={() => setFeedbackMsg({ type: '', text: '' })}
              className="ml-4 hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </Alert>
        )}

        <AdminNavBar />

        {children}
      </main>
    </div>
  );
}
