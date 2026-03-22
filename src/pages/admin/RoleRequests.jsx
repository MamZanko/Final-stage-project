import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
import { mockRoleRequests, mockRoleRequestHistory } from '../../data/mockDataAdmin';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import RejectionModal from '../../components/admin/RejectionModal';
import { buttonVariants, staggerContainer, staggerItem, tabContent, fadeInUp } from '../../lib/animations';

const RoleRequests = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState(mockRoleRequests);
  const [history] = useState(mockRoleRequestHistory);
  const [approveRequest, setApproveRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);

  const handleApprove = () => {
    setRequests(requests.filter(r => r.id !== approveRequest?.id));
    setApproveRequest(null);
  };

  const handleReject = (data) => {
    setRequests(requests.filter(r => r.id !== rejectRequest?.id));
    setRejectRequest(null);
  };

  const tabs = [
    { id: 'pending', label: 'Pending Requests', count: requests.length },
    { id: 'history', label: 'Decision History', count: history.length },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-surface)] rounded-xl w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>
            {activeTab === tab.id && <motion.div layoutId="roleTab" className="absolute inset-0 bg-[var(--color-card-bg)] rounded-lg shadow-sm" />}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'}`}>{tab.count}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Pending Requests */}
      <AnimatePresence mode="wait">
        {activeTab === 'pending' && (
          <motion.div key="pending" variants={tabContent} initial="initial" animate="animate" exit="exit" className="space-y-3">
            {requests.length === 0 ? (
              <motion.div variants={fadeInUp} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
                <CheckCircleIcon className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="text-[var(--color-text)] font-medium">All caught up!</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">No pending role change requests.</p>
              </motion.div>
            ) : (
              <motion.div variants={staggerContainer(0.08)} initial="initial" animate="animate" className="space-y-3">
                {requests.map(req => (
                  <motion.div key={req.id} variants={staggerItem} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <img src={req.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">{req.user.name}</h3>
                          <StatusBadge status="pending" size="xs" />
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)]">@{req.user.username} • {req.user.email}</p>

                        <div className="mt-3 p-3 rounded-xl bg-[var(--color-surface)] space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[var(--color-text-secondary)]">Business Name:</span>
                            <span className="font-medium text-[var(--color-text)]">{req.businessName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[var(--color-text-secondary)]">Category:</span>
                            <span className="text-[var(--color-text)]">{req.category}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-[var(--color-text-secondary)]">Reason: </span>
                            <span className="text-[var(--color-text)]">{req.reason}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--color-text-muted)]">
                          <ClockIcon className="w-3 h-3" />
                          <span>Submitted {req.dateSubmitted}</span>
                          {req.documents && <><span>•</span><span className="flex items-center gap-0.5"><DocumentTextIcon className="w-3 h-3" /> {req.documents} documents</span></>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setApproveRequest(req)} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-semibold hover:bg-success/20 transition-colors">
                          <CheckCircleIcon className="w-4 h-4" /> Approve
                        </motion.button>
                        <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setRejectRequest(req)} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-error/10 text-error text-sm font-semibold hover:bg-error/20 transition-colors">
                          <XCircleIcon className="w-4 h-4" /> Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div key="history" variants={tabContent} initial="initial" animate="animate" exit="exit">
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[var(--color-border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Business Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Decision</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Decided By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Reason</th>
                  </tr></thead>
                  <tbody>
                    {history.map((item, i) => (
                      <motion.tr key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors ${i % 2 ? 'bg-[var(--color-surface)]/30' : ''}`}>
                        <td className="px-4 py-3"><div className="flex items-center gap-2"><img src={item.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" /><span className="text-[var(--color-text)]">{item.user.name}</span></div></td>
                        <td className="px-4 py-3 text-[var(--color-text)]">{item.businessName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{item.date}</td>
                        <td className="px-4 py-3"><StatusBadge status={item.decision} size="xs" /></td>
                        <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{item.decidedBy}</td>
                        <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)] max-w-[200px] truncate">{item.reason || '—'}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Confirmation */}
      <ConfirmModal isOpen={!!approveRequest} onClose={() => setApproveRequest(null)} onConfirm={handleApprove} title="Approve Role Change" message={`Approve "${approveRequest?.user.name}" to become a Business account with business name "${approveRequest?.businessName}"?`} confirmText="Approve" variant="primary" />

      {/* Reject Modal */}
      <RejectionModal isOpen={!!rejectRequest} onClose={() => setRejectRequest(null)} onConfirm={handleReject} userName={rejectRequest?.user.name} title="Reject Role Request" />
    </div>
  );
};

export default RoleRequests;
