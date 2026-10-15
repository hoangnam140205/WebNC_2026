import { useState, useEffect } from 'react';
import { editRequestsApi } from '../../services/api';
import {
  FiCheck,
  FiX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiFilter,
} from 'react-icons/fi';

export function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'reject'
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await editRequestsApi.getAllAdmin(statusFilter ? { status: statusFilter } : {});
      setRequests(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải yêu cầu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const openReviewModal = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setAdminNote(
      type === 'approve'
        ? 'Quản trị viên đã phê duyệt yêu cầu chỉnh sửa của bạn'
        : 'Yêu cầu không được chấp thuận do thông tin chưa hợp lệ',
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (actionType === 'approve') {
        await editRequestsApi.approve(selectedRequest.id, { adminNote });
        setAlertMsg({ type: 'success', text: '✅ Đã duyệt và cập nhật khoản chi tiêu thành công!' });
      } else {
        await editRequestsApi.reject(selectedRequest.id, { adminNote });
        setAlertMsg({ type: 'success', text: 'Đã từ chối yêu cầu chỉnh sửa' });
      }
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      setAlertMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Có lỗi xảy ra khi xử lý yêu cầu',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Duyệt Yêu Cầu Chỉnh Sửa Chi Tiêu</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Xem xét và quyết định phê duyệt hoặc từ chối các yêu cầu sửa đổi giao dịch từ người dùng
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setStatusFilter('')}
            className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`btn btn-sm ${statusFilter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`btn btn-sm ${statusFilter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Đã từ chối
          </button>
        </div>
      </div>

      {alertMsg.text && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: alertMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
            border: `1px solid ${alertMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: alertMsg.type === 'success' ? '#6ee7b7' : '#fda4af',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{alertMsg.text}</span>
          <button
            onClick={() => setAlertMsg({ type: '', text: '' })}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          ⏳ Đang tải yêu cầu...
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Không có yêu cầu nào trong mục này
          </h3>
          <p style={{ fontSize: '0.85rem' }}>Các yêu cầu từ người dùng sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {requests.map((req) => (
            <div key={req.id} className="glass-card" style={{ padding: '24px' }}>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '18px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-glass)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Người gửi yêu cầu:</span>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                    {req.user?.fullName} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 400 }}>({req.user?.email})</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {new Date(req.createdAt).toLocaleString('vi-VN')}
                  </span>
                  <div>
                    {req.status === 'pending' && (
                      <span className="badge badge-pending">
                        <FiClock /> Chờ duyệt
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="badge badge-approved">
                        <FiCheckCircle /> Đã duyệt
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="badge badge-rejected">
                        <FiXCircle /> Đã từ chối
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* So Sánh Chi Tiết */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                  marginBottom: '18px',
                }}
              >
                {/* Dữ liệu gốc */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Dữ liệu hiện tại trong hệ thống
                  </div>
                  {req.expense ? (
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem' }}>
                        {req.expense.description}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f43f5e', margin: '6px 0' }}>
                        {formatCurrency(req.expense.amount)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Ngày ghi: {req.expense.date} • Loại: {req.expense.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                      </div>
                      {req.expense.note && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                          Ghi chú: {req.expense.note}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-dim)' }}>Giao dịch đã bị xóa</div>
                  )}
                </div>

                {/* Dữ liệu mong muốn */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Dữ liệu người dùng muốn thay đổi thành
                  </div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem' }}>
                    {req.requestedDescription}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', margin: '6px 0' }}>
                    {formatCurrency(req.requestedAmount)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Ngày mới: {req.requestedDate} {req.requestedCategory && `• ${req.requestedCategory.name}`}
                  </div>
                  {req.requestedNote && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Ghi chú mới: {req.requestedNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Lý do người dùng đưa ra */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                }}
              >
                <strong style={{ color: 'var(--text-muted)' }}>Lý do chỉnh sửa từ người dùng:</strong>{' '}
                <span style={{ color: '#fff', fontStyle: 'italic' }}>"{req.reason}"</span>
              </div>

              {/* Phản hồi hiện tại nếu đã xử lý */}
              {req.adminNote && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: req.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    borderLeft: `3px solid ${req.status === 'approved' ? '#10b981' : '#f43f5e'}`,
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                  }}
                >
                  <strong style={{ color: req.status === 'approved' ? '#6ee7b7' : '#fda4af' }}>
                    Ghi chú của Quản trị viên:
                  </strong>{' '}
                  <span style={{ color: '#fff' }}>{req.adminNote}</span>
                </div>
              )}

              {/* Action Buttons for Pending */}
              {req.status === 'pending' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => openReviewModal(req, 'reject')}
                    className="btn btn-danger btn-sm"
                  >
                    <FiX /> Từ Chối Yêu Cầu
                  </button>
                  <button
                    onClick={() => openReviewModal(req, 'approve')}
                    className="btn btn-success btn-sm"
                  >
                    <FiCheck /> Duyệt & Cập Nhật Chi Tiêu
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* REVIEW CONFIRMATION MODAL */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: actionType === 'approve' ? '#10b981' : '#f43f5e' }}>
                {actionType === 'approve' ? 'Xác Nhận Phê Duyệt Yêu Cầu' : 'Xác Nhận Từ Chối Yêu Cầu'}
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {actionType === 'approve'
                    ? 'Sau khi phê duyệt, khoản chi tiêu trong sổ của người dùng sẽ tự động được cập nhật theo đúng số tiền và thông tin mới này.'
                    : 'Khoản chi tiêu sẽ giữ nguyên như cũ, và người dùng sẽ nhận được thông báo từ chối kèm lý do.'}
                </p>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Ghi chú phản hồi cho người dùng {actionType === 'reject' && <span style={{ color: 'var(--danger)' }}>*</span>}
                  </label>
                  <textarea
                    rows={3}
                    required={actionType === 'reject'}
                    className="form-control"
                    placeholder="Nhập lời giải thích hoặc lời nhắn cho người dùng..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setSelectedRequest(null)} className="btn btn-secondary">
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-danger'}`}
                >
                  {submitting
                    ? 'Đang xử lý...'
                    : actionType === 'approve'
                    ? 'Xác Nhận Phê Duyệt'
                    : 'Xác Nhận Từ Chối'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
