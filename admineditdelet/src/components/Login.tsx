import React, { useState } from 'react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Login Icon Component
const LoginIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Login: React.FC = () => {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login({ email, password });

      // Assuming your API returns a token and user role in res.data
      authLogin(res.data.token, res.data.role);

      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Show a generic error message
      setError('Invalid credentials');
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-brand flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-accent-glow">
            <LoginIcon />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-blue-100 text-lg">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${email === '' ? 'text-gray-400' : 'text-transparent'}`}>
                <EmailIcon />
              </div>
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input pl-12 peer"
                disabled={isLoading}
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-10"
              >
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${password === '' ? 'text-gray-400' : 'text-transparent'}`}>
                <LockIcon />
              </div>
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input pl-12 peer"
                disabled={isLoading}
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-10"
              >
                Password
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`btn-primary w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Admin Notice - Removed Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Admin access only. Contact system administrator for account access.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            © 2024 Admin Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
