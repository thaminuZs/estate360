import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert } from '../components/ui/alert';
import { Navigate, useNavigate } from '../router';
import { useOwner } from '../context/OwnerContext';
import { RefreshCw, Layers } from 'lucide-react';

export function OwnerDashboardLayout({ children }) {
  const navigate = useNavigate();
  const {
    user,
    authLoading,
    loadingData,
    errorMsg,
    successMsg,
    refreshOwnerData,
  } = useOwner();

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FA] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Owner Session Header */}
        <div className="bg-white border border-[#D7E6DD] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="yellow" className="text-xs">
                OWNER SESSION
              </Badge>
              <Badge variant="light" className="text-xs text-[#1F3D2C]">
                Estate 360
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-[#1F3D2C]">
              Welcome, {user?.name || user?.email || 'Estate Owner'}
            </h1>
            <p className="text-xs text-[#4B5563]">{user?.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={refreshOwnerData}
              disabled={loadingData}
              className="gap-1.5 border-[#1F3D2C] text-[#1F3D2C]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/')}
              className="gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Public Overview
            </Button>
          </div>
        </div>

        {errorMsg && (
          <Alert variant="error" title="Notice">
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert variant="success" title="Success">
            {successMsg}
          </Alert>
        )}

        {children}
      </div>
    </div>
  );
}
