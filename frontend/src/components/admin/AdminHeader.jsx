import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from '../../router';
import { useAdmin } from '../../context/AdminContext';
import { Trees, RefreshCw, LogOut } from 'lucide-react';

export function AdminHeader() {
  const navigate = useNavigate();
  const { adminUser, loading, refreshAdminData, onLogout } = useAdmin();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-[#1F3D2C] text-white px-6 py-3.5 sticky top-0 z-40 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-white">
          <Trees className="w-5 h-5 text-[#D7E6DD]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">
              Estate 360
            </span>
            <Badge variant="yellow" className="text-xs">
              Admin
            </Badge>
          </div>
          <p className="text-xs text-[#D7E6DD]/90">
            Administrator Dashboard
          </p>
        </div>
      </div>

      {/* Admin Details & Actions */}
      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-2 text-xs bg-white/10 px-3 py-1.5 text-white">
          <span className="text-[#D7E6DD]">Logged in as:</span>
          <span className="font-semibold text-white">{adminUser?.email}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshAdminData}
          disabled={loading}
          className="border-white/30 text-white hover:bg-white/10 h-8 text-xs gap-1.5 cursor-pointer bg-transparent"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <Button
          size="sm"
          onClick={handleLogoutClick}
          className="bg-white/10 hover:bg-red-800 text-white border border-white/20 h-8 text-xs gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
