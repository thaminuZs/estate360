import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { useOwner } from '../../context/OwnerContext';
import { createOwnerEmployee } from '../../api/owner';
import {
  UserCheck,
  ShieldCheck,
  MapPin,
  IdCard,
  Phone,
  Calendar,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';

export function RegisterEmployeeForm({ onSuccess, onCancel }) {
  const { estates, reloadEmployees } = useOwner();

  const [role, setRole] = useState('worker'); // 'worker' | 'supervisor'
  const [estateId, setEstateId] = useState(estates.length > 0 ? estates[0].id : '');
  const [employeeCode, setEmployeeCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nic, setNic] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [dateJoined, setDateJoined] = useState(
    new Date().toISOString().split('T')[0],
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const generateAutoCode = () => {
    const prefix = role === 'supervisor' ? 'SUP' : 'WRK';
    const rand = Math.floor(100 + Math.random() * 900);
    setEmployeeCode(`${prefix}-${rand}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!employeeCode.trim()) {
      setErrorMsg('Employee code is required.');
      return;
    }

    if (!firstName.trim()) {
      setErrorMsg('First name is required.');
      return;
    }

    if (!nic.trim()) {
      setErrorMsg('National Identity Card (NIC) is required.');
      return;
    }

    // Basic client validation for Sri Lankan NIC
    const trimmedNic = nic.trim().toUpperCase();
    const isOldFormat = /^\d{9}[VvXx]$/.test(trimmedNic);
    const isNewFormat = /^\d{12}$/.test(trimmedNic);

    if (!isOldFormat && !isNewFormat) {
      setErrorMsg(
        'Please enter a valid Sri Lankan NIC (9 digits + V/X, e.g. 921234567V, or 12 digits, e.g. 199212345678).',
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        employeeCode: employeeCode.trim().toUpperCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        nic: trimmedNic,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        role,
        status: 'active',
        estateId: estateId || undefined,
        dateJoined: dateJoined ? new Date(dateJoined) : undefined,
        dateOfBirth: dob ? new Date(dob) : undefined,
      };

      await createOwnerEmployee(payload);
      await reloadEmployees();

      if (onSuccess) {
        onSuccess(payload);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register employee.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-none border border-[#D7E6DD] bg-white shadow-sm">
      <CardHeader className="p-5 border-b border-[#D7E6DD]/60">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-[#1F3D2C] font-heading">
              Register New Employee
            </CardTitle>
            <CardDescription className="text-xs text-[#4B5563] mt-0.5">
              Enroll field pluckers, harvesters, or supervisors into your workforce crew.
            </CardDescription>
          </div>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 text-xs gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <Alert variant="error" className="rounded-none text-xs">
              {errorMsg}
            </Alert>
          )}

          {/* 1. Role Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[#1F3D2C] uppercase tracking-wider">
              1. Select Employee Role *
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option: Worker */}
              <div
                onClick={() => setRole('worker')}
                className={`p-4 border-2 cursor-pointer transition-all flex items-start gap-3 rounded-none ${
                  role === 'worker'
                    ? 'border-[#1F3D2C] bg-[#D7E6DD]/25 shadow-xs'
                    : 'border-[#D7E6DD] bg-white hover:border-[#1F3D2C]/40'
                }`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center shrink-0 border ${
                    role === 'worker'
                      ? 'bg-[#1F3D2C] text-white border-[#1F3D2C]'
                      : 'bg-[#F8F9FA] text-[#4B5563] border-[#D7E6DD]'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1F3D2C]">
                      Field Worker
                    </span>
                    {role === 'worker' && (
                      <span className="bg-[#1F3D2C] text-white p-0.5 rounded-none">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1 leading-snug">
                    Harvest plucker, rubber tapper, field laborer, and estate hands.
                  </p>
                </div>
              </div>

              {/* Option: Supervisor */}
              <div
                onClick={() => setRole('supervisor')}
                className={`p-4 border-2 cursor-pointer transition-all flex items-start gap-3 rounded-none ${
                  role === 'supervisor'
                    ? 'border-[#1F3D2C] bg-[#D7E6DD]/25 shadow-xs'
                    : 'border-[#D7E6DD] bg-white hover:border-[#1F3D2C]/40'
                }`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center shrink-0 border ${
                    role === 'supervisor'
                      ? 'bg-[#1F3D2C] text-white border-[#1F3D2C]'
                      : 'bg-[#F8F9FA] text-[#4B5563] border-[#D7E6DD]'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1F3D2C]">
                      Field Supervisor
                    </span>
                    {role === 'supervisor' && (
                      <span className="bg-[#1F3D2C] text-white p-0.5 rounded-none">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1 leading-snug">
                    Field overseer, kangani, shift manager, and division monitor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Estate Assignment & Employee Code */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[#1F3D2C] uppercase tracking-wider">
              2. Estate Assignment &amp; Code
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="estate" className="text-xs font-medium text-[#1F2937]">
                  Assigned Estate
                </Label>
                <div className="relative">
                  <select
                    id="estate"
                    value={estateId}
                    onChange={(e) => setEstateId(e.target.value)}
                    className="w-full rounded-none border border-[#D7E6DD] text-xs h-9 px-3 bg-white text-[#1F2937] focus:border-[#1F3D2C] focus:outline-none"
                  >
                    <option value="">Unassigned (General Workforce Pool)</option>
                    {estates.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.name} ({est.code || 'Estate'}) - {est.crop?.name || 'General'}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-[11px] text-[#6B7280]">
                  Employee will be allocated to this estate upon registration.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code" className="text-xs font-medium text-[#1F2937]">
                    Employee Code *
                  </Label>
                  <button
                    type="button"
                    onClick={generateAutoCode}
                    className="text-[11px] text-[#8C6239] hover:text-[#1F3D2C] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-generate
                  </button>
                </div>
                <Input
                  id="code"
                  type="text"
                  placeholder={role === 'supervisor' ? 'e.g. SUP-101' : 'e.g. WRK-201'}
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9 uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Personal Information */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[#1F3D2C] uppercase tracking-wider">
              3. Personal Details &amp; Identification
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium text-[#1F2937]">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="e.g. Kamal"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium text-[#1F2937]">
                  Last Name (Optional)
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="e.g. Perera"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nic" className="text-xs font-medium text-[#1F2937]">
                  National Identity Card (NIC) *
                </Label>
                <div className="relative">
                  <Input
                    id="nic"
                    type="text"
                    placeholder="e.g. 199212345678 or 921234567V"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    required
                    className="rounded-none border-[#D7E6DD] text-xs h-9 uppercase font-mono pl-8"
                  />
                  <IdCard className="w-3.5 h-3.5 text-[#8C6239] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[11px] text-[#6B7280]">
                  Sri Lanka 10-character (e.g. 921234567V) or 12-character format.
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium text-[#1F2937]">
                  Contact Phone (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-none border-[#D7E6DD] text-xs h-9 pl-8"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#8C6239] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address" className="text-xs font-medium text-[#1F2937]">
                  Residential Address / Division (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="address"
                    type="text"
                    placeholder="e.g. Line 4, Upper Division, Hatton"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-none border-[#D7E6DD] text-xs h-9 pl-8"
                  />
                  <MapPin className="w-3.5 h-3.5 text-[#8C6239] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-xs font-medium text-[#1F2937]">
                  Date of Birth (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="rounded-none border-[#D7E6DD] text-xs h-9 pl-8"
                  />
                  <Calendar className="w-3.5 h-3.5 text-[#8C6239] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dateJoined" className="text-xs font-medium text-[#1F2937]">
                  Date Joined *
                </Label>
                <div className="relative">
                  <Input
                    id="dateJoined"
                    type="date"
                    value={dateJoined}
                    onChange={(e) => setDateJoined(e.target.value)}
                    required
                    className="rounded-none border-[#D7E6DD] text-xs h-9 pl-8"
                  />
                  <Calendar className="w-3.5 h-3.5 text-[#8C6239] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#D7E6DD] flex items-center justify-end space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="rounded-none border-[#D7E6DD] text-[#4B5563] hover:text-[#1F2937] text-xs h-9 px-4 cursor-pointer"
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-9 px-6 cursor-pointer font-medium gap-1.5"
            >
              {submitting ? (
                <span>Registering Employee...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    Register {role === 'supervisor' ? 'Supervisor' : 'Worker'}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
