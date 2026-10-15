import { useState, useEffect } from 'react';
import { expensesApi, categoriesApi, editRequestsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiSend,
  FiX,
  FiCheck,
  FiCalendar,
  FiClock,
} from 'react-icons/fi';

export function ExpensesList() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    amount: '',
    description: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    categoryId: '',
  });

  // Edit Request Form State
  const [editRequestForm, setEditRequestForm] = useState({
    requestedAmount: '',
    requestedDescription: '',
    requestedNote: '',
    requestedDate: '',
    requestedType: 'expense',
    requestedCategoryId: '',
    reason: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: user?.currency || 'VND',
    }).format(amount || 0);
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        keyword: keyword || undefined,
        type: type || undefined,
        categoryId: categoryId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
      };
      const res = await expensesApi.getAll(params);
      setExpenses(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Lỗi khi tải chi tiêu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [page, type, categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExpenses();
  };

  const handleResetFilter = () => {
    setKeyword('');
    setType('');
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
    setTimeout(fetchExpenses, 0);
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await expensesApi.create({
        ...createForm,
        amount: parseFloat(createForm.amount),
        categoryId: createForm.categoryId || undefined,
      });
      setIsCreateModalOpen(false);
      setCreateForm({
        amount: '',
        description: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        categoryId: '',
      });
      setAlertMsg({ type: 'success', text: '✅ Đã thêm khoản giao dịch mới thành công!' });
      fetchExpenses();
    } catch (err) {
      setAlertMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Có lỗi xảy ra khi thêm giao dịch',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditRequestModal = (expense) => {
    setSelectedExpense(expense);
    setEditRequestForm({
      requestedAmount: expense.amount,
      requestedDescription: expense.description,
      requestedNote: expense.note || '',
      requestedDate: expense.date,
      requestedType: expense.type,
      requestedCategoryId: expense.categoryId || '',
      reason: '',
    });
    setIsEditRequestModalOpen(true);
  };

  const handleSubmitEditRequest = async (e) => {
    e.preventDefault();
    if (!editRequestForm.reason.trim()) {
      setAlertMsg({ type: 'danger', text: 'Vui lòng cung cấp lý do cần chỉnh sửa' });
      return;
    }
    setSubmitting(true);
    try {
      await editRequestsApi.create({
        expenseId: selectedExpense.id,
        requestedAmount: parseFloat(editRequestForm.requestedAmount),
        requestedDescription: editRequestForm.requestedDescription,
        requestedNote: editRequestForm.requestedNote,
        requestedDate: editRequestForm.requestedDate,
        requestedType: editRequestForm.requestedType,
        requestedCategoryId: editRequestForm.requestedCategoryId || undefined,
        reason: editRequestForm.reason,
      });
      setIsEditRequestModalOpen(false);
      setAlertMsg({
        type: 'success',
        text: '📨 Yêu cầu chỉnh sửa đã được gửi tới Quản trị viên để xét duyệt!',
      });
      fetchExpenses();
    } catch (err) {
      setAlertMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Không thể gửi yêu cầu chỉnh sửa',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      try {
        await expensesApi.delete(id);
        setAlertMsg({ type: 'success', text: 'Đã xóa giao dịch thành công' });
        fetchExpenses();
      } catch (err) {
        setAlertMsg({ type: 'danger', text: 'Xóa giao dịch thất bại' });
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Sổ Chi Tiêu</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Quản lý, tìm kiếm và gửi yêu cầu chỉnh sửa các khoản thu/chi cá nhân
          </p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
          <FiPlus size={18} /> Thêm Khoản Mới
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

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {/* Keyword Search */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tìm kiếm từ khóa</label>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Mô tả, ghi chú..."
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            {/* Type */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Loại giao dịch</label>
              <select className="form-control" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
                <option value="">Tất cả (Thu & Chi)</option>
                <option value="expense">Khoản Chi Tiêu</option>
                <option value="income">Khoản Thu Nhập</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Danh mục</label>
              <select className="form-control" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Từ ngày</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={handleResetFilter} className="btn btn-secondary btn-sm">
              Đặt lại bộ lọc
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <FiFilter /> Áp Dụng Tìm Kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Expenses Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Tìm thấy <strong style={{ color: '#fff' }}>{total}</strong> giao dịch
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Trang {page} / {totalPages}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
            ⏳ Đang tải danh sách chi tiêu...
          </div>
        ) : expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>🔍 Không tìm thấy khoản chi tiêu nào phù hợp</p>
            <p style={{ fontSize: '0.85rem' }}>Hãy thử thay đổi điều kiện tìm kiếm hoặc thêm giao dịch mới</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th>Ghi chú</th>
                  <th>Loại</th>
                  <th style={{ textAlign: 'right' }}>Số tiền</th>
                  <th style={{ textAlign: 'center' }}>Trạng thái yêu cầu</th>
                  <th style={{ textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => {
                  const hasPendingRequest = exp.editRequests?.some((r) => r.status === 'pending');
                  return (
                    <tr key={exp.id}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                        <FiCalendar style={{ marginRight: '6px' }} />
                        {exp.date}
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span>{exp.category?.icon || '📁'}</span>
                          <span style={{ fontWeight: 600 }}>{exp.category?.name || 'Chung'}</span>
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{exp.description}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {exp.note || '-'}
                      </td>
                      <td>
                        <span className={`badge ${exp.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {exp.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 700,
                          fontSize: '0.98rem',
                          color: exp.type === 'income' ? 'var(--success)' : 'var(--danger)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {exp.type === 'income' ? '+' : '-'}
                        {formatCurrency(exp.amount)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {hasPendingRequest ? (
                          <span className="badge badge-pending">
                            <FiClock /> Chờ duyệt sửa
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Bình thường</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => openEditRequestModal(exp)}
                            disabled={hasPendingRequest}
                            className="btn btn-secondary btn-sm"
                            title={hasPendingRequest ? 'Khoản này đã có yêu cầu đang chờ admin duyệt' : 'Gửi yêu cầu chỉnh sửa tới admin'}
                            style={{
                              opacity: hasPendingRequest ? 0.5 : 1,
                              cursor: hasPendingRequest ? 'not-allowed' : 'pointer',
                              padding: '6px 10px',
                            }}
                          >
                            <FiEdit3 size={14} /> Yêu cầu sửa
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="btn btn-danger btn-sm btn-icon"
                            title="Xóa khoản này"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
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

      {/* CREATE EXPENSE MODAL */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Thêm Khoản Thu / Chi Mới</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateExpense}>
              <div className="modal-body">
                {/* Type Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, type: 'expense' })}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: createForm.type === 'expense' ? '2px solid var(--danger)' : '1px solid var(--border-glass)',
                      background: createForm.type === 'expense' ? 'var(--danger-bg)' : 'var(--bg-input)',
                      color: createForm.type === 'expense' ? 'var(--danger)' : 'var(--text-muted)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    💸 Khoản Chi Tiêu
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, type: 'income' })}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: createForm.type === 'income' ? '2px solid var(--success)' : '1px solid var(--border-glass)',
                      background: createForm.type === 'income' ? 'var(--success-bg)' : 'var(--bg-input)',
                      color: createForm.type === 'income' ? 'var(--success)' : 'var(--text-muted)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    💰 Khoản Thu Nhập
                  </button>
                </div>

                {/* Amount */}
                <div className="form-group">
                  <label className="form-label">Số tiền ({user?.currency || 'VND'}) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    className="form-control"
                    placeholder="VD: 50000"
                    value={createForm.amount}
                    onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Mô tả giao dịch *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="VD: Ăn trưa bún bò, Mua cà phê..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  />
                </div>

                {/* Category & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-control"
                      value={createForm.categoryId}
                      onChange={(e) => setCreateForm({ ...createForm, categoryId: e.target.value })}
                    >
                      <option value="">Chọn danh mục...</option>
                      {categories
                        .filter((c) => c.type === createForm.type)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ngày thực hiện *</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={createForm.date}
                      onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ghi chú thêm</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="Chi tiết hóa đơn, địa điểm..."
                    value={createForm.note}
                    onChange={(e) => setCreateForm({ ...createForm, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
                  Hủy Bỏ
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  <FiCheck /> {submitting ? 'Đang lưu...' : 'Lưu Giao Dịch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT REQUEST MODAL */}
      {isEditRequestModalOpen && selectedExpense && (
        <div className="modal-overlay" onClick={() => setIsEditRequestModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Gửi Yêu Cầu Chỉnh Sửa Chi Tiêu</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Yêu cầu sẽ được gửi tới Quản trị viên để kiểm duyệt trước khi áp dụng
                </span>
              </div>
              <button
                onClick={() => setIsEditRequestModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEditRequest}>
              <div className="modal-body">
                {/* Thông tin hiện tại */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-glass)',
                    marginBottom: '18px',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ color: 'var(--text-dim)', marginBottom: '4px' }}>Khoản chi tiêu hiện tại:</div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>
                    {selectedExpense.description} -{' '}
                    <span style={{ color: selectedExpense.type === 'income' ? '#10b981' : '#f43f5e' }}>
                      {formatCurrency(selectedExpense.amount)}
                    </span>{' '}
                    ({selectedExpense.date})
                  </div>
                </div>

                {/* Requested Amount */}
                <div className="form-group">
                  <label className="form-label">Số tiền mới mong muốn ({user?.currency || 'VND'}) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    className="form-control"
                    value={editRequestForm.requestedAmount}
                    onChange={(e) => setEditRequestForm({ ...editRequestForm, requestedAmount: e.target.value })}
                  />
                </div>

                {/* Requested Description */}
                <div className="form-group">
                  <label className="form-label">Mô tả mới *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editRequestForm.requestedDescription}
                    onChange={(e) => setEditRequestForm({ ...editRequestForm, requestedDescription: e.target.value })}
                  />
                </div>

                {/* Category & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Danh mục mới</label>
                    <select
                      className="form-control"
                      value={editRequestForm.requestedCategoryId}
                      onChange={(e) => setEditRequestForm({ ...editRequestForm, requestedCategoryId: e.target.value })}
                    >
                      <option value="">Chọn danh mục...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ngày mới *</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={editRequestForm.requestedDate}
                      onChange={(e) => setEditRequestForm({ ...editRequestForm, requestedDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Reason (Bắt buộc) */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Lý do yêu cầu chỉnh sửa * <span style={{ color: 'var(--danger)' }}>(Bắt buộc)</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="form-control"
                    placeholder="VD: Tôi nhập nhầm số tiền từ 50,000 thành 500,000; Hóa đơn ngày hôm qua bị sai..."
                    value={editRequestForm.reason}
                    onChange={(e) => setEditRequestForm({ ...editRequestForm, reason: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsEditRequestModalOpen(false)} className="btn btn-secondary">
                  Hủy Bỏ
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  <FiSend /> {submitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Chỉnh Sửa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
