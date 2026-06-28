import React, { useState, useEffect } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminCharts = ({ stats, questionAnalytics, dailyRegistrations }) => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [answerData, setAnswerData] = useState({});
  const [loadingAnswers, setLoadingAnswers] = useState({});

  useEffect(() => {
    if (selectedRole === 'all') {
      setFilteredQuestions(questionAnalytics);
    } else {
      setFilteredQuestions(questionAnalytics.filter(q => q.role === selectedRole));
    }
  }, [selectedRole, questionAnalytics]);

  // ============================================
  // 1. USERS BY ROLE - PIE CHART
  // ============================================
  const roleData = {
    labels: stats.usersByRole.map(item => 
      item.role.charAt(0).toUpperCase() + item.role.slice(1) + 's'
    ),
    datasets: [{
      data: stats.usersByRole.map(item => item.count),
      backgroundColor: ['#aa3bff', '#667eea', '#22c55e', '#f59e0b', '#ef4444'],
      borderWidth: 3,
      borderColor: '#ffffff',
    }]
  };

  const roleOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      }
    }
  };

  // ============================================
  // 2. PROGRESS DISTRIBUTION - DONUT CHART
  // ============================================
  const completed = stats.totalCompletions || 0;
  const inProgress = stats.totalUsers - completed;
  
  const progressData = {
    labels: ['Complete', 'In Progress'],
    datasets: [{
      data: [completed, inProgress],
      backgroundColor: ['#22c55e', '#f59e0b'],
      borderWidth: 3,
      borderColor: '#ffffff',
    }]
  };

  const progressOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      }
    }
  };

  // ============================================
  // 3. FETCH ANSWER DISTRIBUTION FOR A QUESTION
  // ============================================
  const fetchAnswerDistribution = async (questionId, role) => {
    const key = `${role}_${questionId}`;
    
    // If already loading or has data, skip
    if (loadingAnswers[key] || answerData[key]) return;
    
    setLoadingAnswers(prev => ({ ...prev, [key]: true }));
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch the actual answers for this question
      const response = await fetch(
        `http://localhost:5000/api/admin/analytics/question-answers/${role}/${questionId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Answer data for question:', data);
        
        // Check if data has distribution array
        if (data && data.distribution && Array.isArray(data.distribution) && data.distribution.length > 0) {
          // Use the distribution from backend
          const labels = data.distribution.map(item => item.answer || 'Unknown');
          const counts = data.distribution.map(item => item.count || 0);
          
          setAnswerData(prev => ({
            ...prev,
            [key]: {
              labels: labels,
              counts: counts,
              total: data.totalResponses || 0,
              hasData: true,
            }
          }));
        } else {
          // No answers yet - show message
          setAnswerData(prev => ({
            ...prev,
            [key]: {
              labels: ['No answers recorded yet'],
              counts: [1],
              total: 0,
              hasData: false,
            }
          }));
        }
      } else {
        // Error fetching - show message
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setAnswerData(prev => ({
          ...prev,
          [key]: {
            labels: ['No data available'],
            counts: [1],
            total: 0,
            hasData: false,
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching answer distribution:', error);
      setAnswerData(prev => ({
        ...prev,
        [key]: {
          labels: ['Error loading data'],
          counts: [1],
          total: 0,
          hasData: false,
        }
      }));
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [key]: false }));
    }
  };

  // ============================================
  // 4. GET COLORS FOR PIE CHART
  // ============================================
  const getColors = (count) => {
    const colors = [
      '#aa3bff', '#667eea', '#22c55e', '#f59e0b', '#ef4444',
      '#8b5cf6', '#06b6d4', '#f472b6', '#34d399', '#fb923c',
      '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171',
      '#e879f9', '#22d3ee', '#f472b6', '#a3e635', '#fcd34d'
    ];
    return colors.slice(0, count);
  };

  // ============================================
  // 5. GET PIE CHART DATA FOR A QUESTION
  // ============================================
  const getQuestionPieData = (question) => {
    const total = question.total_responses || 0;
    const valid = question.valid_responses || 0;
    const skipped = total - valid;
    
    return {
      labels: ['Valid Responses', 'Skipped'],
      datasets: [{
        data: [valid, skipped],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff',
      }]
    };
  };

  const getAnswerDistributionData = (question) => {
    const key = `${question.role}_${question.id}`;
    const data = answerData[key];
    
    if (data && data.hasData && data.labels && data.labels.length > 0 && data.labels[0] !== 'No answers recorded yet') {
      return {
        labels: data.labels,
        datasets: [{
          data: data.counts,
          backgroundColor: getColors(data.labels.length),
          borderWidth: 2,
          borderColor: '#ffffff',
        }]
      };
    }
    
    // Fallback - show "No answers"
    return {
      labels: ['No answers recorded'],
      datasets: [{
        data: [1],
        backgroundColor: ['#d1d5db'],
        borderWidth: 2,
        borderColor: '#ffffff',
      }]
    };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 10,
          }
        }
      }
    }
  };

  // Toggle question expansion
  const toggleQuestion = (index, question) => {
    if (expandedQuestion === index) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(index);
      // Fetch answer distribution when expanding
      if (question && question.id) {
        fetchAnswerDistribution(question.id, question.role);
      }
    }
  };

  // Get color for response rate
  const getResponseRateColor = (rate) => {
    if (rate >= 80) return '#22c55e';
    if (rate >= 50) return '#f59e0b';
    return '#ef4444';
  };

  // Check if there are actual answers
  const hasRealAnswers = (question) => {
    const key = `${question.role}_${question.id}`;
    const data = answerData[key];
    return data && data.hasData && data.labels && data.labels.length > 0 && data.labels[0] !== 'No answers recorded yet';
  };

  return (
    <div>
      {/* Role Filter for Question Analytics */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a2e',
          margin: 0,
        }}>
          📈 Analytics Dashboard
        </h2>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', color: '#6b6375' }}>Filter questions:</span>
          <div style={{
            display: 'flex',
            gap: '6px',
            background: '#f5f3ff',
            padding: '4px',
            borderRadius: '10px',
          }}>
            {['all', 'patient', 'coach', 'family'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedRole === role ? '#aa3bff' : 'transparent',
                  color: selectedRole === role ? 'white' : '#6b6375',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                }}
              >
                {role === 'all' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
      }}>
        
        {/* Chart 1: Users by Role - PIE CHART */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 16px 0' }}>
            👥 Users by Role
          </h3>
          {stats.usersByRole && stats.usersByRole.length > 0 ? (
            <div style={{ height: '250px' }}>
              <Pie data={roleData} options={roleOptions} />
            </div>
          ) : (
            <p style={{ color: '#6b6375', textAlign: 'center', padding: '40px 0' }}>No user data available</p>
          )}
        </div>

        {/* Chart 2: Progress Distribution - DONUT CHART */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 16px 0' }}>
            📊 Progress Distribution
          </h3>
          {stats.totalUsers > 0 ? (
            <div style={{ height: '250px' }}>
              <Doughnut data={progressData} options={progressOptions} />
            </div>
          ) : (
            <p style={{ color: '#6b6375', textAlign: 'center', padding: '40px 0' }}>No progress data available</p>
          )}
        </div>
      </div>

      {/* ============================================
          QUESTION RESPONSE RATE - PIE CHARTS FOR EACH QUESTION
          ============================================ */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 8px 0' }}>
          📊 Question Response Distribution {selectedRole !== 'all' && `(${selectedRole})`}
        </h3>
        <p style={{ color: '#6b6375', fontSize: '12px', margin: '0 0 16px 0' }}>
          Click on any question to expand and see detailed answer distribution
        </p>

        {filteredQuestions && filteredQuestions.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {filteredQuestions.map((question, index) => {
              const total = question.total_responses || 0;
              const valid = question.valid_responses || 0;
              const responseRate = total > 0 ? Math.round((valid / total) * 100) : 0;
              const isExpanded = expandedQuestion === index;
              const rateColor = getResponseRateColor(responseRate);
              const hasAnswers = hasRealAnswers(question);

              return (
                <div
                  key={index}
                  style={{
                    border: '1px solid #e5e4e7',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: isExpanded ? '#f8f7ff' : '#ffffff',
                    boxShadow: isExpanded ? '0 4px 16px rgba(170, 59, 255, 0.1)' : 'none',
                  }}
                  onClick={() => toggleQuestion(index, question)}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.borderColor = '#aa3bff';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(170, 59, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.borderColor = '#e5e4e7';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Question Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1a1a2e',
                        margin: '0 0 4px 0',
                        lineHeight: '1.4',
                      }}>
                        {question.question_text || 'Question'}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          fontSize: '9px',
                          color: '#6b6375',
                          background: '#f5f3ff',
                          padding: '2px 10px',
                          borderRadius: '12px',
                        }}>
                          {question.section || 'General'}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          color: '#6b6375',
                          background: '#f0fdf4',
                          padding: '2px 10px',
                          borderRadius: '12px',
                        }}>
                          Total: {total}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          color: '#6b6375',
                          background: '#fef3c7',
                          padding: '2px 10px',
                          borderRadius: '12px',
                        }}>
                          Valid: {valid}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '50px',
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: rateColor,
                      }}>
                        {responseRate}%
                      </span>
                      <span style={{
                        fontSize: '8px',
                        color: '#6b6375',
                      }}>
                        Response Rate
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    height: '4px',
                    background: '#f0edf2',
                    borderRadius: '2px',
                    marginTop: '10px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${responseRate}%`,
                      background: `linear-gradient(90deg, ${rateColor}, ${rateColor}88)`,
                      borderRadius: '2px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>

                  {/* Expanded Content - Pie Chart */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e5e4e7',
                      animation: 'fadeIn 0.3s ease',
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                      }}>
                        {/* Response Rate Pie */}
                        <div>
                          <p style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: '#6b6375',
                            margin: '0 0 8px 0',
                            textAlign: 'center',
                          }}>
                            Response Distribution
                          </p>
                          <div style={{ height: '140px' }}>
                            <Pie 
                              data={getQuestionPieData(question)} 
                              options={pieOptions} 
                            />
                          </div>
                        </div>

                        {/* Answer Distribution Pie */}
                        <div>
                          <p style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: '#6b6375',
                            margin: '0 0 8px 0',
                            textAlign: 'center',
                          }}>
                            Answer Distribution
                          </p>
                          <div style={{ height: '140px' }}>
                            <Pie 
                              data={getAnswerDistributionData(question)} 
                              options={pieOptions} 
                            />
                          </div>
                          {!hasAnswers && (
                            <p style={{
                              fontSize: '9px',
                              color: '#6b6375',
                              textAlign: 'center',
                              margin: '4px 0 0 0',
                              fontStyle: 'italic',
                            }}>
                              No answers recorded yet
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Response Details */}
                      <div style={{
                        marginTop: '12px',
                        padding: '10px',
                        background: '#f8f7f5',
                        borderRadius: '8px',
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                          gap: '8px',
                        }}>
                          <div>
                            <p style={{ fontSize: '9px', color: '#6b6375', margin: 0 }}>Question ID</p>
                            <p style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>
                              #{question.id || question.question_number || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '9px', color: '#6b6375', margin: 0 }}>Type</p>
                            <p style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a2e', margin: 0, textTransform: 'capitalize' }}>
                              {question.question_type || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '9px', color: '#6b6375', margin: 0 }}>Role</p>
                            <p style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a2e', margin: 0, textTransform: 'capitalize' }}>
                              {question.role || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expand/Collapse Indicator */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: '8px',
                  }}>
                    <span style={{
                      fontSize: '10px',
                      color: '#aa3bff',
                      fontWeight: '500',
                    }}>
                      {isExpanded ? '▲ Click to collapse' : '▼ Click to expand'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#6b6375', textAlign: 'center', padding: '40px 0' }}>
            No question data available for {selectedRole === 'all' ? 'any role' : selectedRole}
          </p>
        )}
      </div>

      {/* Insights Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e4e7',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 12px 0' }}>
          💡 Key Insights
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}>
          <div>
            <p style={{ fontSize: '11px', color: '#6b6375', margin: 0 }}>Total Users</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
              {stats.totalUsers || 0}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#6b6375', margin: 0 }}>Completed</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#22c55e', margin: 0 }}>
              {stats.totalCompletions || 0}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#6b6375', margin: 0 }}>Completion Rate</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#aa3bff', margin: 0 }}>
              {stats.totalUsers > 0 ? Math.round((stats.totalCompletions / stats.totalUsers) * 100) : 0}%
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#6b6375', margin: 0 }}>Avg Progress</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#667eea', margin: 0 }}>
              {stats.averageCompletion || 0}%
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#6b6375', margin: 0 }}>Active Today</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>
              {stats.activeToday || 0}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminCharts;