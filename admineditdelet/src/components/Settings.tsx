import React, { useState } from 'react';

// Icon components
const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const NotificationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const AppearanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
  </svg>
);

const SystemIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

// Tab Button Component
const TabButton = ({ 
  label, 
  icon, 
  isActive, 
  onClick 
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200
        ${isActive 
          ? 'bg-gradient-primary text-white shadow-lg shadow-glow' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-gray-900'
        }
      `}
    >
      <div className={isActive ? 'text-white' : 'text-gray-600'}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
};

// Form Section Component
const FormSection = ({ 
  title, 
  description,
  children 
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ 
  enabled, 
  onChange, 
  label, 
  description 
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${enabled 
            ? 'bg-gradient-primary' 
            : 'bg-gray-300'
          }
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

// Main Settings Component
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    
    // Security settings
    twoFactorAuth: true,
    loginAlerts: false,
    sessionTimeout: 30,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    reportAlerts: true,
    systemUpdates: true,
    
    // Appearance settings
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    
    // System settings
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationIcon /> },
    { id: 'appearance', label: 'Appearance', icon: <AppearanceIcon /> },
    { id: 'system', label: 'System', icon: <SystemIcon /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4 md:space-y-6">
            <FormSection title="Personal Information" description="Update your personal details and contact information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => updateSetting('name', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={settings.role}
                  onChange={(e) => updateSetting('role', e.target.value)}
                  className="input"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </FormSection>

            <FormSection title="Profile Picture" description="Upload and manage your profile picture">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-brand rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold">
                  {settings.name.charAt(0)}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button className="btn-primary">Upload New</button>
                  <button className="btn-outline">Remove</button>
                </div>
              </div>
            </FormSection>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4 md:space-y-6">
            <FormSection title="Authentication" description="Manage your login and security preferences">
              <div className="space-y-4 md:space-y-6">
                <ToggleSwitch
                  enabled={settings.twoFactorAuth}
                  onChange={(value) => updateSetting('twoFactorAuth', value)}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                <ToggleSwitch
                  enabled={settings.loginAlerts}
                  onChange={(value) => updateSetting('loginAlerts', value)}
                  label="Login Alerts"
                  description="Receive notifications when someone logs into your account"
                />
              </div>
            </FormSection>

            <FormSection title="Session Management" description="Control your session settings and timeouts">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  className="input"
                />
              </div>
            </FormSection>

            <FormSection title="Password" description="Update your account password">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="input"
                  />
                </div>
              </div>
            </FormSection>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4 md:space-y-6">
            <FormSection title="Email Notifications" description="Choose what email notifications you want to receive">
              <div className="space-y-6">
                <ToggleSwitch
                  enabled={settings.emailNotifications}
                  onChange={(value) => updateSetting('emailNotifications', value)}
                  label="Email Notifications"
                  description="Receive general notifications via email"
                />
                <ToggleSwitch
                  enabled={settings.reportAlerts}
                  onChange={(value) => updateSetting('reportAlerts', value)}
                  label="Report Alerts"
                  description="Get notified about important reports and analytics"
                />
                <ToggleSwitch
                  enabled={settings.systemUpdates}
                  onChange={(value) => updateSetting('systemUpdates', value)}
                  label="System Updates"
                  description="Receive notifications about system updates and maintenance"
                />
              </div>
            </FormSection>

            <FormSection title="Push Notifications" description="Manage browser and mobile push notifications">
              <div className="space-y-6">
                <ToggleSwitch
                  enabled={settings.pushNotifications}
                  onChange={(value) => updateSetting('pushNotifications', value)}
                  label="Push Notifications"
                  description="Receive real-time notifications in your browser"
                />
              </div>
            </FormSection>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-4 md:space-y-6">
            <FormSection title="Theme" description="Customize the appearance and theme of your dashboard">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Color Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', name: 'Light', colors: ['bg-white', 'bg-gray-100'] },
                      { id: 'dark', name: 'Dark', colors: ['bg-gray-900', 'bg-gray-800'] },
                      { id: 'blue-yellow', name: 'Blue & Yellow', colors: ['bg-blue-500', 'bg-yellow-400'] }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateSetting('theme', theme.id)}
                        className={`
                          p-4 border-2 rounded-lg text-center transition-all duration-200
                          ${settings.theme === theme.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex space-x-1 mb-2 justify-center">
                          {theme.colors.map((color, index) => (
                            <div key={index} className={`w-4 h-4 rounded-full ${color}`}></div>
                          ))}
                        </div>
                        <span className="text-sm font-medium">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection title="Localization" description="Set your language and regional preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="input"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="input"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>
              </div>
            </FormSection>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-4 md:space-y-6">
            <FormSection title="System Preferences" description="Configure system-wide settings and preferences">
              <div className="space-y-6">
                <ToggleSwitch
                  enabled={settings.autoBackup}
                  onChange={(value) => updateSetting('autoBackup', value)}
                  label="Automatic Backups"
                  description="Automatically backup system data daily"
                />
                <ToggleSwitch
                  enabled={settings.maintenanceMode}
                  onChange={(value) => updateSetting('maintenanceMode', value)}
                  label="Maintenance Mode"
                  description="Enable maintenance mode for system updates"
                />
                <ToggleSwitch
                  enabled={settings.debugMode}
                  onChange={(value) => updateSetting('debugMode', value)}
                  label="Debug Mode"
                  description="Enable debug logging for troubleshooting"
                />
              </div>
            </FormSection>

            <FormSection title="API Configuration" description="Configure API settings and rate limits">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Rate Limit (requests per hour)
                </label>
                <input
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => updateSetting('apiRateLimit', parseInt(e.target.value))}
                  className="input"
                />
              </div>
            </FormSection>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-brand rounded-xl p-4 md:p-8 text-white shadow-glow">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-accent rounded-lg flex items-center justify-center shadow-accent-glow">
            <SettingsIcon />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Settings</h1>
            <p className="text-blue-100 text-sm md:text-lg">Manage your account and system preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4 md:p-6">
            <nav className="space-y-1 md:space-y-2">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn-primary flex items-center space-x-2">
          <SaveIcon />
          <span className="hidden sm:inline">Save Changes</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
