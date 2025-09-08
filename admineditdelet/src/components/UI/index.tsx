import React, { useState } from 'react';

// Button Component
export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  disabled = false,
  onClick,
  ...props 
}: {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 hover:from-yellow-500 hover:to-yellow-600 focus:ring-yellow-500 shadow-md hover:shadow-lg',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-md hover:shadow-lg'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:transform hover:scale-105';
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any;
}) => {
  const hoverClasses = hover ? 'hover:shadow-lg hover:transform hover:scale-[1.02] transition-all duration-200' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-md ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <div className={`inline-block w-full ${sizes[size]} p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  className = '',
  required = false,
  ...props 
}: {
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
  [key: string]: any;
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  variant = 'primary', 
  size = 'sm',
  children, 
  className = '' 
}: {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-gray-100 text-gray-800'
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ 
  size = 'md', 
  className = '' 
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${sizes[size]} ${className}`} />
  );
};

// Alert Component
export const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  onDismiss,
  className = '' 
}: {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}) => {
  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-opacity-75 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Toggle Component
export const Toggle = ({ 
  enabled, 
  onChange, 
  label, 
  description,
  size = 'md',
  className = '' 
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizes = {
    sm: { toggle: 'h-4 w-7', thumb: 'h-3 w-3', translate: 'translate-x-3' },
    md: { toggle: 'h-6 w-11', thumb: 'h-4 w-4', translate: 'translate-x-6' },
    lg: { toggle: 'h-8 w-14', thumb: 'h-6 w-6', translate: 'translate-x-7' }
  };
  
  const currentSize = sizes[size];
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="font-medium text-gray-900">{label}</p>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${enabled 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gray-200'
          } ${currentSize.toggle}
        `}
      >
        <span
          className={`
            inline-block transform rounded-full bg-white transition duration-200 ease-in-out
            ${enabled ? currentSize.translate : 'translate-x-1'} ${currentSize.thumb}
          `}
        />
      </button>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showValue = true,
  variant = 'primary',
  size = 'md',
  className = '' 
}: {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600',
    secondary: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-orange-500 to-orange-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600'
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div 
          className={`${sizes[size]} ${variants[variant]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Tab Component
export const Tabs = ({ 
  tabs, 
  activeTab, 
  onChange, 
  variant = 'default',
  className = '' 
}: {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}) => {
  const variants = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-2 font-medium text-sm transition-colors duration-200',
      active: 'text-blue-600 border-b-2 border-blue-600',
      inactive: 'text-gray-500 hover:text-gray-700'
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: 'px-4 py-2 font-medium text-sm rounded-md transition-all duration-200',
      active: 'bg-white text-blue-600 shadow-sm',
      inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
    },
    underline: {
      container: 'space-x-8',
      tab: 'px-1 py-2 font-medium text-sm border-b-2 transition-colors duration-200',
      active: 'text-blue-600 border-blue-600',
      inactive: 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
    }
  };
  
  const currentVariant = variants[variant];
  
  return (
    <div className={`flex ${currentVariant.container} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            ${currentVariant.tab}
            ${activeTab === tab.id ? currentVariant.active : currentVariant.inactive}
          `}
        >
          <div className="flex items-center space-x-2">
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

// Dropdown Component
export const Dropdown = ({ 
  trigger, 
  children, 
  position = 'bottom-right',
  className = '' 
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const positions = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2'
  };
  
  return (
    <div className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute z-20 min-w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 ${positions[position]}`}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default {
  Button,
  Card,
  Modal,
  Input,
  Badge,
  LoadingSpinner,
  Alert,
  Toggle,
  ProgressBar,
  Tabs,
  Dropdown
};
