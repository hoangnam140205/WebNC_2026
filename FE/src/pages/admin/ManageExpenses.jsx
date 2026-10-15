import { useState, useEffect } from 'react';
import { expensesApi, userApi, categoriesApi } from '../../services/api';
import {
  FiSearch,
  FiFilter,
  FiTrash2,
  FiCalendar,
  FiUser,
} from 'react-icons/fi';

export function ManageExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userId, setUserId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        userId: userId || undefined,
        keyword: keyword || undefined,
        type: type || undefined,
        categoryId: categoryId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const res = await expensesApi.getAllAdmin(params);
      setExpenses(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Lỗi khi tải chi tiêu toàn hệ thống:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [usersRes, catsRes] = await Promise.all([
          userApi.getAll(),
          categoriesApi.getAll(),
        ]);
        setUsers(usersRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error('Lỗi tải metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [page, userId, type, categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Quản trị viên: Bạn có chắc chắn muốn xóa giao dịch này khỏi hệ thống?')) {
      try {
        await expensesApi.adminDelete(id);
        fetchExpenses();
      } catch (err) {
        alert('Không thể xóa giao dịch');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Quản Lý Chi Tiêu Toàn Hệ Thống</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Xem và kiểm soát tất cả giao dịch thu/chi phát sinh từ toàn bộ người dùng
        </p>
      </div>

      {/* Filter */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Người dùng</label>
              <select
                className="form-control"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setPage(1); }}
              >
                <option value="">Tất cả người dùng</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Từ khóa</label>
              <input
                type="text"
                placeholder="Mô tả, ghi chú..."
                className="form-control"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Loại</label>
              <select
                className="form-control"
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(1); }}
              >
                <option value="">Tất cả</option>
                <option value="expense">Chi tiêu</option>
                <option value="income">Thu nhập</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Từ ngày</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Đến ngày</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <FiFilter /> Lọc Giao Dịch
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Tổng số: <strong style={{ color: '#fff' }}>{total}</strong> giao dịch hệ thống
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
            ⏳ Đang tải dữ liệu...
          </div>
        ) : expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-dim)' }}>
            Không có giao dịch nào khớp với bộ lọc
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Ngày</th>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th>Ghi chú</th>
                  <th>Loại</th>
                  <th style={{ textAlign: 'right' }}>Số tiền</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{exp.user?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{exp.user?.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{exp.date}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>{exp.category?.icon || '📁'}</span>
                        <span>{exp.category?.name || 'Khác'}</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{exp.description}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{exp.note || '-'}</td>
                    <td>
                      <span className={`badge ${exp.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {exp.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        color: exp.type === 'income' ? 'var(--success)' : 'var(--danger)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {exp.type === 'income' ? '+' : '-'}
                      {formatCurrency(exp.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="btn btn-danger btn-sm btn-icon"
                        title="Xóa giao dịch này"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '16px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary btn-sm"
            >
              Trang trước
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary btn-sm"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
