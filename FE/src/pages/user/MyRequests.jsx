import { useState, useEffect } from 'react';
import { editRequestsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiArrowRight,
  FiCalendar,
} from 'react-icons/fi';

export function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: user?.currency || 'VND',
    }).format(amount || 0);
  };

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await editRequestsApi.getMyRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải yêu cầu chỉnh sửa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Yêu Cầu Chỉnh Sửa Của Tôi</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Theo dõi tiến trình phê duyệt các yêu cầu thay đổi chi tiêu đã gửi tới Quản trị viên
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          ⏳ Đang tải danh sách yêu cầu...
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📬</div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Bạn chưa có yêu cầu chỉnh sửa nào
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            Khi bạn cần thay đổi một khoản chi tiêu đã ghi, hãy vào "Sổ Chi Tiêu" và chọn "Yêu cầu sửa".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map((req) => (
            <div key={req.id} className="glass-card" style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-glass)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    Mã yêu cầu: <code style={{ color: '#fff' }}>#{req.id.slice(0, 8)}</code>
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>•</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCalendar size={13} /> {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div>
                  {req.status === 'pending' && (
                    <span className="badge badge-pending">
                      <FiClock /> Đang chờ Admin duyệt
                    </span>
                  )}
                  {req.status === 'approved' && (
                    <span className="badge badge-approved">
                      <FiCheckCircle /> Đã được duyệt & Áp dụng
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="badge badge-rejected">
                      <FiXCircle /> Bị từ chối
                    </span>
                  )}
                </div>
              </div>

              {/* So sánh Trước & Sau */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                {/* Khoản gốc */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Dữ liệu hiện tại
                  </div>
                  {req.expense ? (
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{req.expense.description}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f43f5e', margin: '4px 0' }}>
                        {formatCurrency(req.expense.amount)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ngày: {req.expense.date}</div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Khoản chi tiêu đã bị xóa</div>
                  )}
                </div>

                {/* Dữ liệu mong muốn */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.06)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Dữ liệu yêu cầu thay đổi
                  </div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{req.requestedDescription}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>
                    {formatCurrency(req.requestedAmount)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Ngày mới: {req.requestedDate} {req.requestedCategory && `• ${req.requestedCategory.name}`}
                  </div>
                </div>
              </div>

              {/* Lý do & Phản hồi Admin */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600, flexShrink: 0 }}>Lý do của bạn:</span>
                  <span style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>"{req.reason}"</span>
                </div>

                {req.adminNote && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: req.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                      borderLeft: `3px solid ${req.status === 'approved' ? '#10b981' : '#f43f5e'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FiMessageSquare style={{ color: req.status === 'approved' ? '#10b981' : '#f43f5e', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: req.status === 'approved' ? '#6ee7b7' : '#fda4af' }}>
                        Phản hồi từ Admin:
                      </strong>{' '}
                      <span style={{ color: 'var(--text-main)' }}>{req.adminNote}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
