import { useAdmin } from '../../context/AdminContext';
import { calculateGeodesicArea } from '../../lib/geoUtils';
import { Sprout, Users, MapPin, UserCheck, Cpu } from 'lucide-react';

export function AdminStatsBar() {
  const { crops, owners, estates, employees, iotDevices, cloudConfig } = useAdmin();

  const totalAcreage = estates.reduce((acc, est) => {
    const rawCoords = est?.boundary?.coordinates?.[0] || [];
    const points = rawCoords.map((c) => ({ lat: Number(c[1]), lng: Number(c[0]) }));
    const areaSqM = calculateGeodesicArea(points);
    return acc + areaSqM / 4046.8564224;
  }, 0);

  return (
    <div className="bg-white border-b border-[#D7E6DD] px-6 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-[#D7E6DD] p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">TOTAL CROPS</span>
            <div className="text-xl font-bold text-[#1F3D2C] mt-0.5">{crops.length}</div>
            <span className="text-[10px] text-[#8C6239]">Available crops</span>
          </div>
          <div className="w-9 h-9 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <Sprout className="w-4 h-4 text-[#1F3D2C]" />
          </div>
        </div>

        <div className="bg-white border border-[#D7E6DD] p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">TOTAL OWNERS</span>
            <div className="text-xl font-bold text-[#1F3D2C] mt-0.5">{owners.length}</div>
            <span className="text-[10px] text-[#4B5563]">Registered accounts</span>
          </div>
          <div className="w-9 h-9 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <Users className="w-4 h-4 text-[#8C6239]" />
          </div>
        </div>

        <div className="bg-white border border-[#D7E6DD] p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">TOTAL ESTATES</span>
            <div className="text-xl font-bold text-[#1F3D2C] mt-0.5">{estates.length}</div>
            <span className="text-[10px] text-[#4B5563]">
              {totalAcreage.toFixed(1)} Total Acres
            </span>
          </div>
          <div className="w-9 h-9 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <MapPin className="w-4 h-4 text-[#1F3D2C]" />
          </div>
        </div>

        <div className="bg-white border border-[#D7E6DD] p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">WORKFORCE</span>
            <div className="text-xl font-bold text-[#1F3D2C] mt-0.5">{employees.length}</div>
            <span className="text-[10px] text-[#4B5563]">Active workers &amp; sups</span>
          </div>
          <div className="w-9 h-9 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <UserCheck className="w-4 h-4 text-[#8C6239]" />
          </div>
        </div>

        <div className="bg-white border border-[#D7E6DD] p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">IOT DEVICES</span>
            <div className="text-xl font-bold text-[#1F3D2C] mt-0.5">{iotDevices.length}</div>
            <span className="text-[10px] text-[#4B5563]">
              {cloudConfig?.enabled ? 'Cloud sync active' : 'Sync standby'}
            </span>
          </div>
          <div className="w-9 h-9 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <Cpu className="w-4 h-4 text-[#1F3D2C]" />
          </div>
        </div>
      </div>
    </div>
  );
}
