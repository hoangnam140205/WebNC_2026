import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expensesApi, userApi, editRequestsApi } from '../../services/api';
import {
  FiUsers,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalTransactions: 0,
    balance: 0,
  });
  const [userCount, setUserCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, reqsRes] = await Promise.all([
        expensesApi.getAdminStats(),
        userApi.getAll(),
        editRequestsApi.getAllAdmin({ status: 'pending' }),
      ]);
      setStats(statsRes.data);
      setUserCount(usersRes.data?.length || 0);
      setPendingRequests(reqsRes.data || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.15))',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            <FiShield /> Trung Tâm Kiểm Soát Hệ Thống
          </div>
          <h2 style={{ fontSize: '1.7rem', color: '#fff' }}>Quản Trị Hệ Thống Chi Tiêu</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý tài khoản, giám sát toàn bộ chi tiêu và phê duyệt yêu cầu từ người dùng
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/requests" className="btn btn-primary">
            <FiCheckCircle size={16} /> Duyệt Yêu Cầu ({pendingRequests.length})
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            <FiUsers size={16} /> Quản Lý Users
          </Link>
        </div>
      </div>

      {/* Admin Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {/* Người dùng */}
        <div className="glass-card glass-card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Người Dùng</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUsers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>{userCount}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>Tài khoản đang hoạt động</div>
        </div>

        {/* Yêu cầu chờ duyệt */}
        <div className="glass-card glass-card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Yêu Cầu Chờ Duyệt</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiClock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--warning)' }}>
            {pendingRequests.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>Cần admin phản hồi</div>
        </div>

        {/* Tổng giao dịch */}
        <div className="glass-card glass-card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Số Giao Dịch</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiDollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>
            {stats.totalTransactions}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>Toàn bộ người dùng</div>
        </div>

        {/* Tổng tiền thu chi */}
        <div className="glass-card glass-card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dòng Tiền Chi Tiêu</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiDollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)' }}>
            {formatCurrency(stats.totalExpense)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>Tổng chi tiêu toàn hệ thống</div>
        </div>
      </div>

      {/* Pending Requests Alert & Quick List */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiAlertCircle style={{ color: 'var(--warning)' }} /> Yêu Cầu Chỉnh Sửa Chi Tiêu Đang Chờ Phê Duyệt
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              Người dùng gửi yêu cầu sửa đổi chi tiêu và cần quyết định từ bạn
            </p>
          </div>
          <Link to="/admin/requests" className="btn btn-secondary btn-sm">
            Xem tất cả <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            ⏳ Đang tải yêu cầu...
          </div>
        ) : pendingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
            🎉 Tuyệt vời! Hiện không có yêu cầu chỉnh sửa nào đang chờ phê duyệt.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Khoản chi tiêu</th>
                  <th>Số tiền yêu cầu</th>
                  <th>Lý do gửi</th>
                  <th>Thời gian</th>
                  <th style={{ textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.slice(0, 5).map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{req.user?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{req.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.expense?.description}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        Cũ: {formatCurrency(req.expense?.amount)}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>
                      {formatCurrency(req.requestedAmount)}
                    </td>
                    <td style={{ maxWidth: '280px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      "{req.reason}"
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link to="/admin/requests" className="btn btn-primary btn-sm">
                        Xử Lý Ngay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
