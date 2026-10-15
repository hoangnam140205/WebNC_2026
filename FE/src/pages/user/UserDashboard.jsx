import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expensesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPlus,
  FiCalendar,
  FiArrowRight,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, byCategory: [] });
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: user?.currency || 'VND',
    }).format(amount || 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, monthlyRes, expensesRes] = await Promise.all([
          expensesApi.getStatistics(),
          expensesApi.getMonthlyReport(new Date().getFullYear()),
          expensesApi.getAll({ limit: 5 }),
        ]);

        setStats(statsRes.data);
        setMonthlyData(
          (monthlyRes.data || []).map((m) => ({
            name: `T${m.month}`,
            Thu: m.income,
            Chi: m.expense,
          })),
        );
        setRecentExpenses(expensesRes.data?.data || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#3b82f6'];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        ⏳ Đang tải dữ liệu tổng quan...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
            Xin chào, {user?.fullName}! 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Dưới đây là bức tranh tài chính cá nhân và các khoản chi tiêu của bạn.
          </p>
        </div>
        <Link to="/expenses" className="btn btn-primary">
          <FiPlus size={18} /> Ghi Chép Chi Tiêu
        </Link>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Số Dư */}
        <div className="glass-card glass-card-interactive" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Số Dư Khả Dụng</span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiDollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.balance >= 0 ? '#10b981' : '#f43f5e' }}>
            {formatCurrency(stats.balance)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            Thu nhập trừ chi tiêu lũy kế
          </div>
        </div>

        {/* Tổng Thu */}
        <div className="glass-card glass-card-interactive" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Thu Nhập</span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiTrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
            +{formatCurrency(stats.totalIncome)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            Lương, thưởng & nguồn thu
          </div>
        </div>

        {/* Tổng Chi */}
        <div className="glass-card glass-card-interactive" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Chi Tiêu</span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiTrendingDown size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)' }}>
            -{formatCurrency(stats.totalExpense)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            Mua sắm, ăn uống, sinh hoạt
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Monthly Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCalendar /> Biểu Đồ Thu & Chi {new Date().getFullYear()}
          </h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(val) => formatCurrency(val)}
                />
                <Bar dataKey="Thu" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Chi" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            Phân Bổ Chi Tiêu Theo Danh Mục
          </h3>
          {stats.byCategory && stats.byCategory.filter((c) => c.type === 'expense').length > 0 ? (
            <div style={{ height: '280px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byCategory.filter((c) => c.type === 'expense')}
                    dataKey="total"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {stats.byCategory
                      .filter((c) => c.type === 'expense')
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.categoryColor || COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(val) => formatCurrency(val)}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              style={{
                height: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-dim)',
                fontSize: '0.9rem',
              }}
            >
              Chưa có dữ liệu chi tiêu để hiển thị biểu đồ
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Giao Dịch Gần Đây</h3>
          <Link
            to="/expenses"
            style={{
              fontSize: '0.85rem',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Xem tất cả <FiArrowRight />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)' }}>
            Chưa có giao dịch nào được ghi lại.{' '}
            <Link to="/expenses" style={{ color: 'var(--primary)' }}>
              Thêm khoản chi đầu tiên ngay!
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th>Loại</th>
                  <th style={{ textAlign: 'right' }}>Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{exp.date}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>{exp.category?.icon || '📁'}</span>
                        <span>{exp.category?.name || 'Khác'}</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{exp.description}</td>
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
                      }}
                    >
                      {exp.type === 'income' ? '+' : '-'}
                      {formatCurrency(exp.amount)}
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
