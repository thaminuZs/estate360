import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { EditEmployeeModal } from '../../components/forms/EditEmployeeModal';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { updateEmployee, deleteEmployee } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { useLocation, useNavigate } from '../../router';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Search,
  MapPin,
  IdCard,
  Phone,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';

export function AdminEmployeesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token,
    employees,
    estates,
    setFeedbackMsg,
    reloadEmployees,
  } = useAdmin();

  // Read active estateId from URL query param (single source of truth)
  const queryParams = new URLSearchParams(location.search);
  const estateFilter = queryParams.get('estateId') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'worker' | 'supervisor'
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEstateChange = (newEstateId) => {
    if (newEstateId === 'all') {
      navigate('/admin/employees');
    } else {
      navigate(`/admin/employees?estateId=${newEstateId}`);
    }
  };

  const selectedEstate = estates.find((e) => e.id === estateFilter);

  // Filter employees by estate
  const estateFilteredEmployees = employees.filter((emp) => {
    if (estateFilter === 'all') return true;
    if (estateFilter === 'unassigned') {
      const hasEstateAssignment = (emp.estateAssignments || []).length > 0;
      const hasWorkerAssignment = (emp.workerAssignments || []).length > 0;
      return !hasEstateAssignment && !hasWorkerAssignment;
    }
    const inEstateAssignments = (emp.estateAssignments || []).some(
      (ea) => ea.estate?.id === estateFilter,
    );
    const inWorkerAssignments = (emp.workerAssignments || []).some(
      (wa) => wa.estate?.id === estateFilter,
    );
    return inEstateAssignments || inWorkerAssignments;
  });

  const workersCount = estateFilteredEmployees.filter(
    (e) => (e.role || 'worker').toLowerCase() === 'worker',
  ).length;

  const supervisorsCount = estateFilteredEmployees.filter(
    (e) => (e.role || '').toLowerCase() === 'supervisor',
  ).length;

  const handleSaveEdit = async (empId, payload) => {
    await updateEmployee(token, empId, payload);
    setFeedbackMsg({
      type: 'success',
      text: `Employee "${payload.firstName}" was updated successfully.`,
    });
    await reloadEmployees();
  };

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    setDeleteLoading(true);
    const fullName = `${deletingEmployee.firstName} ${deletingEmployee.lastName || ''}`.trim();
    try {
      await deleteEmployee(token, deletingEmployee.id);
      setFeedbackMsg({
        type: 'success',
        text: `Employee "${fullName}" (${deletingEmployee.employeeCode}) was deleted.`,
      });
      setDeletingEmployee(null);
      await reloadEmployees();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to delete employee.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const finalFilteredEmployees = estateFilteredEmployees.filter((e) => {
    const roleMatch =
      roleFilter === 'all'
        ? true
        : roleFilter === 'supervisor'
          ? (e.role || '').toLowerCase() === 'supervisor'
          : (e.role || 'worker').toLowerCase() === 'worker';

    const query = searchQuery.trim().toLowerCase();
    const nameMatch =
      !query ||
      `${e.firstName} ${e.lastName || ''}`.toLowerCase().includes(query) ||
      (e.employeeCode || '').toLowerCase().includes(query) ||
      (e.nic || '').toLowerCase().includes(query) ||
      (e.phone || '').toLowerCase().includes(query) ||
      (e.owner?.name || '').toLowerCase().includes(query) ||
      (e.estateAssignments?.[0]?.estate?.name || '').toLowerCase().includes(query);

    return roleMatch && nameMatch;
  });

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="bg-white border border-[#D7E6DD] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#1F3D2C] flex items-center gap-2 font-heading">
            <Users className="w-5 h-5 text-[#1F3D2C]" />
            <span>Workforce Directory</span>
          </h2>
          <p className="text-xs text-[#4B5563] mt-0.5">
            {selectedEstate
              ? `Showing workforce allocated to ${selectedEstate.name}`
              : 'Manage field workers, harvesters, and supervisors across all plantations.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Estate Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#F8F9FA] border border-[#D7E6DD] px-2 py-1">
            <MapPin className="w-3.5 h-3.5 text-[#8C6239] shrink-0" />
            <span className="text-[11px] font-semibold text-[#1F3D2C] whitespace-nowrap">
              Estate:
            </span>
            <select
              value={estateFilter}
              onChange={(e) => handleEstateChange(e.target.value)}
              className="rounded-none border-none text-xs h-7 px-1 bg-transparent text-[#1F2937] font-medium focus:outline-none cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
            >
              <option value="all">All Estates (Full Platform)</option>
              <option value="unassigned">Unassigned (General Pool)</option>
              <optgroup label="Select Specific Estate">
                {estates.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.name} ({est.code || 'Estate'})
                  </option>
                ))}
              </optgroup>
            </select>
            {estateFilter !== 'all' && (
              <button
                type="button"
                onClick={() => handleEstateChange('all')}
                title="Clear Estate Filter"
                className="text-[#9CA3AF] hover:text-[#1F3D2C] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="inline-flex border border-[#1F3D2C] p-0.5 bg-white">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-[#1F3D2C] text-white'
                  : 'bg-white text-[#1F3D2C] hover:bg-[#D7E6DD]/40'
              }`}
            >
              All ({estateFilteredEmployees.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('worker')}
              className={`px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === 'worker'
                  ? 'bg-[#1F3D2C] text-white'
                  : 'bg-white text-[#1F3D2C] hover:bg-[#D7E6DD]/40'
              }`}
            >
              Workers ({workersCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('supervisor')}
              className={`px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === 'supervisor'
                  ? 'bg-[#1F3D2C] text-white'
                  : 'bg-white text-[#1F3D2C] hover:bg-[#D7E6DD]/40'
              }`}
            >
              Supervisors ({supervisorsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Selected Estate Context Banner */}
      {selectedEstate && (
        <div className="bg-[#D7E6DD]/30 border border-[#D7E6DD] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1F3D2C] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#F1C40F]" />
            </div>
            <div>
              <div className="font-bold text-[#1F3D2C] flex items-center gap-1.5">
                <span>Selected Estate: {selectedEstate.name}</span>
                <Badge variant="yellow" className="text-[10px]">
                  {selectedEstate.code}
                </Badge>
                {selectedEstate.crop?.name && (
                  <span className="text-[11px] text-[#8C6239] font-medium">
                    • Crop: {selectedEstate.crop.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#4B5563] mt-0.5">
                Owner: <strong>{selectedEstate.owner?.name || 'Unknown'}</strong>{' '}
                {selectedEstate.owner?.email ? `(${selectedEstate.owner.email})` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#1F3D2C] bg-white px-2 py-1 border border-[#D7E6DD]">
              {estateFilteredEmployees.length}{' '}
              {estateFilteredEmployees.length === 1 ? 'Crew Member' : 'Crew Members'}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEstateChange('all')}
              className="rounded-none border-[#1F3D2C] text-[#1F3D2C] hover:bg-[#D7E6DD]/40 text-xs h-7 px-2.5"
            >
              View All Estates
            </Button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search name, code, NIC, owner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-none pl-9 border-[#D7E6DD] text-xs h-8 bg-white"
        />
      </div>

      {/* Employees Table */}
      <div className="border border-[#D7E6DD] bg-white overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#D7E6DD] bg-[#F8F9FA] text-[#1F3D2C] font-semibold">
              <th className="p-3">Employee Name &amp; Code</th>
              <th className="p-3">Role</th>
              <th className="p-3">Assigned Estate</th>
              <th className="p-3">Owner Account</th>
              <th className="p-3">NIC</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7E6DD]/60">
            {finalFilteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-[#4B5563]">
                  {selectedEstate ? (
                    <div className="space-y-1.5">
                      <p>
                        No workforce members are currently assigned to{' '}
                        <strong>{selectedEstate.name}</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleEstateChange('all')}
                        className="text-xs text-[#1F3D2C] underline font-semibold cursor-pointer"
                      >
                        Show workforce from all estates
                      </button>
                    </div>
                  ) : (
                    'No employees found matching criteria.'
                  )}
                </td>
              </tr>
            ) : (
              finalFilteredEmployees.map((emp) => {
                const isSupervisor = (emp.role || '').toLowerCase() === 'supervisor';
                const activeEstate =
                  emp.estateAssignments?.[0]?.estate ||
                  emp.workerAssignments?.[0]?.estate;

                return (
                  <tr key={emp.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-[#1F3D2C] flex items-center gap-1.5">
                        {isSupervisor ? (
                          <ShieldCheck className="w-4 h-4 text-[#8C6239] shrink-0" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-[#1F3D2C] shrink-0" />
                        )}
                        <span>
                          {emp.firstName} {emp.lastName || ''}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#8C6239]">
                        {emp.employeeCode}
                      </div>
                    </td>

                    <td className="p-3">
                      {isSupervisor ? (
                        <Badge variant="yellow" className="text-xs font-semibold">
                          Supervisor
                        </Badge>
                      ) : (
                        <Badge variant="light" className="text-xs text-[#1F3D2C]">
                          Worker
                        </Badge>
                      )}
                    </td>

                    <td className="p-3">
                      {activeEstate ? (
                        <div className="flex items-center gap-1 text-[#1F2937]">
                          <MapPin className="w-3.5 h-3.5 text-[#8C6239] shrink-0" />
                          <span className="font-medium">{activeEstate.name}</span>
                          {activeEstate.code && (
                            <span className="text-[10px] text-[#6B7280]">
                              ({activeEstate.code})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="italic text-[#9CA3AF]">General Pool</span>
                      )}
                    </td>

                    <td className="p-3 text-[#4B5563]">
                      <div className="font-medium text-[#1F2937]">
                        {emp.owner?.name || 'Unknown'}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        {emp.owner?.email || ''}
                      </div>
                    </td>

                    <td className="p-3 font-mono text-[11px] text-[#4B5563]">
                      <span className="flex items-center gap-1">
                        <IdCard className="w-3 h-3 text-[#8C6239]" />
                        {emp.nic}
                      </span>
                    </td>

                    <td className="p-3 text-[#4B5563]">
                      {emp.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#8C6239]" />
                          {emp.phone}
                        </span>
                      ) : (
                        <span className="italic text-[#9CA3AF]">—</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {emp.status || 'active'}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEmployee(emp)}
                        className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 h-7 px-2 text-xs cursor-pointer gap-1"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingEmployee(emp)}
                        className="rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs cursor-pointer"
                        title="Delete Employee"
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

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          estates={estates}
          onClose={() => setEditingEmployee(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Employee Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingEmployee)}
        title="Delete Employee"
        description={
          <div>
            <p>
              Are you sure you want to delete employee{' '}
              <strong className="text-[#1F2937]">
                {deletingEmployee?.firstName} {deletingEmployee?.lastName || ''}
              </strong>{' '}
              ({deletingEmployee?.employeeCode})?
            </p>
            <p className="mt-2 text-[11px] text-[#6B7280]">
              This will permanently remove this employee and all associated estate and shift assignments across the platform. This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Delete Employee"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteLoading) setDeletingEmployee(null);
        }}
      />
    </div>
  );
}
