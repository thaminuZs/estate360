import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from '../../router';
import { ArrowRight, UserPlus, LogIn } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 border-b border-[#D7E6DD] bg-[#F8F9FA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2">
          <Badge variant="light" className="text-xs py-1 px-3 text-[#1F3D2C]">
            Plantation Platform
          </Badge>
          <Badge variant="yellow" className="text-xs py-1 px-3">
            Estate 360
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1F3D2C] leading-tight">
          Simple Plantation &amp; Estate Management
        </h1>

        <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
          Manage land parcels, track crop harvests, and calculate worker wages with ease.
          Register as an owner to set up and manage your estates from your personal portal.
        </p>

        {/* CTAs: Only Owner Registration and Owner Login */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-[#1F3D2C] text-white hover:bg-[#162D20] gap-2 font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Owner Registration
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/login')}
            className="border-[#1F3D2C] text-[#1F3D2C] hover:bg-[#D7E6DD]/40 gap-2 font-medium"
          >
            <LogIn className="w-4 h-4" />
            Owner Login
          </Button>
        </div>

        <p className="text-xs text-[#8C6239] font-medium pt-2">
          * Estates and crops are registered inside your dashboard after logging in.
        </p>
      </div>
    </section>
  );
}
