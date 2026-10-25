import { NavLink } from '../../router';
import { useAdmin } from '../../context/AdminContext';
import { Sprout, Users, MapPin, UserCheck, Cpu, UserPlus } from 'lucide-react';

export function AdminNavBar() {
  const { crops, owners, estates, employees, iotDevices } = useAdmin();

  const navItemClass = ({ isActive }) =>
    `px-4 py-2 border cursor-pointer transition-colors ${
      isActive
        ? 'bg-[#1F3D2C] border-[#1F3D2C] text-white'
        : 'bg-white border-[#D7E6DD] text-[#4B5563] hover:bg-[#D7E6DD]/30'
    }`;

  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-[#D7E6DD] pb-3 text-xs font-medium">
      <NavLink to="/admin/crops" className={navItemClass}>
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4" />
          <span>Crops &amp; Payment Rates</span>
          <span className="px-1.5 py-0.2 bg-black/10 text-[11px] rounded-xs">
            {crops.length}
          </span>
        </div>
      </NavLink>

      <NavLink to="/admin/owners" className={navItemClass}>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Owners Directory</span>
          <span className="px-1.5 py-0.2 bg-black/10 text-[11px] rounded-xs">
            {owners.length}
          </span>
        </div>
      </NavLink>

      <NavLink to="/admin/estates" className={navItemClass}>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>All Estates</span>
          <span className="px-1.5 py-0.2 bg-black/10 text-[11px] rounded-xs">
            {estates.length}
          </span>
        </div>
      </NavLink>

      <NavLink to="/admin/employees" className={navItemClass}>
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          <span>Workforce (Employees)</span>
          <span className="px-1.5 py-0.2 bg-black/10 text-[11px] rounded-xs">
            {employees.length}
          </span>
        </div>
      </NavLink>

      <NavLink to="/admin/iot" className={navItemClass}>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          <span>IoT Devices</span>
          <span className="px-1.5 py-0.2 bg-black/10 text-[11px] rounded-xs">
            {iotDevices.length}
          </span>
        </div>
      </NavLink>

      <NavLink to="/admin/admins" className={navItemClass}>
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          <span>Admins</span>
        </div>
      </NavLink>
    </nav>
  );
}
