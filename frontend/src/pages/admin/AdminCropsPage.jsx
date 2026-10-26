import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { CropFormCard } from '../../components/admin/CropFormCard';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { createCrop, updateCrop, deleteCrop } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import {
  Sprout,
  Plus,
  Sparkles,
  Search,
  Check,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

export function AdminCropsPage() {
  const {
    token,
    crops,
    setLoading,
    setFeedbackMsg,
    reloadCrops,
  } = useAdmin();

  const [showAddCrop, setShowAddCrop] = useState(false);
  const [cropSearch, setCropSearch] = useState('');
  const [editingCropId, setEditingCropId] = useState(null);
  const [editFactorVal, setEditFactorVal] = useState('');
  const [editDescVal, setEditDescVal] = useState('');
  const [deletingCrop, setDeletingCrop] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreateCrop = async (cropData) => {
    if (!cropData.name?.trim() || !cropData.code?.trim() || !cropData.paymentFactor) {
      setFeedbackMsg({
        type: 'error',
        text: 'Please enter crop name, code, and payment rate.',
      });
      return false;
    }

    try {
      await createCrop(token, cropData);
      setFeedbackMsg({
        type: 'success',
        text: `Crop "${cropData.name.trim()}" added with rate Rs. ${cropData.paymentFactor}/kg.`,
      });
      setShowAddCrop(false);
      await reloadCrops();
      return true;
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to add crop.',
      });
      return false;
    }
  };

  const handleUpdateCropFactor = async (cropId) => {
    if (!editFactorVal || isNaN(editFactorVal) || Number(editFactorVal) <= 0) {
      setFeedbackMsg({
        type: 'error',
        text: 'Payment rate must be a positive number.',
      });
      return;
    }

    try {
      await updateCrop(token, cropId, {
        paymentFactor: parseFloat(editFactorVal),
        description: editDescVal,
      });

      setFeedbackMsg({
        type: 'success',
        text: `Payment rate updated to Rs. ${Number(editFactorVal).toFixed(2)}/kg.`,
      });
      setEditingCropId(null);
      await reloadCrops();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to update payment rate.',
      });
    }
  };

  const handleConfirmDeleteCrop = async () => {
    if (!deletingCrop) return;
    setDeleteLoading(true);
    try {
      await deleteCrop(token, deletingCrop.id);
      setFeedbackMsg({
        type: 'success',
        text: `Crop "${deletingCrop.name}" was deleted.`,
      });
      setDeletingCrop(null);
      await reloadCrops();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to delete crop. It might be used by existing estates.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSeedPresets = async () => {
    const presets = [
      {
        name: 'Ceylon Black Tea',
        code: 'TEA_BOP',
        paymentFactor: 185.0,
        description: 'Standard Ceylon tea harvest',
      },
      {
        name: 'Natural Rubber',
        code: 'RUBBER_L1',
        paymentFactor: 320.0,
        description: 'Latex harvest yield',
      },
      {
        name: 'Coconut',
        code: 'COCONUT_TX',
        paymentFactor: 85.0,
        description: 'Commercial coconut harvest',
      },
      {
        name: 'Ceylon Cinnamon',
        code: 'CINNAMON_ALBA',
        paymentFactor: 1450.0,
        description: 'Export quality cinnamon quills',
      },
      {
        name: 'Black Pepper',
        code: 'PEPPER_GR1',
        paymentFactor: 680.0,
        description: 'Sun-dried spice harvest',
      },
    ];

    try {
      setLoading(true);
      let count = 0;
      for (const p of presets) {
        const exists = crops.some(
          (c) =>
            c.code?.toUpperCase() === p.code ||
            c.name?.toLowerCase() === p.name.toLowerCase(),
        );
        if (!exists) {
          await createCrop(token, p);
          count++;
        }
      }
      setFeedbackMsg({
        type: 'success',
        text: `Added ${count} standard Sri Lankan crops.`,
      });
      await reloadCrops();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to add standard crops.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(
    (c) =>
      c.name?.toLowerCase().includes(cropSearch.toLowerCase()) ||
      c.code?.toLowerCase().includes(cropSearch.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="bg-white border border-[#D7E6DD] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#1F3D2C] flex items-center gap-2 font-heading">
            <Sprout className="w-5 h-5 text-[#1F3D2C]" />
            <span>Crops &amp; Payment Rates</span>
          </h2>
          <p className="text-xs text-[#4B5563] mt-0.5">
            Set crops and payment rates per kilogram. Owners will see and select from these crops when registering an estate.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowAddCrop(!showAddCrop)}
            size="sm"
            className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-9 px-4 gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showAddCrop ? 'Cancel' : 'Add New Crop'}
          </Button>

          {crops.length === 0 && (
            <Button
              onClick={handleSeedPresets}
              variant="outline"
              size="sm"
              className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 text-xs h-9 px-4 gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8C6239]" />
              Add Standard LK Crops
            </Button>
          )}
        </div>
      </div>

      {/* Add Crop Form */}
      {showAddCrop && (
        <CropFormCard
          onSubmit={handleCreateCrop}
          onCancel={() => setShowAddCrop(false)}
        />
      )}

      {/* Search Filter */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search crops..."
            value={cropSearch}
            onChange={(e) => setCropSearch(e.target.value)}
            className="rounded-none pl-9 border-[#D7E6DD] text-xs h-8 bg-white"
          />
        </div>
        <span className="text-xs text-[#4B5563]">
          {filteredCrops.length} {filteredCrops.length === 1 ? 'crop' : 'crops'}
        </span>
      </div>

      {/* Crops Table */}
      <div className="border border-[#D7E6DD] bg-white overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#D7E6DD] bg-[#F8F9FA] text-[#1F3D2C] font-semibold">
              <th className="p-3">Crop Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Payment Rate</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7E6DD]/60">
            {filteredCrops.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-[#4B5563]">
                  No crops added yet. Click &quot;Add New Crop&quot; or &quot;Add Standard LK Crops&quot;.
                </td>
              </tr>
            ) : (
              filteredCrops.map((crop) => {
                const isEditing = editingCropId === crop.id;

                return (
                  <tr key={crop.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-3 font-semibold text-[#1F3D2C]">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-[#1F3D2C] shrink-0" />
                        <span>{crop.name}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="bg-[#D7E6DD]/40 border border-[#D7E6DD] px-2 py-0.5 text-[#1F3D2C] font-mono text-[11px]">
                        {crop.code}
                      </span>
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[#4B5563]">Rs.</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={editFactorVal}
                            onChange={(e) => setEditFactorVal(e.target.value)}
                            className="rounded-none w-24 h-7 text-xs border-[#1F3D2C] font-bold text-[#1F3D2C]"
                          />
                          <span className="text-[#4B5563]">/kg</span>
                        </div>
                      ) : (
                        <Badge variant="yellow" className="text-xs font-semibold">
                          Rs. {Number(crop.paymentFactor).toFixed(2)} / kg
                        </Badge>
                      )}
                    </td>

                    <td className="p-3 text-[#4B5563] max-w-xs truncate">
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editDescVal}
                          onChange={(e) => setEditDescVal(e.target.value)}
                          className="rounded-none h-7 text-xs border-[#D7E6DD]"
                          placeholder="Description"
                        />
                      ) : (
                        crop.description || <span className="italic text-[#9CA3AF]">None</span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateCropFactor(crop.id)}
                            className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white h-7 px-2.5 text-xs cursor-pointer gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingCropId(null)}
                            className="rounded-none text-[#4B5563] hover:text-[#1F2937] h-7 px-2 text-xs cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCropId(crop.id);
                              setEditFactorVal(String(crop.paymentFactor));
                              setEditDescVal(crop.description || '');
                            }}
                            className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 h-7 px-2 text-xs cursor-pointer gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingCrop(crop)}
                            className="rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs cursor-pointer gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Crop Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingCrop)}
        title="Delete Crop"
        description={
          <div>
            <p>
              Are you sure you want to delete crop{' '}
              <strong className="text-[#1F2937]">"{deletingCrop?.name}"</strong> ({deletingCrop?.code})?
            </p>
            <p className="mt-2 text-[11px] text-[#6B7280]">
              If any estates or payroll items reference this crop, deletion may fail.
            </p>
          </div>
        }
        confirmText="Delete Crop"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleConfirmDeleteCrop}
        onCancel={() => {
          if (!deleteLoading) setDeletingCrop(null);
        }}
      />
    </div>
  );
}
