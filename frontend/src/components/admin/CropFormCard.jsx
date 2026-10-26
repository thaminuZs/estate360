import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function CropFormCard({ onSubmit, onCancel }) {
  const [cropName, setCropName] = useState('');
  const [cropCode, setCropCode] = useState('');
  const [cropFactor, setCropFactor] = useState('');
  const [cropDesc, setCropDesc] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({
      name: cropName,
      code: cropCode,
      paymentFactor: parseFloat(cropFactor),
      description: cropDesc,
    });
    if (ok) {
      setCropName('');
      setCropCode('');
      setCropFactor('');
      setCropDesc('');
    }
  };

  return (
    <Card className="rounded-none border border-[#D7E6DD] bg-white shadow-xs">
      <CardHeader className="p-4 border-b border-[#D7E6DD]/60">
        <CardTitle className="text-sm font-bold text-[#1F3D2C]">
          Add New Crop
        </CardTitle>
        <CardDescription className="text-xs text-[#4B5563]">
          Enter the crop name, code, and default payment rate in rupees per kilogram.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#1F2937]">
              Crop Name *
            </Label>
            <Input
              type="text"
              placeholder="e.g. Ceylon Black Tea"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              required
              className="rounded-none border-[#D7E6DD] text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#1F2937]">
              Crop Code *
            </Label>
            <Input
              type="text"
              placeholder="e.g. TEA_BOP"
              value={cropCode}
              onChange={(e) => setCropCode(e.target.value)}
              required
              className="rounded-none border-[#D7E6DD] text-xs h-9 uppercase"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#1F2937]">
              Payment Rate (Rs / kg) *
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="185.00"
              value={cropFactor}
              onChange={(e) => setCropFactor(e.target.value)}
              required
              className="rounded-none border-[#D7E6DD] text-xs h-9 font-bold text-[#1F3D2C]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#1F2937]">
              Description (Optional)
            </Label>
            <Input
              type="text"
              placeholder="e.g. Standard export grade"
              value={cropDesc}
              onChange={(e) => setCropDesc(e.target.value)}
              className="rounded-none border-[#D7E6DD] text-xs h-9"
            />
          </div>

          <div className="md:col-span-4 flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="rounded-none text-[#4B5563] hover:text-[#1F2937] text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs px-5 cursor-pointer"
            >
              Save Crop
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
