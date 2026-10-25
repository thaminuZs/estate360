import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from '../../router';
import { UserPlus, MapPin, Banknote, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      icon: <UserPlus className="w-5 h-5 text-[#8C6239]" />,
      title: 'Owner Registration',
      description:
        'Create your owner account in seconds. Sign in immediately to access your portal.',
    },
    {
      step: '02',
      icon: <MapPin className="w-5 h-5 text-[#8C6239]" />,
      title: 'Add Your Estates',
      description:
        'Register your estate plots and assign crops such as tea, rubber, or coconut from your dashboard.',
    },
    {
      step: '03',
      icon: <Banknote className="w-5 h-5 text-[#8C6239]" />,
      title: 'Harvests & Wages',
      description:
        'Log daily harvest quantities and calculate worker piece-rate payouts automatically.',
    },
  ];

  return (
    <section id="how-it-works" className="py-14 bg-[#F8F9FA] border-b border-[#D7E6DD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="yellow" className="mb-2 px-2.5 py-0.5 text-xs">
            Simple 3 Steps
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3D2C] tracking-tight">
            How Estate 360 Works
          </h2>
          <p className="mt-2 text-sm text-[#4B5563]">
            Start managing your plantation lands and staff in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((item, index) => (
            <div
              key={index}
              className="p-5 bg-white border border-[#D7E6DD] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold font-mono text-[#8C6239]">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 bg-[#D7E6DD]/40 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[#1F3D2C] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#D7E6DD]/40 border border-[#D7E6DD]">
            <span className="text-sm font-medium text-[#1F3D2C]">
              Ready to get started? Register your owner account today.
            </span>
            <Button
              size="sm"
              onClick={() => navigate('/register')}
              className="bg-[#1F3D2C] text-white hover:bg-[#162D20] gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Owner Registration
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
