import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Users, Coins } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <MapPin className="w-5 h-5 text-[#8C6239]" />,
      badge: 'Land & Crops',
      title: 'Estates & Crops',
      description:
        'Keep all your plantation land plots, boundaries, and cultivated crops organized in one unified record.',
    },
    {
      icon: <Users className="w-5 h-5 text-[#8C6239]" />,
      badge: 'Workforce',
      title: 'Workforce & Harvest',
      description:
        'Track daily field staff, assign supervisors, and log daily crop harvest quantities directly from the field.',
    },
    {
      icon: <Coins className="w-5 h-5 text-[#8C6239]" />,
      badge: 'Payments',
      title: 'Simple Payroll',
      description:
        'Calculate worker wages and piece-rate payments automatically with clear summary records.',
    },
  ];

  return (
    <section id="features" className="py-14 bg-[#F8F9FA] border-b border-[#D7E6DD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="yellow" className="mb-2 px-2.5 py-0.5 text-xs">
            What Estate 360 Does
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3D2C] tracking-tight">
            Simple Tools for Estate Owners
          </h2>
          <p className="mt-2 text-sm text-[#4B5563]">
            Everything you need to manage your plantation and staff without complicated software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="border border-[#D7E6DD] bg-white p-2"
            >
              <CardHeader className="border-b-0 space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 bg-[#D7E6DD]/50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <Badge variant="light" className="text-[11px] text-[#1F3D2C]">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base text-[#1F3D2C]">{feature.title}</CardTitle>
                <CardDescription className="text-xs text-[#4B5563] leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
