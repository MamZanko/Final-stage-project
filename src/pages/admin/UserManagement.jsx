import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, EyeIcon, PencilIcon, NoSymbolIcon, TrashIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { mockAdminUsers } from '../../data/mockDataAdmin';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import BanModal from '../../components/admin/BanModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { buttonVariants } from '../../lib/animations';

const UserManagement = () => {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [banUser, setBanUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [changeRole, setChangeRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  const filtered = useMemo(() => {
    let result = [...users];
    if (search) result = result.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') result = result.filter(u => u.status === statusFilter);
    if (dateFrom) result = result.filter(u => u.joinDate >= dateFrom);
    if (dateTo) result = result.filter(u => u.joinDate <= dateTo);
    return result;
  }, [users, search, roleFilter, statusFilter, dateFrom, dateTo]);

  const handleBan = (data) => {
    setUsers(users.map(u => u.id === banUser.id ? { ...u, status: 'banned', banReason: data.reason } : u));
    setBanUser(null);
  };

  const handleUnban = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active', banReason: null } : u));
  };

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const handleRoleChange = () => {
    if (newRole && changeRole) {
      setUsers(users.map(u => u.id === changeRole.id ? { ...u, role: newRole } : u));
      setChangeRole(null);
      setNewRole('');
    }
  };

  const clearFilters = () => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); setDateFrom(''); setDateTo(''); };

  const columns = [
    {
      key: 'name', label: 'User', sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img src={row.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="font-medium text-[var(--color-text)]">{row.name}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'username', label: 'Username', render: (row) => <span className="text-[var(--color-text-secondary)]">@{row.username} <span className="text-primary">🔵</span></span> },
    { key: 'role', label: 'Type', render: (row) => <StatusBadge status={row.role} size="xs" /> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} size="xs" /> },
    { key: 'joinDate', label: 'Joined', sortable: true, render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.joinDate}</span> },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (row) => (
        <div className="flex gap-1">
          <button className="p-1 rounded hover:bg-primary/10 text-primary" title="View"><EyeIcon className="w-4 h-4" /></button>
          <button className="p-1 rounded hover:bg-primary/10 text-primary" title="Edit"><PencilIcon className="w-4 h-4" /></button>
          {row.status === 'banned' ? (
            <button onClick={() => handleUnban(row.id)} className="p-1 rounded hover:bg-success/10 text-success" title="Unban"><CheckCircleIcon className="w-4 h-4" /></button>
          ) : (
            <button onClick={() => setBanUser(row)} className="p-1 rounded hover:bg-error/10 text-error" title="Ban"><NoSymbolIcon className="w-4 h-4" /></button>
          )}
          <button onClick={() => setDeleteUser(row)} className="p-1 rounded hover:bg-error/10 text-error" title="Delete"><TrashIcon className="w-4 h-4" /></button>
          <button onClick={() => { setChangeRole(row); setNewRole(row.role); }} className="p-1 rounded hover:bg-secondary/10 text-secondary" title="Change Role"><ArrowPathIcon className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, username, email..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option value="all">All Types</option><option value="client">Client</option><option value="business">Business</option><option value="admin">Admin</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option value="all">All Status</option><option value="active">Active</option><option value="banned">Banned</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <button onClick={clearFilters} className="px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors">Clear</button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm">
          <span className="font-medium text-primary">{selectedRows.length} selected</span>
          <button className="px-3 py-1 rounded-lg bg-error/10 text-error text-xs font-semibold hover:bg-error/20">Ban Selected</button>
          <button className="px-3 py-1 rounded-lg bg-error/10 text-error text-xs font-semibold hover:bg-error/20">Delete Selected</button>
          <button className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 flex items-center gap-1"><ArrowDownTrayIcon className="w-3.5 h-3.5" /> Export CSV</button>
        </motion.div>
      )}

      {/* Export button */}
      <div className="flex justify-end">
        <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-primary hover:border-primary transition-colors">
          <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
        </motion.button>
      </div>

      {/* Table */}
      <AdminTable columns={columns} data={filtered} pageSize={25} selectable selectedRows={selectedRows} onSelectionChange={setSelectedRows} emptyMessage="No users found." />

      {/* Modals */}
      <BanModal isOpen={!!banUser} onClose={() => setBanUser(null)} onConfirm={handleBan} userName={banUser?.name} />
      <ConfirmModal isOpen={!!deleteUser} onClose={() => setDeleteUser(null)} onConfirm={handleDelete} title="Delete User" message={`Permanently delete "${deleteUser?.name}"? This action cannot be undone.`} confirmText="Delete" variant="danger" />

      {/* Change Role Modal */}
      {changeRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setChangeRole(null)} />
          <div className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-heading font-bold text-[var(--color-text)] mb-3">Change Role</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">Current: <StatusBadge status={changeRole.role} size="xs" /></p>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4">
              <option value="client">Client</option><option value="business">Business</option><option value="admin">Admin</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setChangeRole(null)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">Cancel</button>
              <button onClick={handleRoleChange} className="flex-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
