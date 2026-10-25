import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { updateOwner, deleteOwner } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { Users, Search, Mail, Phone, Trash2 } from 'lucide-react';

export function AdminOwnersPage() {
  const {
    token,
    owners,
    setFeedbackMsg,
    reloadOwners,
  } = useAdmin();

  const [ownerSearch, setOwnerSearch] = useState('');
  const [deletingOwner, setDeletingOwner] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleToggleOwnerStatus = async (owner) => {
    const currentStatus = (owner.status || 'active').toLowerCase();
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateOwner(token, owner.id, { status: newStatus });
      setFeedbackMsg({
        type: 'success',
        text: `Owner ${owner.name} is now ${newStatus}.`,
      });
      await reloadOwners();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to update owner status.',
      });
    }
  };

  const handleConfirmDeleteOwner = async () => {
    if (!deletingOwner) return;
    setDeleteLoading(true);
    try {
      await deleteOwner(token, deletingOwner.id);
      setFeedbackMsg({
        type: 'success',
        text: `Owner ${deletingOwner.name} was removed.`,
      });
      setDeletingOwner(null);
      await reloadOwners();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to delete owner.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredOwners = owners.filter(
    (o) =>
      o.name?.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      o.email?.toLowerCase().includes(ownerSearch.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#D7E6DD] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#1F3D2C] flex items-center gap-2 font-heading">
            <Users className="w-5 h-5 text-[#1F3D2C]" />
            <span>Registered Owners</span>
          </h2>
          <p className="text-xs text-[#4B5563] mt-0.5">
            View and manage registered plantation owners.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search owners..."
            value={ownerSearch}
            onChange={(e) => setOwnerSearch(e.target.value)}
            className="rounded-none pl-9 border-[#D7E6DD] text-xs h-9 bg-white"
          />
        </div>
      </div>

      <div className="border border-[#D7E6DD] bg-white overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#D7E6DD] bg-[#F8F9FA] text-[#1F3D2C] font-semibold">
              <th className="p-3">Owner Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7E6DD]/60">
            {filteredOwners.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#4B5563]">
                  No registered owners found.
                </td>
              </tr>
            ) : (
              filteredOwners.map((owner) => (
                <tr key={owner.id} className="hover:bg-[#F8F9FA] transition-colors">
                  <td className="p-3 font-semibold text-[#1F3D2C]">
                    {owner.name}
                  </td>

                  <td className="p-3 text-[#4B5563]">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#8C6239]" />
                      {owner.email || 'N/A'}
                    </span>
                  </td>

                  <td className="p-3 text-[#4B5563]">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#8C6239]" />
                      {owner.phone || 'N/A'}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium capitalize ${
                        (owner.status || 'active').toLowerCase() === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {(owner.status || 'active').toLowerCase()}
                    </span>
                  </td>

                  <td className="p-3 text-[#4B5563]">
                    {owner.createdAt
                      ? new Date(owner.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>

                  <td className="p-3 text-right space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleOwnerStatus(owner)}
                      className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 text-xs h-7 px-2.5 cursor-pointer"
                    >
                      {(owner.status || 'active').toLowerCase() === 'active'
                        ? 'Suspend'
                        : 'Activate'}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeletingOwner(owner)}
                      className="rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Owner Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingOwner)}
        title="Delete Owner"
        description={
          <div>
            <p>
              Are you sure you want to delete owner account{' '}
              <strong className="text-[#1F2937]">"{deletingOwner?.name}"</strong> ({deletingOwner?.email})?
            </p>
            <p className="mt-2 text-[11px] text-[#6B7280]">
              This will permanently delete this owner profile and revoke their login access.
            </p>
          </div>
        }
        confirmText="Delete Owner"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleConfirmDeleteOwner}
        onCancel={() => {
          if (!deleteLoading) setDeletingOwner(null);
        }}
      />
    </div>
  );
}
