import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './pages/user/UserDashboard';
import { ExpensesList } from './pages/user/ExpensesList';
import { MyRequests } from './pages/user/MyRequests';
import { Categories } from './pages/user/Categories';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageExpenses } from './pages/admin/ManageExpenses';
import { ManageRequests } from './pages/admin/ManageRequests';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Flow (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/expenses" element={<ExpensesList />} />
            <Route path="/requests" element={<MyRequests />} />
            <Route path="/categories" element={<Categories />} />
          </Route>
        </Route>

        {/* Admin Flow (Protected with Admin Role) */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<Layout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/expenses" element={<ManageExpenses />} />
            <Route path="/admin/requests" element={<ManageRequests />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
