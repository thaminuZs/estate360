import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { EstatesOverviewMap } from '../../components/estates/EstatesOverviewMap';
import { EstateListCard } from '../../components/estates/EstateListCard';
import { EditEstateModal } from '../../components/estates/EditEstateModal';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { useNavigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';
import { updateOwnerEstate, deleteOwnerEstate } from '../../api/owner';
import { MapPin, Plus, List, Map as MapIcon, ArrowLeft } from 'lucide-react';

export function OwnerEstatesPage() {
  const navigate = useNavigate();
  const { estates, crops, reloadEstates, setErrorMsg, setSuccessMsg } = useOwner();
  const [estateViewMode, setEstateViewMode] = useState('list');

  const [editingEstate, setEditingEstate] = useState(null);
  const [deletingEstate, setDeletingEstate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenRegistration = () => {
    setErrorMsg('');
    setSuccessMsg('');
    navigate('/dashboard/estates/new');
  };

  const handleSaveEdit = async (estateId, payload) => {
    await updateOwnerEstate(estateId, payload);
    setSuccessMsg(`Estate "${payload.name}" was updated successfully.`);
    await reloadEstates();
  };

  const handleConfirmDelete = async () => {
    if (!deletingEstate) return;
    setDeleteLoading(true);
    try {
      await deleteOwnerEstate(deletingEstate.id);
      setSuccessMsg(`Estate "${deletingEstate.name}" was successfully deleted.`);
      setDeletingEstate(null);
      await reloadEstates();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete estate.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Navigation Bar inside Estates */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#D7E6DD] p-4">
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
              Registered Estates
            </h2>
            <p className="text-xs text-[#4B5563]">
              {estates.length} registered {estates.length === 1 ? 'estate' : 'estates'} under your account
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* View Switcher: List vs OpenStreetMap */}
          {estates.length > 0 && (
            <div className="inline-flex border border-[#1F3D2C] p-0.5 bg-white">
              <button
                type="button"
                onClick={() => setEstateViewMode('list')}
                className={`px-3 py-1 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  estateViewMode === 'list'
                    ? 'bg-[#1F3D2C] text-white'
                    : 'bg-white text-[#1F3D2C] hover:bg-[#D7E6DD]/40'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
              <button
                type="button"
                onClick={() => setEstateViewMode('map')}
                className={`px-3 py-1 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  estateViewMode === 'map'
                    ? 'bg-[#1F3D2C] text-white'
                    : 'bg-white text-[#1F3D2C] hover:bg-[#D7E6DD]/40'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                Map Overview
              </button>
            </div>
          )}

          {/* Register Estate Route Button */}
          <Button
            size="sm"
            onClick={handleOpenRegistration}
            className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-xs gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Register New Estate
          </Button>
        </div>
      </div>

      {/* Estates Content Card */}
      <Card className="border border-[#D7E6DD] bg-white">
        <CardContent className="p-0">
          {estates.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-[#D7E6DD]/50 text-[#1F3D2C] flex items-center justify-center mx-auto border border-[#D7E6DD]">
                <MapPin className="w-6 h-6 text-[#8C6239]" />
              </div>
              <div className="text-base font-bold text-[#1F3D2C]">
                No estates registered yet
              </div>
              <p className="text-xs text-[#4B5563] max-w-sm mx-auto">
                Click the <strong>Register New Estate</strong> button above to pinpoint your boundary on the Sri Lanka OpenStreetMap and add your first estate.
              </p>
              <Button
                size="sm"
                onClick={handleOpenRegistration}
                className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Register First Estate
              </Button>
            </div>
          ) : estateViewMode === 'map' ? (
            <div className="p-4 space-y-3">
              <EstatesOverviewMap estates={estates} height="420px" />
              <div className="text-[11px] text-[#4B5563] flex items-center justify-between px-1">
                <span>Click on any marker or polygon boundary to view details.</span>
                <span className="text-[#8C6239] font-medium">
                  Showing {estates.length} {estates.length === 1 ? 'estate' : 'estates'} on OpenStreetMap Sri Lanka
                </span>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#D7E6DD]">
              {estates.map((est) => (
                <EstateListCard
                  key={est.id}
                  estate={est}
                  onEdit={(item) => setEditingEstate(item)}
                  onDelete={(item) => setDeletingEstate(item)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Estate Modal */}
      {editingEstate && (
        <EditEstateModal
          estate={editingEstate}
          crops={crops}
          onClose={() => setEditingEstate(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Estate Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingEstate)}
        title="Delete Estate"
        description={
          <div>
            <p>
              Are you sure you want to delete estate{' '}
              <strong className="text-[#1F2937]">
                {deletingEstate?.name}
              </strong>{' '}
              ({deletingEstate?.code})?
            </p>
            <p className="mt-2 text-[11px] text-[#6B7280]">
              This will remove all associated boundary geometry and field assignments for this estate. This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Delete Estate"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteLoading) setDeletingEstate(null);
        }}
      />
    </div>
  );
}
