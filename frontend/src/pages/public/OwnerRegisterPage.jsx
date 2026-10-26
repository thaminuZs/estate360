import { OwnerRegister } from '../../components/auth/OwnerRegister';
import { Navigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';

export function OwnerRegisterPage() {
  const { user } = useOwner();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <OwnerRegister />;
}
