import { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiShield,
  FiUser,
  FiCheck,
} from 'react-icons/fi';

export function ManageUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'user',
    currency: 'VND',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      fullName: '',
      email: '',
      password: '',
      role: 'user',
      currency: 'VND',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      currency: user.currency || 'VND',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        const updateData = {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          currency: form.currency,
        };
        if (form.password) {
          updateData.password = form.password;
        }
        await userApi.update(editingUser.id, updateData);
        setAlertMsg({ type: 'success', text: '✅ Đã cập nhật thông tin người dùng thành công' });
      } else {
        await userApi.create(form);
        setAlertMsg({ type: 'success', text: '✅ Đã tạo tài khoản người dùng mới thành công' });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setAlertMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Có lỗi xảy ra khi lưu người dùng',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user) => {
    if (user.id === currentUser.id) {
      alert('Bạn không thể khóa tài khoản của chính mình!');
      return;
    }
    const action = user.isActive ? 'khóa' : 'mở khóa';
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản của ${user.fullName}?`)) {
      try {
        await userApi.toggleActive(user.id);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể thay đổi trạng thái tài khoản');
      }
    }
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser.id) {
      alert('Bạn không thể xóa tài khoản của chính mình!');
      return;
    }
    if (window.confirm(`CẢNH BÁO: Bạn có chắc muốn XÓA vĩnh viễn tài khoản ${user.fullName}? Mọi dữ liệu chi tiêu liên quan sẽ bị xóa.`)) {
      try {
        await userApi.delete(user.id);
        setAlertMsg({ type: 'success', text: 'Đã xóa người dùng thành công' });
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể xóa người dùng');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Quản Lý Tài Khoản Người Dùng</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Thêm, chỉnh sửa thông tin, phân quyền Admin/User và quản lý trạng thái tài khoản
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <FiUserPlus size={18} /> Thêm Tài Khoản Mới
        </button>
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

      {/* Users Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Tổng số: <strong style={{ color: '#fff' }}>{users.length}</strong> tài khoản
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
            ⏳ Đang tải danh sách người dùng...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Số chi tiêu</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: u.role === 'admin' ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'var(--primary-gradient)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                          }}
                        >
                          {u.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {u.role === 'admin' ? <FiShield /> : <FiUser />} {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: u.isActive ? 'var(--success-bg)' : 'var(--danger-bg)',
                          color: u.isActive ? 'var(--success)' : 'var(--danger)',
                          border: `1px solid ${u.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                        }}
                      >
                        {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{u.expenseCount || 0}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(u)}
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Chỉnh sửa thông tin"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(u)}
                          disabled={u.id === currentUser.id}
                          className="btn btn-secondary btn-sm btn-icon"
                          title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          style={{
                            color: u.isActive ? 'var(--warning)' : 'var(--success)',
                            opacity: u.id === currentUser.id ? 0.3 : 1,
                          }}
                        >
                          {u.isActive ? <FiLock size={14} /> : <FiUnlock size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={u.id === currentUser.id}
                          className="btn btn-danger btn-sm btn-icon"
                          title="Xóa tài khoản"
                          style={{ opacity: u.id === currentUser.id ? 0.3 : 1 }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>
                {editingUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Mật khẩu {editingUser ? '(Để trống nếu không muốn đổi)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    className="form-control"
                    placeholder={editingUser ? '••••••••' : 'Tối thiểu 6 ký tự'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Vai trò</label>
                    <select
                      className="form-control"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="user">Người dùng (User)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Đơn vị tiền tệ</label>
                    <select
                      className="form-control"
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    >
                      <option value="VND">VND (₫)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Hủy Bỏ
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  <FiCheck /> {submitting ? 'Đang lưu...' : editingUser ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
