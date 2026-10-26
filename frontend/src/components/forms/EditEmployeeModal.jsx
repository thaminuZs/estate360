import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import {
  X,
  UserCheck,
  ShieldCheck,
  Check,
  Phone,
  MapPin,
} from 'lucide-react';

export function EditEmployeeModal({
  employee,
  estates = [],
  onClose,
  onSave,
}) {
  const currentRole = (employee?.role || 'worker').toLowerCase();
  const currentEstateId =
    employee?.estateAssignments?.[0]?.estate?.id ||
    employee?.workerAssignments?.[0]?.estate?.id ||
    '';

  const [role, setRole] = useState(currentRole);
  const [estateId, setEstateId] = useState(currentEstateId);
  const [firstName, setFirstName] = useState(employee?.firstName || '');
  const [lastName, setLastName] = useState(employee?.lastName || '');
  const [phone, setPhone] = useState(employee?.phone || '');
  const [address, setAddress] = useState(employee?.address || '');
  const [status, setStatus] = useState(employee?.status || 'active');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName.trim()) {
      setErrorMsg('First name is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        status,
        estateId: estateId || undefined,
      };

      await onSave(employee.id, payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update employee.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg rounded-none border border-[#D7E6DD] bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <CardHeader className="p-4 px-6 bg-[#1F3D2C] text-white flex flex-row items-center justify-between border-none">
          <div className="space-y-0.5">
            <CardTitle className="text-base text-white flex items-center gap-2 font-heading">
              <UserCheck className="w-4 h-4 text-[#F1C40F]" />
              <span>
                Edit Employee: {employee?.firstName} {employee?.lastName || ''}
              </span>
            </CardTitle>
            <p className="text-xs text-[#D7E6DD]">
              Code: {employee?.employeeCode} • NIC: {employee?.nic}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <Alert variant="error" className="rounded-none text-xs">
                {errorMsg}
              </Alert>
            )}

            {/* Role Toggle Cards */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1F3D2C] uppercase tracking-wider">
                Workforce Role
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`p-3 border text-left cursor-pointer transition-all flex items-center gap-2 ${
                    role === 'worker'
                      ? 'border-[#1F3D2C] bg-[#D7E6DD]/30 font-bold text-[#1F3D2C]'
                      : 'border-[#D7E6DD] bg-white text-[#4B5563] hover:border-[#1F3D2C]/40'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#1F3D2C]" />
                  <div className="text-xs">
                    <div>Field Worker</div>
                    <div className="text-[10px] text-[#6B7280] font-normal">Plucker / Harvester</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('supervisor')}
                  className={`p-3 border text-left cursor-pointer transition-all flex items-center gap-2 ${
                    role === 'supervisor'
                      ? 'border-[#1F3D2C] bg-[#D7E6DD]/30 font-bold text-[#1F3D2C]'
                      : 'border-[#D7E6DD] bg-white text-[#4B5563] hover:border-[#1F3D2C]/40'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#8C6239]" />
                  <div className="text-xs">
                    <div>Field Supervisor</div>
                    <div className="text-[10px] text-[#6B7280] font-normal">Overseer / Kangani</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-first-name" className="text-xs font-medium text-[#1F2937]">
                  First Name *
                </Label>
                <Input
                  id="edit-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-last-name" className="text-xs font-medium text-[#1F2937]">
                  Last Name
                </Label>
                <Input
                  id="edit-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>
            </div>

            {/* Estate Assignment & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-emp-estate" className="text-xs font-medium text-[#1F2937]">
                  Assigned Estate
                </Label>
                <select
                  id="edit-emp-estate"
                  value={estateId}
                  onChange={(e) => setEstateId(e.target.value)}
                  className="w-full rounded-none border border-[#D7E6DD] text-xs h-9 px-3 bg-white text-[#1F2937] focus:border-[#1F3D2C] focus:outline-none"
                >
                  <option value="">Unassigned (General Pool)</option>
                  {estates.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.name} ({est.code || 'Estate'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-emp-status" className="text-xs font-medium text-[#1F2937]">
                  Status
                </Label>
                <select
                  id="edit-emp-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-none border border-[#D7E6DD] text-xs h-9 px-3 bg-white text-[#1F2937] focus:border-[#1F3D2C] focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="left">Left</option>
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-emp-phone" className="text-xs font-medium text-[#1F2937]">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="edit-emp-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-none border-[#D7E6DD] text-xs h-9 pl-8"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#8C6239] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-emp-address" className="text-xs font-medium text-[#1F2937]">
                  Address / Division
                </Label>
                <div className="relative">
                  <Input
                    id="edit-emp-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-none border-[#D7E6DD] text-xs h-9 pl-8"
                  />
                  <MapPin className="w-3.5 h-3.5 text-[#8C6239] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D7E6DD] flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={saving}
                className="rounded-none border-[#D7E6DD] text-[#4B5563] hover:text-[#1F2937] text-xs h-8 px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-8 px-5 cursor-pointer font-medium gap-1.5"
              >
                {saving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
