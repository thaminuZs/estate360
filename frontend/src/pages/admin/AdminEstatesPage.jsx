import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AdminEstateModal } from '../../components/admin/AdminEstateModal';
import { EditEstateModal } from '../../components/estates/EditEstateModal';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { updateEstate, deleteEstate } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from '../../router';
import { formatArea, calculateGeodesicArea } from '../../lib/geoUtils';
import { MapPin, Search, ExternalLink, Edit2, Trash2, Users } from 'lucide-react';

export function AdminEstatesPage() {
  const navigate = useNavigate();
  const {
    token,
    estates,
    crops,
    owners,
    setFeedbackMsg,
    reloadEstates,
  } = useAdmin();

  const [estateSearch, setEstateSearch] = useState('');
  const [inspectEstate, setInspectEstate] = useState(null);
  const [editingEstate, setEditingEstate] = useState(null);
  const [deletingEstate, setDeletingEstate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSaveEdit = async (estateId, payload) => {
    await updateEstate(token, estateId, payload);
    setFeedbackMsg({
      type: 'success',
      text: `Estate "${payload.name}" was updated successfully.`,
    });
    await reloadEstates();
  };

  const handleConfirmDelete = async () => {
    if (!deletingEstate) return;
    setDeleteLoading(true);
    try {
      await deleteEstate(token, deletingEstate.id);
      setFeedbackMsg({
        type: 'success',
        text: `Estate "${deletingEstate.name}" was removed.`,
      });
      setDeletingEstate(null);
      await reloadEstates();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to delete estate.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEstates = estates.filter(
    (e) =>
      e.name?.toLowerCase().includes(estateSearch.toLowerCase()) ||
      e.code?.toLowerCase().includes(estateSearch.toLowerCase()) ||
      e.owner?.name?.toLowerCase().includes(estateSearch.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#D7E6DD] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#1F3D2C] flex items-center gap-2 font-heading">
            <MapPin className="w-5 h-5 text-[#1F3D2C]" />
            <span>All Registered Estates</span>
          </h2>
          <p className="text-xs text-[#4B5563] mt-0.5">
            Overview of all estates registered by owners across Sri Lanka.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search estates or owners..."
            value={estateSearch}
            onChange={(e) => setEstateSearch(e.target.value)}
            className="rounded-none pl-9 border-[#D7E6DD] text-xs h-9 bg-white"
          />
        </div>
      </div>

      <div className="border border-[#D7E6DD] bg-white overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#D7E6DD] bg-[#F8F9FA] text-[#1F3D2C] font-semibold">
              <th className="p-3">Estate Name &amp; Code</th>
              <th className="p-3">Crop</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Land Area</th>
              <th className="p-3">Boundary</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7E6DD]/60">
            {filteredEstates.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[#4B5563]">
                  No estates registered yet.
                </td>
              </tr>
            ) : (
              filteredEstates.map((estate) => {
                const rawCoords = estate?.boundary?.coordinates?.[0] || [];
                const pts = rawCoords.map((c) => ({
                  lat: Number(c[1]),
                  lng: Number(c[0]),
                }));
                const areaSqM = calculateGeodesicArea(pts);
                const formatted = formatArea(areaSqM);

                return (
                  <tr key={estate.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-[#1F3D2C] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8C6239]" />
                        <span>{estate.name}</span>
                      </div>
                      <div className="text-[11px] text-[#4B5563]">
                        {estate.code}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-[#1F2937] font-medium">
                        {estate.crop?.name || 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-[#8C6239]">
                        Rs. {Number(estate.crop?.paymentFactor || 0).toFixed(2)}/kg
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-[#1F2937] font-medium">
                        {estate.owner?.name || 'Unknown'}
                      </div>
                      <div className="text-[11px] text-[#4B5563] truncate max-w-xs">
                        {estate.owner?.email || 'N/A'}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-[#1F3D2C]">
                        {formatted.acres} Acres
                      </div>
                      <div className="text-[11px] text-[#4B5563]">
                        {formatted.hectares} Ha
                      </div>
                    </td>

                    <td className="p-3 text-[#4B5563]">
                      <span className="bg-[#D7E6DD]/40 border border-[#D7E6DD] px-2 py-0.5 text-xs text-[#1F3D2C]">
                        {pts.length} Points
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {estate.status || 'active'}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/employees?estateId=${estate.id}`)}
                        className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 h-7 px-2 text-xs cursor-pointer gap-1"
                        title="View Estate Workforce"
                      >
                        <Users className="w-3 h-3 text-[#1F3D2C]" />
                        <span className="hidden sm:inline">Workforce</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInspectEstate(estate)}
                        className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 h-7 px-2 text-xs cursor-pointer gap-1"
                        title="View Map"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="hidden sm:inline">Map</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEstate(estate)}
                        className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 h-7 px-2 text-xs cursor-pointer gap-1"
                        title="Edit Estate"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingEstate(estate)}
                        className="rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs cursor-pointer"
                        title="Delete Estate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Boundary Inspector Modal */}
      {inspectEstate && (
        <AdminEstateModal
          estate={inspectEstate}
          onClose={() => setInspectEstate(null)}
        />
      )}

      {/* Edit Estate Modal */}
      {editingEstate && (
        <EditEstateModal
          estate={editingEstate}
          crops={crops}
          owners={owners}
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
              Are you sure you want to permanently delete estate{' '}
              <strong className="text-[#1F2937]">
                {deletingEstate?.name}
              </strong>{' '}
              ({deletingEstate?.code})?
            </p>
            <p className="mt-2 text-[11px] text-[#6B7280]">
              This will remove all associated boundaries, employee assignments, and IoT records. This action cannot be undone.
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
