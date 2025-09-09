import React, { useState, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/signup';
import AddStaffMember from './components/staffadd';
import StaffManagement from './components/StaffManagement';
import ProjectManagement from './components/ProjectManagement';
import StatsManagement from './components/StatsManagement';
import AdminDashboard from './pages/admin/dashboard';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import Users from './components/Users';
import Settings from './components/Settings';
import { BarChart3, Bell, Plus, Users as UsersIcon, Settings as SettingsIcon, LayoutDashboard, Image, FolderOpen } from "lucide-react";

// Admin Layout Component with Template Design
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: UsersIcon },
    { path: '/admin/staff', label: 'Staff Management', icon: UsersIcon },
    { path: '/admin/staffadd', label: 'Add Staff', icon: Plus },
    { path: '/admin/projects', label: 'Project Management', icon: FolderOpen },
    { path: '/admin/gallery', label: 'Gallery Management', icon: Image },
    { path: '/admin/statistics', label: '📊 Statistics', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  ];

  

  const handleLogout = () => {
    logout();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/admin/dashboard': return 'Dashboard Overview';
      case '/admin/users': return 'User Management';
      case '/admin/staff': return 'Staff Directory';
      case '/admin/staffadd': return 'Add Staff Member';
      case '/admin/projects': return 'Project Management';
      case '/admin/gallery': return 'Gallery Management';
      case '/admin/statistics': return 'Statistics Management';
      case '/admin/settings': return 'System Settings';
      default: return 'Admin Portal';
    }
  };

  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case '/admin/dashboard': return 'Welcome to your admin dashboard with analytics and insights';
      case '/admin/users': return 'Manage user accounts and permissions';
      case '/admin/staff': return 'View and manage staff information and contacts';
      case '/admin/staffadd': return 'Add new team members to the company directory';
      case '/admin/projects': return 'Manage ongoing and completed projects with full CRUD operations';
      case '/admin/gallery': return 'Manage gallery items, photos, and media content';
      case '/admin/statistics': return 'View and manage key statistics and metrics';
      case '/admin/settings': return 'Configure system settings and preferences';
      default: return 'Manage your application with ease';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Template Design */}
      <nav className="w-80 bg-gradient-brand shadow-2xl fixed h-full z-10 lg:flex hidden flex-col">
        {/* Fixed Header */}
        <div className="p-6 flex-shrink-0">
          {/* Logo/Header */}
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-white/20">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-accent-glow">
              <BarChart3 className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Admin Portal
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                Management Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-2">
            {navigationItems.map(({ path, label, icon: Icon }, index) => {
              const isActive = location.pathname === path;
              console.log(`Rendering nav item ${index}: ${label} at ${path}`, Icon);
              
              // Special handling for stats to debug
              if (path === '/admin/statistics') {
                console.log('STATISTICS ITEM FOUND - Rendering Statistics Management');
              }
              
              return (
                <Link key={path} to={path}>
                  <div
                    className={`w-full flex items-center justify-start h-12 px-4 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-accent text-secondary font-bold shadow-lg"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats Card - Fixed at bottom */}
        <div className="flex-shrink-0 p-6 mt-4">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Bell className="w-5 h-5 text-accent" />
              <span className="text-white font-semibold">Quick Stats</span>
            </div>
            <div className="text-white space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs">News Articles:</span>
                <span className="bg-accent text-secondary px-2 py-0.5 rounded text-xs font-bold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Staff Members:</span>
                <span className="bg-accent text-secondary px-2 py-0.5 rounded text-xs font-bold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Gallery Items:</span>
                <span className="bg-accent text-secondary px-2 py-0.5 rounded text-xs font-bold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Reports:</span>
                <span className="bg-accent text-secondary px-2 py-0.5 rounded text-xs font-bold">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Case Stories:</span>
                <span className="bg-accent text-secondary px-2 py-0.5 rounded text-xs font-bold">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Alumni:</span>
                <span className="bg-accent text-secondary px-2 py-0.5 rounded text-xs font-bold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Projects:</span>
                <span className="bg-accent text-secondary px-2 py-0.5 rounded text-xs font-bold">0</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full mt-3 text-blue-100 hover:bg-red-600/20 hover:text-red-300 py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-gradient-primary text-white p-3 rounded-lg shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <nav className="absolute left-0 top-0 h-full w-80 bg-gradient-brand shadow-2xl flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 flex-shrink-0">
              {/* Logo/Header */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-white/20">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-accent-glow">
                  <BarChart3 className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h1 className="text-white text-2xl font-bold tracking-tight">
                    Admin Portal
                  </h1>
                  <p className="text-blue-100 text-sm font-medium">
                    Management Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="space-y-2">
                {navigationItems.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link key={path} to={path} onClick={() => setMobileMenuOpen(false)}>
                      <div
                        className={`w-full flex items-center justify-start h-12 px-4 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-accent text-secondary font-bold shadow-lg"
                            : "text-blue-100 hover:bg-white/10 hover:text-white"
                        }`}
                        style={{ minHeight: '48px' }}
                      >
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="truncate">{label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content - Template Design */}
      <main className="flex-1 lg:ml-80 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 mt-16 lg:mt-0">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                {getPageTitle()}
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                {getPageDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card shadow-xl p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

// Private Route Component  
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/login" />;
};


// Test Component to verify Tailwind
const TestTailwind = () => (
  <div className="p-8 bg-red-500 text-white">
    <h1 className="text-4xl font-bold">Tailwind Test</h1>
    <p className="text-lg">If you see red background, Tailwind is working!</p>
    <div className="mt-4 p-4 bg-blue-600 rounded-lg">
      <p>Blue box with rounded corners</p>
    </div>
    <div className="mt-4 p-4 bg-yellow-500 text-black rounded-lg">
      <p>Yellow box - our accent color!</p>
    </div>
  </div>
);

// Main App Component
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* <Route path="/test" element={<TestTailwind />} /> */}
        <Route path="/test" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Dashboard Route */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        
        {/* Users Route */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        
        {/* Your existing Staff Routes - PRESERVED */}
        <Route
          path="/admin/staff"
          element={
            <PrivateRoute>
              <AdminLayout>
                <StaffManagement onStaffAdded={() => {}} />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/staffadd"
          element={
            <PrivateRoute>
              <AdminLayout>
                <AddStaffMember onStaffAdded={() => {}} />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        
        {/* Gallery Route */}
        <Route
          path="/admin/gallery"
          element={
            <PrivateRoute>
              <AdminLayout>
                <GalleryAdmin />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Project Management Route */}
        <Route
          path="/admin/projects"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ProjectManagement />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Statistics Management Route */}
        <Route
          path="/admin/statistics"
          element={
            <PrivateRoute>
              <AdminLayout>
                <StatsManagement refreshTrigger={0} />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Settings Route */}
        <Route
          path="/admin/settings"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Redirect all unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
