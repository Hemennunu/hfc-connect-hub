import React, { useState } from 'react';

// Icon components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const MoreIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

// Sample user data for visual display
const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', avatar: 'JD', lastLogin: '2024-01-15' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'Editor', status: 'Active', avatar: 'SW', lastLogin: '2024-01-14' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Viewer', status: 'Inactive', avatar: 'MJ', lastLogin: '2024-01-10' },
  { id: 4, name: 'Emma Davis', email: 'emma.davis@example.com', role: 'Editor', status: 'Active', avatar: 'ED', lastLogin: '2024-01-15' },
  { id: 5, name: 'Robert Smith', email: 'robert.smith@example.com', role: 'Admin', status: 'Active', avatar: 'RS', lastLogin: '2024-01-13' },
];

// User Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Role Badge Component
const RoleBadge = ({ role }: { role: string }) => {
  const roleColors = {
    Admin: 'bg-blue-100 text-blue-800',
    Editor: 'bg-yellow-100 text-yellow-800',
    Viewer: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}`}>
      {role}
    </span>
  );
};

// User Table Row Component
const UserRow = ({ user }: { user: typeof sampleUsers[0] }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
      <td className="px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-brand rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
            {user.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 text-sm md:text-base truncate">{user.name}</p>
            <p className="text-xs md:text-sm text-gray-500 truncate">{user.email}</p>
            <div className="sm:hidden mt-1 flex space-x-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-3 md:px-6 py-3 md:py-4 hidden md:table-cell">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500 hidden lg:table-cell">
        {user.lastLogin}
      </td>
      <td className="px-3 md:px-6 py-3 md:py-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 md:p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-blue-50 transition-colors duration-200"
          >
            <MoreIcon />
          </button>
          {showActions && (
            <div className="absolute right-0 top-8 w-40 md:w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
              <button className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <EditIcon />
                <span>Edit User</span>
              </button>
              <button className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                <DeleteIcon />
                <span>Delete User</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Users Component
const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-brand rounded-xl p-4 md:p-8 text-white shadow-glow">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-accent rounded-lg flex items-center justify-center shadow-accent-glow">
              <UsersIcon />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">User Management</h1>
              <p className="text-blue-100 text-sm md:text-lg">Manage all users and their permissions</p>
            </div>
          </div>
          <div className="flex md:block justify-center">
            <div className="text-center bg-white/10 rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold">{sampleUsers.length}</div>
              <div className="text-blue-100 text-xs md:text-sm">Total Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="card p-4 md:p-6 hover:shadow-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">2,547</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white shadow-glow">
              <UsersIcon />
            </div>
          </div>
        </div>
        
        <div className="card p-4 md:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-xl md:text-2xl font-bold text-success">2,124</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="card p-4 md:p-6 hover:shadow-accent-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-xl md:text-2xl font-bold text-accent">423</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-accent rounded-lg flex items-center justify-center text-secondary shadow-accent-glow">
              <PlusIcon />
            </div>
          </div>
        </div>
        
        <div className="card p-4 md:p-6 hover:shadow-secondary-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Admins</p>
              <p className="text-xl md:text-2xl font-bold text-secondary">12</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-secondary rounded-lg flex items-center justify-center text-white shadow-secondary-glow">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 text-sm"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="input text-sm min-w-0 sm:min-w-[120px]"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input text-sm min-w-0 sm:min-w-[120px]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          
          {/* Add User Button */}
          <button className="btn-accent flex items-center justify-center space-x-2 w-full sm:w-auto">
            <PlusIcon />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-surface border-b border-gray-200">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">User</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 hidden sm:table-cell">Role</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 hidden md:table-cell">Status</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 hidden lg:table-cell">Last Login</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="text-xs md:text-sm text-gray-600 order-2 sm:order-1">
            Showing 1 to 10 of {sampleUsers.length} users
          </div>
          <div className="flex items-center space-x-1 md:space-x-2 order-1 sm:order-2">
            <button className="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
              Prev
            </button>
            <button className="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm bg-gradient-primary text-white rounded-lg shadow-md">
              1
            </button>
            <button className="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200 hidden sm:block">
              2
            </button>
            <button className="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200 hidden sm:block">
              3
            </button>
            <button className="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <button className="p-3 md:p-4 border-2 border-dashed border-blue-300 rounded-lg text-primary hover:bg-blue-50 hover:border-primary transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base">
            <PlusIcon />
            <span className="hidden sm:inline">Bulk Import Users</span>
            <span className="sm:hidden">Import</span>
          </button>
          <button className="p-3 md:p-4 border-2 border-dashed border-yellow-300 rounded-lg text-accent hover:bg-yellow-50 hover:border-accent transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Export User List</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button className="p-3 md:p-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-400 transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base sm:col-span-2 lg:col-span-1">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
