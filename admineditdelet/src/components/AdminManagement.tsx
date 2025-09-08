import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

interface AdminManagementProps {
  onAdminAdded: () => void;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ onAdminAdded }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const adminData = { ...formData };
      await axios.post('http://localhost:5000/api/auth/create-admin', adminData, { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      setSuccess(`Admin "${formData.name}" created successfully!`);
      setFormData({ name: '', email: '', password: '' });
      onAdminAdded();
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to create admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-glow">
          <UserPlus className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Create New Admin</h3>
          <p className="text-muted-foreground">Add a new administrator to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter admin's full name"
              required
              className="input h-12"
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin's email"
              required
              className="input h-12"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter secure password (min 8 characters)"
              required
              minLength={8}
              className="input h-12 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating Admin...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Admin
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminManagement;
