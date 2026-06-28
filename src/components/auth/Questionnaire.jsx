import React, { useState, useEffect } from 'react';
import { patientQuestions } from '../../data/patientQuestions';
import { coachQuestions } from '../../data/coachQuestions';
import { familyQuestions } from '../../data/familyQuestions';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ total: 0, answered: 0 });
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'patient';
    const firstName = user.firstName || 'User';
    const email = user.email || '';
    
    setUserRole(role);
    setUserName(firstName);
    setUserEmail(email);

    // Load questions based on role
    let loadedQuestions = [];
    if (role === 'patient') loadedQuestions = patientQuestions;
    else if (role === 'coach') loadedQuestions = coachQuestions;
    else if (role === 'family') loadedQuestions = familyQuestions;

    setQuestions(loadedQuestions);
    setProgress({ total: loadedQuestions.length, answered: 0 });

    // Load saved answers from localStorage - USER SPECIFIC
    const storageKey = `answers_${email}_${role}`;
    const savedAnswers = localStorage.getItem(storageKey);
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed);
        const answeredCount = Object.keys(parsed).length;
        setProgress(prev => ({ ...prev, answered: answeredCount }));
      } catch (e) {
        console.error('Error loading answers:', e);
      }
    }

    setLoading(false);
  }, []);

  const handleAnswer = async (value) => {
    const currentQuestion = questions[currentIndex];
    const questionId = currentQuestion.id;
    
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Save to localStorage - USER SPECIFIC
    const storageKey = `answers_${userEmail}_${userRole}`;
    localStorage.setItem(storageKey, JSON.stringify(newAnswers));
    
    const answeredCount = Object.keys(newAnswers).length;
    setProgress(prev => ({ ...prev, answered: answeredCount }));

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/questions/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            questionId: questionId,
            answerText: typeof value === 'string' ? value : null,
            answerOptions: typeof value === 'object' ? JSON.stringify(value) : null
          })
        });
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0d7ff 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e4e7',
            borderTop: '4px solid #aa3bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6b6375' }}>Loading your questions...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
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
          background: '#ffffff',
          borderRadius: '24px',
          padding: '48px 40px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #e5e4e7',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#08060d', margin: 0, fontSize: '24px', fontWeight: '600' }}>
            Questionnaire Complete!
          </h2>
          <p style={{ color: '#6b6375', marginTop: '8px', fontSize: '15px' }}>
            Thank you {userName}! You've completed all {progress.total} questions.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
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
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
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
          background: '#ffffff',
          borderRadius: '24px',
          padding: '48px 40px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #e5e4e7',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ color: '#08060d', margin: 0, fontSize: '24px', fontWeight: '600' }}>
            No Questions Available
          </h2>
          <p style={{ color: '#6b6375', marginTop: '8px', fontSize: '15px' }}>
            No questions found for your role.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            style={{
              marginTop: '24px',
              padding: '14px 32px',
              borderRadius: '12px',
              border: 'none',
              background: '#aa3bff',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);
  const roleDisplay = userRole === 'patient' ? 'Patient' : userRole === 'coach' ? 'Coach' : 'Family Member';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0d7ff 100%)',
      overflow: 'auto',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '32px 36px 36px 36px',
        maxWidth: '560px',
        width: '100%',
        border: '1px solid #e5e4e7',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 0.5s ease-out',
        maxHeight: '96vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: '500',
              color: '#aa3bff',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {roleDisplay} Questionnaire
            </span>
            <p style={{ fontSize: '12px', color: '#6b6375', margin: '1px 0 0 0' }}>
              Welcome, {userName}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            style={{
              padding: '5px 14px',
              borderRadius: '8px',
              border: '1px solid #e5e4e7',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6b6375',
              fontSize: '11px',
            }}
          >
            Logout
          </button>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#08060d' }}>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span style={{ fontSize: '13px', color: '#6b6375' }}>
              {progressPercent}%
            </span>
          </div>
          <div style={{
            height: '5px',
            background: '#f0edf2',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #aa3bff, #7c3aed)',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
              width: `${progressPercent}%`,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#6b6375' }}>
            <span>{progress.answered} answered</span>
            <span>{progress.total - progress.answered} remaining</span>
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '24px' }}>
          {currentQuestion.section && (
            <div style={{
              fontSize: '11px',
              fontWeight: '500',
              color: '#aa3bff',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
            }}>
              {currentQuestion.section}
            </div>
          )}
          <h3 style={{
            fontSize: '17px',
            fontWeight: '600',
            color: '#08060d',
            margin: 0,
            lineHeight: '1.5',
          }}>
            {currentQuestion.question}
          </h3>
        </div>

        {/* Answer Input */}
        <div style={{ marginBottom: '24px' }}>
          {currentQuestion.type === 'text' && (
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e5e4e7',
                borderRadius: '10px',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#aa3bff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e4e7'}
            />
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e5e4e7',
                borderRadius: '10px',
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#aa3bff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e4e7'}
            />
          )}

          {currentQuestion.type === 'select' && (
            <select
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e5e4e7',
                borderRadius: '10px',
                fontSize: '13px',
                outline: 'none',
                background: '#ffffff',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#aa3bff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e4e7'}
            >
              <option value="">Select an option...</option>
              {currentQuestion.options && currentQuestion.options.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentQuestion.options && currentQuestion.options.map((option, idx) => {
                const selectedValues = answers[currentQuestion.id] || [];
                const isChecked = Array.isArray(selectedValues) && selectedValues.includes(option);
                return (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#08060d',
                    padding: '6px 10px',
                    borderRadius: '6px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f0ff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let newValues;
                        if (e.target.checked) {
                          newValues = [...selectedValues, option];
                        } else {
                          newValues = selectedValues.filter(v => v !== option);
                        }
                        handleAnswer(newValues);
                      }}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#aa3bff',
                        cursor: 'pointer',
                      }}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'scale' && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAnswer(num.toString())}
                  style={{
                    padding: '10px 14px',
                    border: `2px solid ${answers[currentQuestion.id] === num.toString() ? '#aa3bff' : '#e5e4e7'}`,
                    borderRadius: '10px',
                    background: answers[currentQuestion.id] === num.toString() ? 'rgba(170, 59, 255, 0.08)' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: answers[currentQuestion.id] === num.toString() ? '#aa3bff' : '#6b6375',
                    transition: 'all 0.2s',
                    flex: '1',
                    minWidth: '32px',
                  }}
                  onMouseEnter={(e) => {
                    if (answers[currentQuestion.id] !== num.toString()) {
                      e.currentTarget.style.borderColor = '#aa3bff';
                      e.currentTarget.style.background = 'rgba(170, 59, 255, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (answers[currentQuestion.id] !== num.toString()) {
                      e.currentTarget.style.borderColor = '#e5e4e7';
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '2px solid #e5e4e7',
              background: 'transparent',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              color: currentIndex === 0 ? '#d1cdd4' : '#6b6375',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: '10px 28px',
              borderRadius: '10px',
              border: 'none',
              background: '#aa3bff',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(170, 59, 255, 0.25)',
            }}
          >
            {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
          </button>
        </div>

        {saving && (
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: '#6b6375' }}>
            Saving...
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Questionnaire;