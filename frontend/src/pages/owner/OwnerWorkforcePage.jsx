import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { EditEmployeeModal } from '../../components/forms/EditEmployeeModal';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { useNavigate } from '../../router';
import { useOwner } from '../../context/OwnerContext';
import { updateOwnerEmployee, deleteOwnerEmployee } from '../../api/owner';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Plus,
  ArrowLeft,
  Search,
  MapPin,
  IdCard,
  Phone,
  Edit2,
  Trash2,
} from 'lucide-react';

export function OwnerWorkforcePage() {
  const navigate = useNavigate();
  const { employees, estates, reloadEmployees, setSuccessMsg, setErrorMsg } = useOwner();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'worker' | 'supervisor'
  const [estateFilter, setEstateFilter] = useState('all');

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const workersCount = employees.filter(
    (e) => (e.role || 'worker').toLowerCase() === 'worker',
  ).length;

  const supervisorsCount = employees.filter(
    (e) => (e.role || '').toLowerCase() === 'supervisor',
  ).length;

  const assignedCount = employees.filter((e) => {
    return (
      (e.estateAssignments && e.estateAssignments.length > 0) ||
      (e.workerAssignments && e.workerAssignments.length > 0)
    );
  }).length;

  const handleOpenRegistration = () => {
    setErrorMsg('');
    setSuccessMsg('');
    navigate('/dashboard/workforce/new');
  };

  const handleSaveEdit = async (empId, payload) => {
    await updateOwnerEmployee(empId, payload);
    setSuccessMsg(`Employee "${payload.firstName}" was updated successfully.`);
    await reloadEmployees();
  };

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    setDeleteLoading(true);
    const fullName = `${deletingEmployee.firstName} ${deletingEmployee.lastName || ''}`.trim();
    try {
      await deleteOwnerEmployee(deletingEmployee.id);
      setSuccessMsg(`Employee "${fullName}" was removed from your workforce.`);
      setDeletingEmployee(null);
      await reloadEmployees();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to remove employee.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const roleMatch =
      roleFilter === 'all'
        ? true
        : roleFilter === 'supervisor'
          ? (e.role || '').toLowerCase() === 'supervisor'
          : (e.role || 'worker').toLowerCase() === 'worker';

    const estateMatch =
      estateFilter === 'all'
        ? true
        : (e.estateAssignments || []).some((ea) => ea.estate?.id === estateFilter) ||
          (e.workerAssignments || []).some((wa) => wa.estate?.id === estateFilter);

    const query = searchQuery.trim().toLowerCase();
    const nameMatch =
      !query ||
      `${e.firstName} ${e.lastName || ''}`.toLowerCase().includes(query) ||
      (e.employeeCode || '').toLowerCase().includes(query) ||
      (e.nic || '').toLowerCase().includes(query) ||
      (e.phone || '').toLowerCase().includes(query);

    return roleMatch && estateMatch && nameMatch;
  });

  return (
    <div className="space-y-5">
      {/* Top Header / Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#D7E6DD] p-4">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="gap-1.5 border-[#1F3D2C] text-[#1F3D2C] text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-lg font-bold font-heading text-[#1F3D2C]">
              Workforce Crew
            </h2>
            <p className="text-xs text-[#4B5563]">
              {employees.length} {employees.length === 1 ? 'member' : 'members'} enrolled across your estates
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleOpenRegistration}
          className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-xs gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          Register New Employee
        </Button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D7E6DD] p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">
              TOTAL CREW
            </span>
            <div className="text-2xl font-bold text-[#1F3D2C] mt-0.5">
              {employees.length}
            </div>
            <span className="text-[11px] text-[#8C6239]">Enrolled members</span>
          </div>
          <div className="w-10 h-10 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <Users className="w-5 h-5 text-[#8C6239]" />
          </div>
        </div>

        <div className="bg-white border border-[#D7E6DD] p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">
              FIELD WORKERS
            </span>
            <div className="text-2xl font-bold text-[#1F3D2C] mt-0.5">
              {workersCount}
            </div>
            <span className="text-[11px] text-[#4B5563]">Pluckers &amp; Harvesters</span>
          </div>
          <div className="w-10 h-10 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <UserCheck className="w-5 h-5 text-[#1F3D2C]" />
          </div>
        </div>

        <div className="bg-white border border-[#D7E6DD] p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">
              SUPERVISORS
            </span>
            <div className="text-2xl font-bold text-[#1F3D2C] mt-0.5">
              {supervisorsCount}
            </div>
            <span className="text-[11px] text-[#4B5563]">Field Overseers</span>
          </div>
          <div className="w-10 h-10 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <ShieldCheck className="w-5 h-5 text-[#8C6239]" />
          </div>
        </div>

        <div className="bg-white border border-[#D7E6DD] p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] text-[#4B5563] font-medium uppercase tracking-wider">
              ESTATE ASSIGNED
            </span>
            <div className="text-2xl font-bold text-[#1F3D2C] mt-0.5">
              {assignedCount}
            </div>
            <span className="text-[11px] text-[#4B5563]">Active assignments</span>
          </div>
          <div className="w-10 h-10 bg-[#D7E6DD]/60 text-[#1F3D2C] flex items-center justify-center border border-[#D7E6DD]">
            <MapPin className="w-5 h-5 text-[#1F3D2C]" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D7E6DD] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
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
              All Crew ({employees.length})
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

          {/* Estate Filter */}
          {estates.length > 0 && (
            <select
              value={estateFilter}
              onChange={(e) => setEstateFilter(e.target.value)}
              className="rounded-none border border-[#D7E6DD] text-xs h-7 px-2 bg-white text-[#1F2937]"
            >
              <option value="all">All Estates</option>
              {estates.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search name, code, NIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-none border-[#D7E6DD] text-xs h-8 pl-8 bg-white"
          />
        </div>
      </div>

      {/* Employees Table Card */}
      <Card className="border border-[#D7E6DD] bg-white">
        <CardContent className="p-0">
          {employees.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-[#D7E6DD]/50 text-[#1F3D2C] flex items-center justify-center mx-auto border border-[#D7E6DD]">
                <Users className="w-6 h-6 text-[#8C6239]" />
              </div>
              <div className="text-base font-bold text-[#1F3D2C]">
                No employees registered yet
              </div>
              <p className="text-xs text-[#4B5563] max-w-sm mx-auto">
                Register your field pluckers, harvesters, and supervisors to start tracking daily field attendance and piece-rate harvests.
              </p>
              <Button
                size="sm"
                onClick={handleOpenRegistration}
                className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Register First Employee
              </Button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-[#4B5563] text-xs space-y-2">
              <p>No workforce members matched your filter criteria.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                  setEstateFilter('all');
                }}
                className="rounded-none border-[#D7E6DD] text-[#1F3D2C] text-xs h-7"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D7E6DD] bg-[#F8F9FA] text-[#1F3D2C] font-semibold">
                    <th className="p-3">Employee Name &amp; Code</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Assigned Estate</th>
                    <th className="p-3">NIC</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7E6DD]/60">
                  {filteredEmployees.map((emp) => {
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
                          <div className="text-[11px] font-mono text-[#8C6239] mt-0.5">
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
                            <div className="flex items-center gap-1.5 text-[#1F2937]">
                              <MapPin className="w-3.5 h-3.5 text-[#8C6239] shrink-0" />
                              <span className="font-medium">{activeEstate.name}</span>
                              {activeEstate.code && (
                                <span className="text-[10px] text-[#6B7280]">
                                  ({activeEstate.code})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="italic text-[#9CA3AF]">
                              General Pool
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-[#4B5563] font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <IdCard className="w-3.5 h-3.5 text-[#8C6239]" />
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

                        <td className="p-3 text-[#4B5563]">
                          {emp.dateJoined
                            ? new Date(emp.dateJoined).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                            {emp.status || 'active'}
                          </span>
                        </td>

                        <td className="p-3 text-right space-x-1">
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
                            className="rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs cursor-pointer gap-1"
                            title="Remove Employee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
        title="Remove Employee"
        description={
          <div>
            <p>
              Are you sure you want to remove employee{' '}
              <strong className="text-[#1F2937]">
                {deletingEmployee?.firstName} {deletingEmployee?.lastName || ''}
              </strong>{' '}
              ({deletingEmployee?.employeeCode})?
            </p>
            <p className="mt-2 text-[11px] text-[#6B7280]">
              This will remove their profile and all estate shift allocations. This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Remove Employee"
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
