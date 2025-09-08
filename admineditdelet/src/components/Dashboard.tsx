import React from 'react';

// Icon components for visual display only
const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// Stats Card Component - Visual only
const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  gradient 
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  gradient: string;
}) => {
  return (
    <div className="card p-6 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? '↗' : '↘'} {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${gradient}`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// Chart Placeholder Component - Visual only
const ChartPlaceholder = ({ title }: { title: string }) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUpIcon />
          </div>
          <p className="text-gray-600 font-medium">Chart Area</p>
          <p className="text-sm text-gray-400">Connect your data here</p>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component - Visual Design Only
const Dashboard: React.FC = () => {
  // Sample data for visual display - replace with your backend data
  const statsData = [
    {
      title: 'Total Users',
      value: '2,547',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <UsersIcon />,
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Active Sessions',
      value: '1,429',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <ActivityIcon />,
      gradient: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'Documents',
      value: '892',
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: <DocumentIcon />,
      gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    },
    {
      title: 'Revenue',
      value: '$47,210',
      change: '-2.4%',
      changeType: 'negative' as const,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>,
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100 text-lg">Here's your beautiful dashboard with yellow and blue design.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <TrendingUpIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Visual Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Analytics Overview" />
        <ChartPlaceholder title="User Growth" />
      </div>

      {/* Quick Actions - Visual Only */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary text-sm py-3 px-4">
            Add User
          </button>
          <button className="btn-secondary text-sm py-3 px-4">
            Generate Report
          </button>
          <button className="btn-outline text-sm py-3 px-4">
            System Settings
          </button>
          <button className="btn-outline text-sm py-3 px-4">
            View Analytics
          </button>
        </div>
      </div>

      {/* System Status - Visual Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Server Status</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">CPU Usage</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Memory</span>
                <span className="font-medium">62%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage</h3>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="10" 
                  strokeLinecap="round" strokeDasharray="283" strokeDashoffset="71"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#fbbf24"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">75%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">850GB of 1TB used</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SSL Certificate</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Valid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Firewall</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backup Status</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Running</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed - Visual Layout */}
      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest system activities</p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ActivityIcon />
            </div>
            <p className="text-gray-600 font-medium">Activity Feed</p>
            <p className="text-sm text-gray-400">Connect your backend activity data here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
