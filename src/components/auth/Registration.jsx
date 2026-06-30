import React, { useState } from 'react';
import { API_URL } from '../config';

const Registration = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value && !/^[\d\s+()-]{10,}$/.test(value.replace(/\s/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'role':
        if (!value) error = 'Please select a role';
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
    const error = validateField(name, val);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (!formData.termsAccepted) {
      setErrors(prev => ({ ...prev, termsAccepted: 'You must accept the Terms & Conditions' }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          termsAccepted: formData.termsAccepted,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        setErrors({ submit: data.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const TermsModal = () => {
    if (!showTerms) return null;
    
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease-out',
      }}>
        <div style={{
          background: 'var(--bg, #ffffff)',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.4s ease-out',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 28px',
            borderBottom: '1px solid var(--border, #e5e4e7)',
          }}>
            <h2 style={{ 
              margin: 0, 
              color: 'var(--text-h, #08060d)', 
              fontSize: '20px',
              fontWeight: '600',
            }}>Terms & Conditions</h2>
            <button
              onClick={() => setShowTerms(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: 'var(--text, #6b6375)',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--social-bg, #f4f3ec)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ✕
            </button>
          </div>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px',
            color: 'var(--text, #6b6375)',
            lineHeight: 1.7,
            fontSize: '14px',
          }}>
            <div style={{
              background: 'rgba(170, 59, 255, 0.06)',
              border: '1px solid rgba(170, 59, 255, 0.15)',
              borderRadius: '12px',
              padding: '18px 20px',
              marginBottom: '24px',
            }}>
              <p style={{ fontWeight: '600', color: '#aa3bff', margin: 0, fontSize: '15px' }}>
                🔒 Your Privacy Matters
              </p>
              <p style={{ fontSize: '13px', margin: '6px 0 0 0', color: 'var(--text, #6b6375)' }}>
                We collect your data solely for research and platform improvement. Your information is secure, encrypted, and never shared with employers or third parties.
              </p>
            </div>
            
            <h3 style={{ color: 'var(--text-h, #08060d)', fontSize: '16px', margin: '0 0 8px', fontWeight: '600' }}>1. Data Collection</h3>
            <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
              <li>Name and contact details (account management)</li>
              <li>Role selection (Coach, Family Member, or Patient)</li>
              <li>Work experience and challenge responses</li>
            </ul>
            
            <h3 style={{ color: 'var(--text-h, #08060d)', fontSize: '16px', margin: '0 0 8px', fontWeight: '600' }}>2. How We Use Your Data</h3>
            <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
              <li><strong>Purpose:</strong> To build and improve Zeen A</li>
              <li><strong>Privacy:</strong> Never shared with employers</li>
              <li><strong>Security:</strong> No third-party sales or distribution</li>
            </ul>
            
            <h3 style={{ color: 'var(--text-h, #08060d)', fontSize: '16px', margin: '0 0 8px', fontWeight: '600' }}>3. Your Rights</h3>
            <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
              <li>Access, correct, or delete your data anytime</li>
              <li>Withdraw consent at any time</li>
              <li>Data encrypted and securely stored</li>
            </ul>
            
            <div style={{
              borderTop: '1px solid var(--border, #e5e4e7)',
              paddingTop: '16px',
              marginTop: '8px',
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text, #6b6375)', margin: 0 }}>
                By accepting, you agree to the collection and use of your data as described.
                <br />
                <span style={{ color: 'var(--text, #6b6375)', fontSize: '12px' }}>
                  Questions? <a href="mailto:research@kepraa.ai" style={{ color: '#aa3bff' }}>research@kepraa.ai</a>
                </span>
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '18px 28px',
            borderTop: '1px solid var(--border, #e5e4e7)',
            background: 'var(--social-bg, #f8f7f5)',
            borderRadius: '0 0 20px 20px',
          }}>
            <button
              onClick={() => setShowTerms(false)}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: '1px solid var(--border, #e5e4e7)',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text, #6b6375)',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border, #e5e4e7)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Close
            </button>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, termsAccepted: true }));
                setShowTerms(false);
              }}
              style={{
                padding: '10px 28px',
                borderRadius: '10px',
                border: 'none',
                background: '#aa3bff',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#aa3bff'}
            >
              I Accept
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (submitSuccess) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0d7ff 100%)',
      }}>
        <div style={{
          background: 'var(--bg, #ffffff)',
          borderRadius: '24px',
          padding: '48px 40px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid var(--border, #e5e4e7)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          animation: 'fadeInUp 0.6s ease-out',
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px',
            animation: 'bounceIn 0.6s ease-out',
          }}>🎉</div>
          <h2 style={{ color: 'var(--text-h, #08060d)', margin: 0, fontSize: '24px', fontWeight: '600' }}>Registration Successful!</h2>
          <p style={{ color: 'var(--text, #6b6375)', marginTop: '8px', fontSize: '15px' }}>
            Welcome to Zeen A. Your account has been created.
          </p>
          <button
            onClick={onSwitchToLogin}
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: '#aa3bff',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#9333ea'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#aa3bff'}
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

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
        background: 'var(--bg, #ffffff)',
        borderRadius: '24px',
        padding: '36px 40px 40px 40px',
        maxWidth: '460px',
        width: '100%',
        border: '1px solid var(--border, #e5e4e7)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 0.5s ease-out',
        maxHeight: '94vh',
        overflowY: 'auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
            <span style={{ fontSize: '28px' }}>✨</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#aa3bff',
            margin: 0,
            letterSpacing: '-0.5px',
          }}>Zeen A</h1>
          <p style={{ 
            color: 'var(--text, #6b6375)', 
            marginTop: '4px',
            fontSize: '14px',
          }}>Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '500', 
                color: 'var(--text-h, #08060d)', 
                marginBottom: '6px' 
              }}>
                First Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  border: `2px solid ${errors.firstName ? '#ef4444' : 'var(--border, #e5e4e7)'}`,
                  borderRadius: '12px',
                  background: 'var(--bg, #ffffff)',
                  color: 'var(--text-h, #08060d)',
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
                  if (!errors.firstName) {
                    e.currentTarget.style.borderColor = 'var(--border, #e5e4e7)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.firstName && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.firstName}</div>
              )}
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '500', 
                color: 'var(--text-h, #08060d)', 
                marginBottom: '6px' 
              }}>
                Last Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  border: `2px solid ${errors.lastName ? '#ef4444' : 'var(--border, #e5e4e7)'}`,
                  borderRadius: '12px',
                  background: 'var(--bg, #ffffff)',
                  color: 'var(--text-h, #08060d)',
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
                  if (!errors.lastName) {
                    e.currentTarget.style.borderColor = 'var(--border, #e5e4e7)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.lastName && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.lastName}</div>
              )}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              color: 'var(--text-h, #08060d)', 
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
                border: `2px solid ${errors.email ? '#ef4444' : 'var(--border, #e5e4e7)'}`,
                borderRadius: '12px',
                background: 'var(--bg, #ffffff)',
                color: 'var(--text-h, #08060d)',
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
                  e.currentTarget.style.borderColor = 'var(--border, #e5e4e7)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            />
            {errors.email && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              color: 'var(--text-h, #08060d)', 
              marginBottom: '6px' 
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+44 1234 567890"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '11px 16px',
                border: `2px solid ${errors.phone ? '#ef4444' : 'var(--border, #e5e4e7)'}`,
                borderRadius: '12px',
                background: 'var(--bg, #ffffff)',
                color: 'var(--text-h, #08060d)',
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
                if (!errors.phone) {
                  e.currentTarget.style.borderColor = 'var(--border, #e5e4e7)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            />
            {errors.phone && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '500', 
                color: 'var(--text-h, #08060d)', 
                marginBottom: '6px' 
              }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 chars"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  border: `2px solid ${errors.password ? '#ef4444' : 'var(--border, #e5e4e7)'}`,
                  borderRadius: '12px',
                  background: 'var(--bg, #ffffff)',
                  color: 'var(--text-h, #08060d)',
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
                    e.currentTarget.style.borderColor = 'var(--border, #e5e4e7)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.password && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>
              )}
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '500', 
                color: 'var(--text-h, #08060d)', 
                marginBottom: '6px' 
              }}>
                Confirm <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  border: `2px solid ${errors.confirmPassword ? '#ef4444' : 'var(--border, #e5e4e7)'}`,
                  borderRadius: '12px',
                  background: 'var(--bg, #ffffff)',
                  color: 'var(--text-h, #08060d)',
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
                  if (!errors.confirmPassword) {
                    e.currentTarget.style.borderColor = 'var(--border, #e5e4e7)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.confirmPassword && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              color: 'var(--text-h, #08060d)', 
              marginBottom: '6px' 
            }}>
              I am a <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '11px 16px',
                border: `2px solid ${errors.role ? '#ef4444' : 'var(--border, #e5e4e7)'}`,
                borderRadius: '12px',
                background: 'var(--bg, #ffffff)',
                color: 'var(--text-h, #08060d)',
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
                if (!errors.role) {
                  e.currentTarget.style.borderColor = 'var(--border, #e5e4e7)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <option value="">Select your role...</option>
              <option value="coach">ADHD Coach / Professional</option>
              <option value="family">Family Member</option>
              <option value="patient">ADHD Patient / User</option>
            </select>
            {errors.role && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.role}</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '4px' }}>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                marginTop: '2px',
                width: '18px',
                height: '18px',
                accentColor: '#aa3bff',
                cursor: 'pointer',
                flexShrink: 0,
                borderRadius: '4px',
              }}
            />
            <div>
              <label style={{ 
                fontSize: '13px', 
                color: 'var(--text, #6b6375)', 
                cursor: 'pointer',
                lineHeight: '1.5',
              }}>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#aa3bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '13px',
                    padding: 0,
                    fontWeight: '500',
                  }}
                >
                  Terms & Conditions
                </button>
                <span style={{ color: '#ef4444' }}> *</span>
              </label>
              {errors.termsAccepted && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.termsAccepted}</div>
              )}
            </div>
          </div>

          {errors.submit && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#dc2626',
              fontSize: '13px',
              textAlign: 'center',
            }}>
              {errors.submit}
            </div>
          )}

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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--text, #6b6375)',
          marginTop: '20px',
          marginBottom: 0,
        }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
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
            Log in
          </button>
        </p>
      </div>

      <TermsModal />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Registration;