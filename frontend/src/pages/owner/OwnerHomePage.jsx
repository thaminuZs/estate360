import { Badge } from '../../components/ui/badge';
import { useNavigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';
import { MapPin, Users, CreditCard, ArrowRight } from 'lucide-react';

export function OwnerHomePage() {
  const navigate = useNavigate();
  const { estates, employees, setErrorMsg, setSuccessMsg } = useOwner();

  const handleNavigate = (path) => {
    setErrorMsg('');
    setSuccessMsg('');
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#4B5563]">
        Select a module card below to open its dedicated management page:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card Menu 1: Registered Estates */}
        <div
          onClick={() => handleNavigate('/dashboard/estates')}
          className="bg-white border-2 border-[#D7E6DD] hover:border-[#1F3D2C] p-6 flex flex-col justify-between transition-all cursor-pointer group shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
                <MapPin className="w-5 h-5 text-[#8C6239]" />
              </div>
              <Badge variant="yellow" className="text-xs">
                {estates.length} {estates.length === 1 ? 'Estate' : 'Estates'}
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-[#1F3D2C] group-hover:text-[#162D20]">
                Registered Estates
              </h2>
              <p className="mt-1.5 text-xs text-[#4B5563] leading-relaxed">
                View all your registered estates, inspect boundary polygons on OpenStreetMap, and register new estates.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D7E6DD] flex items-center justify-between text-xs font-bold text-[#1F3D2C] group-hover:text-[#162D20]">
            <span>Open Estates &amp; Registration</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card Menu 2: Workforce Crew */}
        <div
          onClick={() => handleNavigate('/dashboard/workforce')}
          className="bg-white border-2 border-[#D7E6DD] hover:border-[#1F3D2C] p-6 flex flex-col justify-between transition-all cursor-pointer group shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
                <Users className="w-5 h-5 text-[#8C6239]" />
              </div>
              <Badge variant="yellow" className="text-xs">
                {employees.length} {employees.length === 1 ? 'Member' : 'Members'}
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-[#1F3D2C] group-hover:text-[#162D20]">
                Workforce Crew
              </h2>
              <p className="mt-1.5 text-xs text-[#4B5563] leading-relaxed">
                Oversee field workers, pluckers, supervisors, daily shift attendance, and estate labor assignments.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D7E6DD] flex items-center justify-between text-xs font-bold text-[#1F3D2C] group-hover:text-[#162D20]">
            <span>Open Workforce Crew</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card Menu 3: Payrolls */}
        <div
          onClick={() => handleNavigate('/dashboard/payrolls')}
          className="bg-white border-2 border-[#D7E6DD] hover:border-[#1F3D2C] p-6 flex flex-col justify-between transition-all cursor-pointer group shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
                <CreditCard className="w-5 h-5 text-[#8C6239]" />
              </div>
              <Badge variant="light" className="text-xs text-[#1F3D2C]">
                Finance
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-[#1F3D2C] group-hover:text-[#162D20]">
                Payrolls
              </h2>
              <p className="mt-1.5 text-xs text-[#4B5563] leading-relaxed">
                Configure estate crop piece-rates, review harvest yield summaries, and manage bank disbursements.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D7E6DD] flex items-center justify-between text-xs font-bold text-[#1F3D2C] group-hover:text-[#162D20]">
            <span>Open Payrolls</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
