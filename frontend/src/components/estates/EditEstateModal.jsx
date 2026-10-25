import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { X, MapPin, Check } from 'lucide-react';

export function EditEstateModal({ estate, crops = [], owners = [], onClose, onSave }) {
  const [name, setName] = useState(estate?.name || '');
  const [code, setCode] = useState(estate?.code || '');
  const [cropId, setCropId] = useState(estate?.crop?.id || '');
  const [ownerId, setOwnerId] = useState(estate?.owner?.id || '');
  const [status, setStatus] = useState(estate?.status || 'active');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Estate name is required.');
      return;
    }
    if (!code.trim()) {
      setErrorMsg('Estate code is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        cropId: cropId || undefined,
        status,
      };

      if (owners.length > 0 && ownerId) {
        payload.ownerId = ownerId;
      }

      await onSave(estate.id, payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update estate.');
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
              <MapPin className="w-4 h-4 text-[#F1C40F]" />
              <span>Edit Estate: {estate?.name}</span>
            </CardTitle>
            <p className="text-xs text-[#D7E6DD]">
              Update plantation name, code, crop assignment, or operational status.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-estate-name" className="text-xs font-medium text-[#1F2937]">
                  Estate Name *
                </Label>
                <Input
                  id="edit-estate-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-estate-code" className="text-xs font-medium text-[#1F2937]">
                  Estate Code *
                </Label>
                <Input
                  id="edit-estate-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-9 uppercase font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-estate-crop" className="text-xs font-medium text-[#1F2937]">
                  Assigned Crop
                </Label>
                <select
                  id="edit-estate-crop"
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value)}
                  className="w-full rounded-none border border-[#D7E6DD] text-xs h-9 px-3 bg-white text-[#1F2937] focus:border-[#1F3D2C] focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}) - Rs. {Number(c.paymentFactor || 0).toFixed(2)}/kg
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-estate-status" className="text-xs font-medium text-[#1F2937]">
                  Operational Status
                </Label>
                <select
                  id="edit-estate-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-none border border-[#D7E6DD] text-xs h-9 px-3 bg-white text-[#1F2937] focus:border-[#1F3D2C] focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {owners.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="edit-estate-owner" className="text-xs font-medium text-[#1F2937]">
                  Assigned Owner
                </Label>
                <select
                  id="edit-estate-owner"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full rounded-none border border-[#D7E6DD] text-xs h-9 px-3 bg-white text-[#1F2937] focus:border-[#1F3D2C] focus:outline-none"
                >
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>
            )}

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
