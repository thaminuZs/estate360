import { lazy, Suspense } from 'react';
import { RouterProvider, Routes, Route, Navigate } from './router';
import { OwnerProvider, useOwner } from './context/OwnerContext';
import { PublicLayout } from './layouts/PublicLayout';
import { OwnerDashboardLayout } from './layouts/OwnerDashboardLayout';
import { LandingPage } from './pages/public/LandingPage';
import { OwnerLoginPage } from './pages/public/OwnerLoginPage';
import { OwnerRegisterPage } from './pages/public/OwnerRegisterPage';
import { OwnerHomePage } from './pages/owner/OwnerHomePage';
import { OwnerEstatesPage } from './pages/owner/OwnerEstatesPage';
import { OwnerRegisterEstatePage } from './pages/owner/OwnerRegisterEstatePage';
import { OwnerWorkforcePage } from './pages/owner/OwnerWorkforcePage';
import { OwnerRegisterEmployeePage } from './pages/owner/OwnerRegisterEmployeePage';
import { OwnerPayrollsPage } from './pages/owner/OwnerPayrollsPage';

const AdminApp = lazy(() =>
  import('./components/admin/AdminApp').then((module) => ({
    default: module.AdminApp,
  })),
);

function MainRoutes() {
  const { authLoading } = useOwner();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#1F3D2C] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#4B5563] font-medium">Loading Estate 360...</p>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<OwnerLoginPage />} />
        <Route path="/register" element={<OwnerRegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <OwnerDashboardLayout>
              <OwnerHomePage />
            </OwnerDashboardLayout>
          }
        />
        <Route
          path="/dashboard/estates"
          element={
            <OwnerDashboardLayout>
              <OwnerEstatesPage />
            </OwnerDashboardLayout>
          }
        />
        <Route
          path="/dashboard/estates/new"
          element={
            <OwnerDashboardLayout>
              <OwnerRegisterEstatePage />
            </OwnerDashboardLayout>
          }
        />
        <Route
          path="/dashboard/workforce"
          element={
            <OwnerDashboardLayout>
              <OwnerWorkforcePage />
            </OwnerDashboardLayout>
          }
        />
        <Route
          path="/dashboard/workforce/new"
          element={
            <OwnerDashboardLayout>
              <OwnerRegisterEmployeePage />
            </OwnerDashboardLayout>
          }
        />
        <Route
          path="/dashboard/payrolls"
          element={
            <OwnerDashboardLayout>
              <OwnerPayrollsPage />
            </OwnerDashboardLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-[#1F3D2C] border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs text-[#4B5563] font-medium">
                      Loading Estate 360 Admin...
                    </p>
                  </div>
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-[#1F3D2C] border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs text-[#4B5563] font-medium">
                      Loading Estate 360 Admin...
                    </p>
                  </div>
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <OwnerProvider>
              <MainRoutes />
            </OwnerProvider>
          }
        />
      </Routes>
    </RouterProvider>
  );
}
