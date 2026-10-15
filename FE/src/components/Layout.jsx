import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiPieChart,
  FiDollarSign,
  FiGitPullRequest,
  FiTag,
  FiUsers,
  FiLayers,
  FiLogOut,
  FiShield,
  FiUserCheck,
  FiCheckCircle,
} from 'react-icons/fi';

export function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminSection = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                boxShadow: '0 4px 15px var(--primary-glow)',
              }}
            >
              💎
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                ExpenseFlow
              </h1>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {isAdminSection ? 'QUẢN TRỊ VIÊN' : 'QUẢN LÝ CÁ NHÂN'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {isAdminSection ? (
            <>
              <div style={{ padding: '6px 12px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Admin Portal
              </div>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiPieChart size={18} /> Tổng Quan Hệ Thống
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiUsers size={18} /> Quản Lý Tài Khoản
              </NavLink>
              <NavLink
                to="/admin/expenses"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiDollarSign size={18} /> Quản Lý Chi Tiêu
              </NavLink>
              <NavLink
                to="/admin/requests"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiCheckCircle size={18} /> Duyệt Chỉnh Sửa
              </NavLink>

              <div style={{ height: '1px', background: 'var(--border-glass)', margin: '14px 0' }} />

              <NavLink
                to="/dashboard"
                className="sidebar-link"
                style={{ color: '#06b6d4' }}
              >
                <FiUserCheck size={18} /> Quay Lại Giao Diện User
              </NavLink>
            </>
          ) : (
            <>
              <div style={{ padding: '6px 12px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Menu Cá Nhân
              </div>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiPieChart size={18} /> Bảng Điều Khiển
              </NavLink>
              <NavLink
                to="/expenses"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiDollarSign size={18} /> Sổ Chi Tiêu & Tìm Kiếm
              </NavLink>
              <NavLink
                to="/requests"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiGitPullRequest size={18} /> Yêu Cầu Chỉnh Sửa
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiTag size={18} /> Danh Mục Chi Tiêu
              </NavLink>

              {isAdmin && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '14px 0' }} />
                  <NavLink
                    to="/admin"
                    className="sidebar-link"
                    style={{
                      background: 'rgba(139, 92, 246, 0.12)',
                      color: '#a78bfa',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <FiShield size={18} /> Chuyển Sang Trang Admin
                  </NavLink>
                </>
              )}
            </>
          )}
        </nav>

        {/* User Card & Logout */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border-glass)',
            background: 'rgba(10, 15, 30, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: user?.role === 'admin' ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}
              >
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.fullName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
              </div>
            </div>
            <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <FiLogOut size={16} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hệ thống quản lý:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {isAdminSection ? 'Bảng Điều Khiển Quản Trị Viên' : 'Quản Lý Chi Tiêu Cá Nhân'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Tiền tệ: <span style={{ color: '#10b981', fontWeight: 700 }}>{user?.currency || 'VND'}</span>
            </div>
            {isAdmin && !isAdminSection && (
              <NavLink to="/admin" className="btn btn-primary btn-sm">
                <FiShield size={14} /> Đi tới Admin
              </NavLink>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '32px', flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }
        .sidebar-link.active {
          color: #fff;
          background: var(--primary-gradient);
          box-shadow: 0 4px 15px var(--primary-glow);
        }
      `}</style>
    </div>
  );
}
