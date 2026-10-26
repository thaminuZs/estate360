import { AdminLogin } from '../../components/admin/AdminLogin';
import { Navigate, useNavigate } from '../../router';
import { useAdmin } from '../../context/AdminContext';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminUser, token, authLoading, onLoginSuccess } = useAdmin();

  if (!authLoading && adminUser && token) {
    return <Navigate to="/admin/crops" replace />;
  }

  const handleSuccess = (user) => {
    onLoginSuccess(user);
    navigate('/admin/crops');
  };

  return (
    <AdminLogin
      onLoginSuccess={handleSuccess}
      onExit={() => navigate('/')}
    />
  );
}
