import React, { useState } from 'react';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    setLoginError('');
    
    if (name !== 'rememberMe') {
      const error = validateField(name, val);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'rememberMe') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      // FIRST: Try admin login
      const adminResponse = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const adminData = await adminResponse.json();

      if (adminResponse.ok) {
        localStorage.setItem('adminToken', adminData.token);
        localStorage.setItem('adminUser', JSON.stringify(adminData.admin));
        window.location.href = '/admin/dashboard';
        return;
      }

      // SECOND: Try user login
      const userResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const userData = await userResponse.json();

      if (userResponse.ok) {
        // Clear old user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Store new user data
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        
        // Redirect to questionnaire
        window.location.href = '/';
      } else {
        setLoginError(userData.error || 'Invalid email or password');
      }
    } catch (error) {
      setLoginError('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0d7ff 100%)',
      overflow: 'auto',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '36px 40px 40px 40px',
        maxWidth: '420px',
        width: '100%',
        border: '1px solid #e5e4e7',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 0.5s ease-out',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(170, 59, 255, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <span style={{ fontSize: '28px' }}>🔐</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#aa3bff',
            margin: 0,
            letterSpacing: '-0.5px',
          }}>Welcome Back</h1>
          <p style={{ 
            color: '#6b6375', 
            marginTop: '4px',
            fontSize: '14px',
          }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#08060d', 
              marginBottom: '6px' 
            }}>
              Email Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '11px 16px',
                border: `2px solid ${errors.email ? '#ef4444' : '#e5e4e7'}`,
                borderRadius: '12px',
                background: '#ffffff',
                color: '#08060d',
                boxSizing: 'border-box',
                outline: 'none',
                fontSize: '14px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#aa3bff';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(170, 59, 255, 0.08)';
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = '#e5e4e7';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            />
            {errors.email && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#08060d', 
              marginBottom: '6px' 
            }}>
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  paddingRight: '48px',
                  border: `2px solid ${errors.password ? '#ef4444' : '#e5e4e7'}`,
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#08060d',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#aa3bff';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(170, 59, 255, 0.08)';
                }}
                onBlur={(e) => {
                  if (!errors.password) {
                    e.currentTarget.style.borderColor = '#e5e4e7';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b6375',
                  fontSize: '18px',
                  padding: '4px',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '4px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#aa3bff',
                  cursor: 'pointer',
                }}
              />
              <label style={{ 
                fontSize: '13px', 
                color: '#6b6375', 
                cursor: 'pointer',
              }}>
                Remember me
              </label>
            </div>
            <a 
              href="#" 
              style={{ 
                fontSize: '13px', 
                color: '#aa3bff',
                textDecoration: 'none',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#aa3bff'}
            >
              Forgot password?
            </a>
          </div>

          {/* Login Error */}
          {loginError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#dc2626',
              fontSize: '13px',
              textAlign: 'center',
            }}>
              {loginError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: isSubmitting ? '#9ca3af' : '#aa3bff',
              color: 'white',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s',
              marginTop: '4px',
              boxShadow: '0 4px 16px rgba(170, 59, 255, 0.25)',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = '#9333ea';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(170, 59, 255, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = '#aa3bff';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(170, 59, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b6375',
          marginTop: '20px',
          marginBottom: 0,
        }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#aa3bff',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#aa3bff'}
          >
            Create account
          </button>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;