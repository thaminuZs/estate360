import { Routes, Route, Navigate } from '../../router';
import { AdminProvider } from '../../context/AdminContext';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminLoginPage } from '../../pages/admin/AdminLoginPage';
import { AdminCropsPage } from '../../pages/admin/AdminCropsPage';
import { AdminOwnersPage } from '../../pages/admin/AdminOwnersPage';
import { AdminEstatesPage } from '../../pages/admin/AdminEstatesPage';
import { AdminEmployeesPage } from '../../pages/admin/AdminEmployeesPage';
import { AdminIotPage } from '../../pages/admin/AdminIotPage';
import { AdminUsersPage } from '../../pages/admin/AdminUsersPage';

export function AdminApp() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/crops"
          element={
            <AdminLayout>
              <AdminCropsPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/owners"
          element={
            <AdminLayout>
              <AdminOwnersPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/estates"
          element={
            <AdminLayout>
              <AdminEstatesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <AdminLayout>
              <AdminEmployeesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/iot"
          element={
            <AdminLayout>
              <AdminIotPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/admins"
          element={
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/crops" replace />} />
        <Route path="*" element={<Navigate to="/admin/crops" replace />} />
      </Routes>
    </AdminProvider>
  );
}
