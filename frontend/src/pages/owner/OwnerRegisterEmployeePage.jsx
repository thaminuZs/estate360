import { RegisterEmployeeForm } from '../../components/forms/RegisterEmployeeForm';
import { Button } from '../../components/ui/button';
import { useNavigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';
import { ArrowLeft, Users } from 'lucide-react';

export function OwnerRegisterEmployeePage() {
  const navigate = useNavigate();
  const { setSuccessMsg, setErrorMsg } = useOwner();

  const handleSuccess = (employeeData) => {
    setErrorMsg('');
    setSuccessMsg(
      `Successfully registered ${employeeData.role === 'supervisor' ? 'supervisor' : 'worker'} "${employeeData.firstName}" (${employeeData.employeeCode}).`,
    );
    navigate('/dashboard/workforce');
  };

  const handleCancel = () => {
    navigate('/dashboard/workforce');
  };

  return (
    <div className="space-y-5">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#D7E6DD] p-4">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="gap-1.5 border-[#1F3D2C] text-[#1F3D2C] text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Workforce Crew
          </Button>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#1F3D2C] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8C6239]" />
              <span>Enroll New Workforce Member</span>
            </h2>
            <p className="text-xs text-[#4B5563]">
              Add a new field worker or supervisor under your estate operations
            </p>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <RegisterEmployeeForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
