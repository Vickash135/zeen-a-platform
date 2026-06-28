import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminReports = ({ onBack }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedRole, setSelectedRole] = useState('all');

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch users data
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!usersResponse.ok) throw new Error('Failed to fetch users data');
      const allUsers = await usersResponse.json();

      const users = selectedRole === 'all' 
        ? allUsers 
        : allUsers.filter(u => u.role === selectedRole);

      // Fetch detailed answers for each user
      const usersWithAnswers = await Promise.all(
        users.map(async (user) => {
          try {
            const response = await fetch(`http://localhost:5000/api/admin/user/${user.email}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
              const data = await response.json();
              return {
                ...user,
                answers: data.answers || [],
                progress: data.progress || {}
              };
            }
            return { ...user, answers: [], progress: {} };
          } catch (error) {
            console.error(`Error fetching answers for ${user.email}:`, error);
            return { ...user, answers: [], progress: {} };
          }
        })
      );

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      // ============================================
      // PAGE 1: COVER + RESPONSE SUMMARY + USER DETAILS
      // ============================================
      
      // Cover Section
      doc.setFillColor(102, 126, 234);
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.text('Survey Report', 105, 22, { align: 'center' });
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 45, { align: 'center' });
      doc.text(`Role: ${selectedRole === 'all' ? 'All Roles' : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`, 105, 52, { align: 'center' });
      doc.text(`Total Users: ${users.length}`, 105, 59, { align: 'center' });
      
      // ============================================
      // RESPONSE SUMMARY - FIXED CALCULATION
      // ============================================
      const totalUsers = users.length;
      const completed = users.filter(u => u.is_complete === true || u.is_complete === 1).length;
      
      // FIX: Calculate average progress safely with proper number conversion
      let avgProgress = 0;
      if (totalUsers > 0) {
        let totalProgress = 0;
        let validUsers = 0;
        
        users.forEach(user => {
          // Convert to number safely
          let progress = parseFloat(user.completion_percentage);
          // If it's NaN or undefined, treat as 0
          if (isNaN(progress)) {
            progress = 0;
          } else {
            validUsers++;
          }
          totalProgress += progress;
        });
        
        // Only divide by valid users count
        avgProgress = validUsers > 0 ? Math.round(totalProgress / validUsers) : 0;
      }
      
      let yPos = 72;
      
      // Draw box around response summary
      doc.setFillColor(245, 245, 255);
      doc.rect(14, yPos - 5, 182, 35, 'F');
      doc.rect(14, yPos - 5, 182, 35, 'S');
      
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Response Summary', 20, yPos + 4);
      
      yPos += 12;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      // Row 1: Total Respondents
      doc.setTextColor(80, 80, 80);
      doc.text('Total Respondents:', 20, yPos + 4);
      doc.setTextColor(102, 126, 234);
      doc.setFont(undefined, 'bold');
      doc.text(`${totalUsers}`, 75, yPos + 4);
      
      // Row 2: Completed
      doc.setTextColor(80, 80, 80);
      doc.setFont(undefined, 'normal');
      doc.text('Completed:', 100, yPos + 4);
      doc.setTextColor(102, 126, 234);
      doc.setFont(undefined, 'bold');
      doc.text(`${completed}`, 145, yPos + 4);
      
      // Row 3: Average Progress
      yPos += 10;
      doc.setTextColor(80, 80, 80);
      doc.setFont(undefined, 'normal');
      doc.text('Average Progress:', 20, yPos + 4);
      doc.setTextColor(102, 126, 234);
      doc.setFont(undefined, 'bold');
      doc.text(`${avgProgress}%`, 75, yPos + 4);
      
      yPos += 20;
      
      // User Details Table
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('User Details', 14, yPos);
      yPos += 5;

      const userColumns = ['#', 'Name', 'Email', 'Role', 'Progress', 'Status'];
      const userRows = usersWithAnswers.map((user, index) => {
        // Safely get progress
        let progress = parseFloat(user.completion_percentage);
        if (isNaN(progress)) progress = 0;
        
        return [
          index + 1,
          `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
          user.email || 'No email',
          user.role || 'Unknown',
          `${progress}%`,
          user.is_complete ? 'Complete' : 'In Progress',
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [userColumns],
        body: userRows,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234], textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        margin: { left: 14, right: 14 },
        pageBreak: 'auto',
        tableWidth: 'auto',
      });

      // ============================================
      // QUESTION SUMMARY WITH ALL RESPONSES
      // ============================================
      doc.addPage();
      doc.setFillColor(102, 126, 234);
      doc.rect(0, 0, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('Question Summary with All Responses', 14, 14);

      let qY = 30;
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.text(`Showing all questions with response counts (${usersWithAnswers.length} users)`, 14, qY);
      qY += 10;

      // Group all answers by question
      const questionMap = {};
      usersWithAnswers.forEach(user => {
        if (user.answers && Array.isArray(user.answers)) {
          user.answers.forEach(answer => {
            const questionKey = answer.question_text || 'Unknown Question';
            if (!questionMap[questionKey]) {
              questionMap[questionKey] = {
                questionText: answer.question_text,
                responses: []
              };
            }
            
            let answerText = '';
            if (answer.answer_text) {
              answerText = answer.answer_text;
            } else if (answer.answer_options) {
              try {
                const options = JSON.parse(answer.answer_options);
                answerText = Array.isArray(options) ? options.join(', ') : options;
              } catch {
                answerText = answer.answer_options;
              }
            }
            
            if (answerText) {
              questionMap[questionKey].responses.push({
                email: user.email || 'Unknown',
                answer: answerText
              });
            }
          });
        }
      });

      let questionCount = 0;
      const questionKeys = Object.keys(questionMap);
      
      questionKeys.forEach((qKey) => {
        const qData = questionMap[qKey];
        questionCount++;
        
        // Check if we need a new page
        if (qY > 250) {
          doc.addPage();
          qY = 20;
          doc.setFillColor(102, 126, 234);
          doc.rect(0, 0, 210, 20, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.text('Question Summary (continued)', 14, 14);
          qY = 30;
        }

        // Question header with number
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        const qNum = questionCount < 10 ? `0${questionCount}` : `${questionCount}`;
        
        // Handle long question text with word wrap
        const questionText = qData.questionText || 'Question';
        const maxWidth = 180;
        const wrappedText = doc.splitTextToSize(`${qNum}. ${questionText}`, maxWidth);
        doc.text(wrappedText, 14, qY);
        qY += (wrappedText.length * 5) + 2;

        // Response count
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(`Responses: ${qData.responses.length}`, 14, qY);
        qY += 5;

        // Create a table for responses
        if (qData.responses.length > 0) {
          const responseRows = qData.responses.map((resp, idx) => [
            `${idx + 1}`,
            resp.answer || '—',
            resp.email || 'Unknown'
          ]);

          autoTable(doc, {
            startY: qY,
            head: [['#', 'Answer', 'User Email']],
            body: responseRows,
            theme: 'striped',
            headStyles: { fillColor: [102, 126, 234], textColor: [255, 255, 255], fontSize: 8 },
            bodyStyles: { fontSize: 7 },
            columnStyles: {
              0: { cellWidth: 10 },
              1: { cellWidth: 110 },
              2: { cellWidth: 60 }
            },
            margin: { left: 14, right: 14 },
            pageBreak: 'auto',
          });

          qY = doc.lastAutoTable.finalY + 6;
        } else {
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(8);
          doc.text('No responses for this question', 18, qY);
          qY += 8;
        }
      });

      // ============================================
      // FOOTER
      // ============================================
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${totalPages}`, 14, 290);
        doc.text('Zeen A - Survey Report', 160, 290);
      }

      const fileName = selectedRole === 'all' 
        ? 'zeen-a-full-survey-report.pdf' 
        : `zeen-a-${selectedRole}-survey-report.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
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
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>
          Survey Report Generator
        </h2>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e4e7',
            background: 'transparent',
            cursor: 'pointer',
            color: '#6b6375',
            fontSize: '13px',
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#6b6375', fontSize: '14px', margin: 0 }}>
          Generate a comprehensive survey report with all answers in table format:
        </p>
        <ul style={{ color: '#6b6375', fontSize: '13px', marginTop: '8px', paddingLeft: '20px' }}>
          <li>📊 Response summary with completion rates</li>
          <li>👥 User details in a clean table</li>
          <li>📋 Question-by-question summary with all responses and user emails</li>
          <li>📄 Auto-pagination for large datasets</li>
        </ul>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '13px', color: '#6b6375', fontWeight: '500' }}>
          Filter by role:
        </span>
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

      <button
        onClick={generatePDF}
        disabled={generating}
        style={{
          padding: '12px 32px',
          borderRadius: '12px',
          border: 'none',
          background: generating ? '#9ca3af' : '#aa3bff',
          color: 'white',
          cursor: generating ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s',
          boxShadow: '0 4px 16px rgba(170, 59, 255, 0.25)',
        }}
        onMouseEnter={(e) => {
          if (!generating) {
            e.currentTarget.style.background = '#9333ea';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(170, 59, 255, 0.35)';
          }
        }}
        onMouseLeave={(e) => {
          if (!generating) {
            e.currentTarget.style.background = '#aa3bff';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(170, 59, 255, 0.25)';
          }
        }}
      >
        {generating ? 'Generating...' : 'Generate Clean Report'}
      </button>

      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: '#f0fdf4',
        borderRadius: '8px',
        border: '1px solid #bbf7d0',
      }}>
        
        <p style={{ fontSize: '11px', color: '#16a34a', margin: '4px 0 0 0' }}>
          ✓ Properly calculates average progress by dividing by user count.
        </p>
      </div>
    </div>
  );
};

export default AdminReports;