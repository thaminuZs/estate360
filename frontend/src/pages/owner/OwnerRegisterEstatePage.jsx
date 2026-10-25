import { Button } from '../../components/ui/button';
import { RegisterEstateForm } from '../../components/forms/RegisterEstateForm';
import { useNavigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';
import { ArrowLeft } from 'lucide-react';

export function OwnerRegisterEstatePage() {
  const navigate = useNavigate();
  const { crops, refreshOwnerData, setSuccessMsg } = useOwner();

  const handleSuccess = async (createdEstate) => {
    setSuccessMsg(
      `Estate "${createdEstate.name || 'New Estate'}" (${createdEstate.code || ''}) successfully registered!`,
    );
    await refreshOwnerData();
    navigate('/dashboard/estates');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white border border-[#D7E6DD] p-4">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/dashboard/estates')}
            className="gap-1.5 border-[#1F3D2C] text-[#1F3D2C] text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Estates
          </Button>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#1F3D2C]">
              Register New Estate
            </h2>
            <p className="text-xs text-[#4B5563]">
              Pinpoint boundary locations on the Sri Lanka OpenStreetMap or enter coordinates manually
            </p>
          </div>
        </div>
      </div>

      <RegisterEstateForm
        crops={crops}
        onSuccess={handleSuccess}
        onCancel={() => navigate('/dashboard/estates')}
      />
    </div>
  );
}
