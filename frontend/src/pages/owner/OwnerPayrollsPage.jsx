import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from '../../router';
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle, Clock } from 'lucide-react';

export function OwnerPayrollsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white border border-[#D7E6DD] p-4">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="gap-1.5 border-[#1F3D2C] text-[#1F3D2C] text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#1F3D2C]">
              Payrolls &amp; Disbursements
            </h2>
            <p className="text-xs text-[#4B5563]">
              Crop piece-rates, harvest yields, and payment logs
            </p>
          </div>
        </div>
      </div>

      <Card className="border border-[#D7E6DD] bg-white">
        <CardContent className="p-10">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-12 h-12 bg-[#D7E6DD]/50 text-[#1F3D2C] flex items-center justify-center mx-auto border border-[#D7E6DD]">
              <CreditCard className="w-6 h-6 text-[#8C6239]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#1F3D2C]">
                Payroll Management Overview
              </h3>
              <p className="text-xs text-[#4B5563]">
                Piece-rate compensation, harvest production weights, and bank disbursement history.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-left">
              <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-2.5 space-y-1">
                <span className="text-[11px] font-semibold text-[#1F3D2C] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C6239]" />
                  Crop Rates
                </span>
                <p className="text-[10px] text-[#6B7280]">
                  Per-kilogram piece rates per estate.
                </p>
              </div>
              <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-2.5 space-y-1">
                <span className="text-[11px] font-semibold text-[#1F3D2C] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1F3D2C]" />
                  Harvest Wages
                </span>
                <p className="text-[10px] text-[#6B7280]">
                  Wages derived from harvest logs.
                </p>
              </div>
              <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-2.5 space-y-1">
                <span className="text-[11px] font-semibold text-[#1F3D2C] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8C6239]" />
                  Bank Logs
                </span>
                <p className="text-[10px] text-[#6B7280]">
                  Disbursement records &amp; receipts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
