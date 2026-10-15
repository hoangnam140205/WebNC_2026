import { useState, useEffect } from 'react';
import { categoriesApi } from '../../services/api';
import { FiPlus, FiTrash2, FiTag } from 'react-icons/fi';

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    icon: '📁',
    color: '#6366f1',
    type: 'expense',
  });
  const [submitting, setSubmitting] = useState(false);

  const icons = ['🍽️', '🛍️', '🚗', '💡', '🎮', '💊', '📚', '💰', '🎁', '📈', '🏠', '✈️', '☕', '💪'];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await categoriesApi.create(form);
      setIsModalOpen(false);
      setForm({ name: '', icon: '📁', color: '#6366f1', type: 'expense' });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi tạo danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoriesApi.delete(id);
        fetchCategories();
      } catch (err) {
        alert('Không thể xóa danh mục đang có giao dịch liên quan');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Danh Mục Chi Tiêu</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Phân loại các khoản chi tiêu và nguồn thu để quản lý khoa học
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <FiPlus size={18} /> Thêm Danh Mục
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          ⏳ Đang tải danh mục...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-card glass-card-interactive"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${cat.color || '#6366f1'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                  }}
                >
                  {cat.icon || '📁'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{cat.name}</div>
                  <span
                    className={`badge ${cat.type === 'income' ? 'badge-income' : 'badge-expense'}`}
                    style={{ fontSize: '0.72rem', marginTop: '4px' }}
                  >
                    {cat.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(cat.id)}
                className="btn btn-secondary btn-sm btn-icon"
                title="Xóa danh mục"
                style={{ color: '#fda4af' }}
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem' }}>Thêm Danh Mục Mới</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên danh mục *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="VD: Cà phê, Du lịch, Xăng xe..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Loại danh mục</label>
                  <select
                    className="form-control"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="expense">Khoản Chi Tiêu</option>
                    <option value="income">Khoản Thu Nhập</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Chọn Biểu Tượng Icon</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {icons.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setForm({ ...form, icon: ic })}
                        style={{
                          width: '40px',
                          height: '40px',
                          fontSize: '1.2rem',
                          borderRadius: '8px',
                          background: form.icon === ic ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                          border: form.icon === ic ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
                          cursor: 'pointer',
                        }}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Màu sắc đại diện</label>
                  <input
                    type="color"
                    className="form-control"
                    style={{ height: '42px', padding: '4px' }}
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Hủy Bỏ
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Đang tạo...' : 'Tạo Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
