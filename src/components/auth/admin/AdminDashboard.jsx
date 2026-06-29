import React, { useState, useEffect, useCallback } from 'react';
import AdminCharts from './AdminCharts';
import AdminReports from './AdminReports';

const AdminDashboard = ({ adminUser, onLogout }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersByRole: [],
    totalCompletions: 0,
    averageCompletion: 0,
    activeToday: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [questionAnalytics, setQuestionAnalytics] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [dailyRegistrations, setDailyRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        return;
      }

      // Fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent users
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setRecentUsers(usersData);
      }

      // Fetch question analytics
      await fetchQuestionAnalytics();

      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  }, []);

  const fetchQuestionAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/analytics/questions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestionAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching question analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchUserDetails = async (email) => {
    setLoadingUser(true);
    setSelectedUser(email);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/user/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Filter users based on search
  const filteredUsers = recentUsers.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      (user.first_name && user.first_name.toLowerCase().includes(search)) ||
      (user.last_name && user.last_name.toLowerCase().includes(search)) ||
      (user.email && user.email.toLowerCase().includes(search)) ||
      (user.role && user.role.toLowerCase().includes(search))
    );
  });

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Complete': return '#22c55e';
      case 'In Progress': return '#f59e0b';
      default: return '#6b6375';
    }
  };

  // Get status background
  const getStatusBg = (status) => {
    switch(status) {
      case 'Complete': return '#dcfce7';
      case 'In Progress': return '#fef3c7';
      default: return '#f3f4f6';
    }
  };

  // Export users data as CSV
  const exportUsersData = () => {
    const headers = ['Name', 'Email', 'Role', 'Progress', 'Status', 'Registered'];
    const rows = recentUsers.map(user => [
      `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      user.email || '',
      user.role || '',
      `${user.completion_percentage || 0}%`,
      user.is_complete ? 'Complete' : 'In Progress',
      user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f3ff',
        margin: 0,
        padding: 0,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e4e7',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6b6375' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f3ff',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    }}>
      {/* Full Width Container */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px 32px',
        boxSizing: 'border-box',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '20px 24px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a1a2e',
              margin: 0,
            }}>Admin Dashboard</h1>
            <p style={{
              color: '#6b6375',
              margin: '4px 0 0 0',
              fontSize: '14px',
            }}>
              Welcome back, {adminUser?.firstName} {adminUser?.lastName}
              {lastUpdated && (
                <span style={{ marginLeft: '12px', fontSize: '12px', color: '#9ca3af' }}>
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #e5e4e7',
                background: 'transparent',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                color: '#6b6375',
                fontWeight: '500',
                fontSize: '13px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!refreshing) {
                  e.currentTarget.style.background = '#f5f3ff';
                  e.currentTarget.style.borderColor = '#aa3bff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#e5e4e7';
              }}
            >
              <span style={{
                display: 'inline-block',
                animation: refreshing ? 'spin 1s linear infinite' : 'none'
              }}>
                🔄
              </span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                border: '1px solid #e5e4e7',
                background: 'transparent',
                cursor: 'pointer',
                color: '#6b6375',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e4e7';
                e.currentTarget.style.color = '#6b6375';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation - Full Width */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          background: '#ffffff',
          padding: '8px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          width: '100%',
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'dashboard' ? '#aa3bff' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : '#6b6375',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <span>📊</span> Dashboard
            {activeTab === 'dashboard' && (
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
              }}>
                {recentUsers.length} users
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics');
              fetchQuestionAnalytics();
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'analytics' ? '#aa3bff' : 'transparent',
              color: activeTab === 'analytics' ? 'white' : '#6b6375',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <span>📈</span> Analytics
          </button>
          <button
            onClick={() => {
              setActiveTab('reports');
              fetchQuestionAnalytics();
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'reports' ? '#aa3bff' : 'transparent',
              color: activeTab === 'reports' ? 'white' : '#6b6375',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <span>📄</span> Reports
          </button>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #667eea',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#6b6375', fontSize: '13px', margin: 0 }}>Total Users</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                      {stats.totalUsers}
                    </p>
                  </div>
                  <span style={{ fontSize: '24px' }}>👥</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b6375' }}>
                  {stats.usersByRole.length} roles registered
                </div>
              </div>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #22c55e',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#6b6375', fontSize: '13px', margin: 0 }}>Completed</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                      {stats.totalCompletions}
                    </p>
                  </div>
                  <span style={{ fontSize: '24px' }}>✅</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b6375' }}>
                  {stats.totalUsers > 0 ? Math.round((stats.totalCompletions / stats.totalUsers) * 100) : 0}% completion rate
                </div>
              </div>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #aa3bff',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#6b6375', fontSize: '13px', margin: 0 }}>Avg Progress</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                      {stats.averageCompletion}%
                    </p>
                  </div>
                  <span style={{ fontSize: '24px' }}>📊</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b6375' }}>
                  Average across all users
                </div>
              </div>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #f59e0b',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#6b6375', fontSize: '13px', margin: 0 }}>Active Today</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                      {stats.activeToday}
                    </p>
                  </div>
                  <span style={{ fontSize: '24px' }}>🟢</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b6375' }}>
                  Active users in last 24h
                </div>
              </div>
            </div>

            {/* Users by Role + Quick Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '16px',
              marginBottom: '24px',
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  margin: '0 0 16px 0',
                }}>Users by Role</h2>
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                  {stats.usersByRole.map((item) => (
                    <div key={item.role} style={{ 
                      background: '#f8f7f5', 
                      padding: '12px 20px', 
                      borderRadius: '12px',
                      minWidth: '100px',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1a1a2e',
                      }}>
                        {item.count}
                      </span>
                      <span style={{
                        color: '#6b6375',
                        fontSize: '14px',
                        display: 'block',
                        textTransform: 'capitalize',
                        marginTop: '2px',
                      }}>
                        {item.role}s
                      </span>
                    </div>
                  ))}
                </div>
                {stats.usersByRole.length === 0 && (
                  <p style={{ color: '#6b6375', fontSize: '14px' }}>No users registered yet</p>
                )}
              </div>

              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  margin: '0 0 16px 0',
                }}>Quick Actions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e5e4e7',
                      background: '#f8f7ff',
                      cursor: 'pointer',
                      color: '#1a1a2e',
                      fontWeight: '500',
                      fontSize: '13px',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ede9fe';
                      e.currentTarget.style.borderColor = '#aa3bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8f7ff';
                      e.currentTarget.style.borderColor = '#e5e4e7';
                    }}
                  >
                    📈 View Analytics Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e5e4e7',
                      background: '#f0fdf4',
                      cursor: 'pointer',
                      color: '#1a1a2e',
                      fontWeight: '500',
                      fontSize: '13px',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dcfce7';
                      e.currentTarget.style.borderColor = '#22c55e';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.borderColor = '#e5e4e7';
                    }}
                  >
                    📄 Generate Reports
                  </button>
                  <button
                    onClick={exportUsersData}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e5e4e7',
                      background: '#fef3c7',
                      cursor: 'pointer',
                      color: '#1a1a2e',
                      fontWeight: '500',
                      fontSize: '13px',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fde68a';
                      e.currentTarget.style.borderColor = '#f59e0b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef3c7';
                      e.currentTarget.style.borderColor = '#e5e4e7';
                    }}
                  >
                    📥 Export Users Data (CSV)
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Users with Search */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  margin: 0,
                }}>All Users</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="🔍 Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: '1px solid #e5e4e7',
                        fontSize: '13px',
                        width: '200px',
                        outline: 'none',
                        transition: 'all 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#aa3bff';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(170, 59, 255, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e4e7';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6b6375',
                          fontSize: '14px',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b6375' }}>
                    {filteredUsers.length} users
                  </span>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e4e7' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b6375', fontSize: '13px', fontWeight: '600' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b6375', fontSize: '13px', fontWeight: '600' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b6375', fontSize: '13px', fontWeight: '600' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b6375', fontSize: '13px', fontWeight: '600' }}>Progress</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b6375', fontSize: '13px', fontWeight: '600' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: '#6b6375', fontSize: '13px', fontWeight: '600' }}>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const progress = user.completion_percentage || 0;
                        const isComplete = user.is_complete;
                        const status = isComplete ? 'Complete' : 'In Progress';
                        
                        return (
                          <tr 
                            key={user.email} 
                            style={{ 
                              borderBottom: '1px solid #f0edf2',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}
                            onClick={() => fetchUserDetails(user.email)}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f0ff'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '12px 8px', color: '#1a1a2e', fontSize: '14px', fontWeight: '500' }}>
                              {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown'}
                            </td>
                            <td style={{ padding: '12px 8px', color: '#6b6375', fontSize: '14px' }}>
                              {user.email}
                            </td>
                            <td style={{ padding: '12px 8px', fontSize: '14px', textTransform: 'capitalize' }}>
                              <span style={{
                                background: user.role === 'patient' ? '#ede9fe' : 
                                          user.role === 'coach' ? '#dbeafe' : '#dcfce7',
                                color: user.role === 'patient' ? '#7c3aed' : 
                                       user.role === 'coach' ? '#2563eb' : '#16a34a',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}>
                                {user.role || 'Unknown'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', color: '#6b6375', fontSize: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '60px',
                                  height: '6px',
                                  background: '#f0edf2',
                                  borderRadius: '3px',
                                  overflow: 'hidden',
                                }}>
                                  <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    background: progress >= 80 ? '#22c55e' : 
                                               progress >= 50 ? '#f59e0b' : '#ef4444',
                                    borderRadius: '3px',
                                    transition: 'width 0.5s ease',
                                  }} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '500', minWidth: '35px' }}>
                                  {progress}%
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 8px', fontSize: '14px' }}>
                              <span style={{
                                color: getStatusColor(status),
                                background: getStatusBg(status),
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}>
                                {isComplete ? '✅ Complete' : '⏳ In Progress'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', color: '#6b6375', fontSize: '13px' }}>
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6b6375' }}>
                          {searchTerm ? `No users found matching "${searchTerm}"` : 'No users registered yet'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length > 0 && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f0edf2',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: '#6b6375',
                }}>
                  <span>Showing {filteredUsers.length} of {recentUsers.length} users</span>
                  <span>Click any row to view details</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Analytics Content */}
        {activeTab === 'analytics' && (
          <AdminCharts 
            stats={stats} 
            questionAnalytics={questionAnalytics} 
            dailyRegistrations={dailyRegistrations}
          />
        )}

        {/* Reports Content */}
        {activeTab === 'reports' && (
          <AdminReports onBack={() => setActiveTab('dashboard')} />
        )}

        {/* User Details Modal */}
        {showUserModal && userDetails && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }} onClick={() => setShowUserModal(false)}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease',
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e4e7',
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1a1a2e' }}>
                    User Details
                  </h2>
                  <p style={{ margin: '4px 0 0 0', color: '#6b6375', fontSize: '14px' }}>
                    {userDetails.user?.first_name} {userDetails.user?.last_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b6375',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0edf2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  ✕
                </button>
              </div>

              {/* User Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                padding: '16px',
                background: '#f8f7f5',
                borderRadius: '12px',
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#6b6375', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                    {userDetails.user?.email}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6b6375', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e', margin: '4px 0 0 0', textTransform: 'capitalize' }}>
                    {userDetails.user?.role}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6b6375', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                    {userDetails.user?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6b6375', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progress</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                    {userDetails.progress?.completion_percentage || 0}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6b6375', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: '4px 0 0 0' }}>
                    {userDetails.progress?.is_complete ? (
                      <span style={{ color: '#22c55e' }}>✅ Complete</span>
                    ) : (
                      <span style={{ color: '#f59e0b' }}>⏳ In Progress</span>
                    )}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6b6375', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registered</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e', margin: '4px 0 0 0' }}>
                    {userDetails.user?.created_at ? new Date(userDetails.user.created_at).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>

              {/* Answers Section */}
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 12px 0' }}>
                📋 Answers ({userDetails.answers?.length || 0})
              </h3>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #e5e4e7',
                borderRadius: '12px',
              }}>
                {userDetails.answers && userDetails.answers.length > 0 ? (
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                  }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                      <tr style={{ background: '#f8f7f5', borderBottom: '2px solid #e5e4e7' }}>
                        <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6375', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Question</th>
                        <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6375', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDetails.answers.map((answer, index) => (
                        <tr key={index} style={{ 
                          borderBottom: index < userDetails.answers.length - 1 ? '1px solid #f0edf2' : 'none',
                          background: index % 2 === 0 ? '#ffffff' : '#fafafa'
                        }}>
                          <td style={{ padding: '10px 12px', color: '#1a1a2e', maxWidth: '300px' }}>
                            {answer.section && (
                              <span style={{ fontSize: '10px', color: '#aa3bff', textTransform: 'uppercase', display: 'block', fontWeight: '600', letterSpacing: '0.3px' }}>
                                {answer.section}
                              </span>
                            )}
                            <span style={{ fontSize: '12px' }}>
                              {answer.question_text?.substring(0, 60)}
                              {answer.question_text?.length > 60 && '...'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#1a1a2e' }}>
                            <span style={{
                              background: '#f5f3ff',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              display: 'inline-block',
                              maxWidth: '100%',
                              wordBreak: 'break-word',
                            }}>
                              {answer.answer_text || (
                                Array.isArray(answer.answer_options) ? (
                                  answer.answer_options.join(', ')
                                ) : (
                                  answer.answer_options || '—'
                                )
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b6375' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                    <p style={{ margin: 0, fontSize: '14px' }}>No answers submitted yet</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>This user hasn't responded to any questions</p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#aa3bff',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#9333ea';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(170, 59, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#aa3bff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        body, html {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          background: #f5f3ff;
        }
        #root {
          min-height: 100vh;
          background: #f5f3ff;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;