import { OwnerLogin } from '../../components/auth/OwnerLogin';
import { Navigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';

export function OwnerLoginPage() {
  const { user } = useOwner();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <OwnerLogin />;
}
