const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============================================
// GET ADMIN DASHBOARD STATS
// ============================================
router.get('/dashboard/stats', auth, isAdmin, async (req, res) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [roleCount] = await pool.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    const [completionCount] = await pool.query('SELECT COUNT(*) as total FROM response_summary WHERE is_complete = TRUE');
    const [avgCompletion] = await pool.query('SELECT AVG(completion_percentage) as avg FROM response_summary');
    const [todayActive] = await pool.query("SELECT COUNT(*) as active FROM response_summary WHERE DATE(last_activity) = CURDATE()");

    res.json({
      totalUsers: userCount[0].total || 0,
      usersByRole: roleCount,
      totalCompletions: completionCount[0].total || 0,
      averageCompletion: Math.round(avgCompletion[0].avg || 0),
      activeToday: todayActive[0].active || 0
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET ALL USERS WITH PROGRESS
// ============================================
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT 
        u.email, 
        u.first_name, 
        u.last_name, 
        u.role, 
        u.created_at,
        rs.total_questions,
        rs.answered_questions,
        rs.completion_percentage,
        rs.is_complete,
        rs.completed_at,
        rs.last_activity
       FROM users u
       LEFT JOIN response_summary rs ON u.email = rs.email
       ORDER BY u.created_at DESC`
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET USER DETAILS WITH ANSWERS (Composite Key)
// ============================================
router.get('/user/:email', auth, isAdmin, async (req, res) => {
  try {
    const { email } = req.params;
    const [users] = await pool.query(
      'SELECT email, first_name, last_name, phone, role, created_at FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    const tableName = user.role === 'patient' ? 'patient_answers' : 
                     user.role === 'coach' ? 'coach_answers' : 'family_answers';

    // Using composite key: role + question_number
    const [answers] = await pool.query(
      `SELECT q.question_text, q.section, a.answer_text, a.answer_options, a.answered_at
       FROM ${tableName} a
       JOIN questions q ON q.role = a.role AND q.question_number = a.question_number
       WHERE a.email = ?
       ORDER BY q.sort_order`,
      [email]
    );

    const [progress] = await pool.query(
      `SELECT total_questions, answered_questions, completion_percentage, is_complete, completed_at
       FROM response_summary
       WHERE email = ?`,
      [email]
    );

    res.json({ user, progress: progress[0] || null, answers });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET QUESTION ANALYTICS (Composite Key)
// ============================================
router.get('/analytics/questions', auth, isAdmin, async (req, res) => {
  try {
    const [analytics] = await pool.query(
      `SELECT 
        q.role,
        q.question_number as id,
        q.section,
        q.question_text,
        q.question_type,
        q.options,
        q.sort_order,
        COUNT(DISTINCT a_p.email) AS total_responses,
        COUNT(DISTINCT CASE WHEN a_p.answer_text IS NOT NULL OR a_p.answer_options IS NOT NULL THEN a_p.email END) AS valid_responses,
        COUNT(DISTINCT CASE WHEN a_p.answer_text IS NULL AND a_p.answer_options IS NULL AND a_p.email IS NOT NULL THEN a_p.email END) AS skipped_responses
       FROM questions q
       LEFT JOIN patient_answers a_p ON q.role = a_p.role AND q.question_number = a_p.question_number
       WHERE q.role = 'patient'
       GROUP BY q.role, q.question_number, q.section, q.question_text, q.question_type, q.options, q.sort_order
       
       UNION ALL
       
       SELECT 
        q.role,
        q.question_number as id,
        q.section,
        q.question_text,
        q.question_type,
        q.options,
        q.sort_order,
        COUNT(DISTINCT a_c.email) AS total_responses,
        COUNT(DISTINCT CASE WHEN a_c.answer_text IS NOT NULL OR a_c.answer_options IS NOT NULL THEN a_c.email END) AS valid_responses,
        COUNT(DISTINCT CASE WHEN a_c.answer_text IS NULL AND a_c.answer_options IS NULL AND a_c.email IS NOT NULL THEN a_c.email END) AS skipped_responses
       FROM questions q
       LEFT JOIN coach_answers a_c ON q.role = a_c.role AND q.question_number = a_c.question_number
       WHERE q.role = 'coach'
       GROUP BY q.role, q.question_number, q.section, q.question_text, q.question_type, q.options, q.sort_order
       
       UNION ALL
       
       SELECT 
        q.role,
        q.question_number as id,
        q.section,
        q.question_text,
        q.question_type,
        q.options,
        q.sort_order,
        COUNT(DISTINCT a_f.email) AS total_responses,
        COUNT(DISTINCT CASE WHEN a_f.answer_text IS NOT NULL OR a_f.answer_options IS NOT NULL THEN a_f.email END) AS valid_responses,
        COUNT(DISTINCT CASE WHEN a_f.answer_text IS NULL AND a_f.answer_options IS NULL AND a_f.email IS NOT NULL THEN a_f.email END) AS skipped_responses
       FROM questions q
       LEFT JOIN family_answers a_f ON q.role = a_f.role AND q.question_number = a_f.question_number
       WHERE q.role = 'family'
       GROUP BY q.role, q.question_number, q.section, q.question_text, q.question_type, q.options, q.sort_order
       
       ORDER BY role, sort_order`
    );

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching question analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET ANSWER DISTRIBUTION FOR A SPECIFIC QUESTION
// ============================================
router.get('/analytics/question-answers/:role/:questionId', auth, isAdmin, async (req, res) => {
  try {
    const { role, questionId } = req.params;
    
    console.log(`📊 Fetching answers for: Role=${role}, Question=${questionId}`);
    
    // Validate role
    if (!['patient', 'coach', 'family'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Get the answer table based on role
    const tableName = role === 'patient' ? 'patient_answers' : 
                     role === 'coach' ? 'coach_answers' : 'family_answers';
    
    // Get question info including options
    const [questionInfo] = await pool.query(
      `SELECT question_text, question_type, options 
       FROM questions 
       WHERE role = ? AND question_number = ?`,
      [role, questionId]
    );
    
    if (questionInfo.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Fetch all answers for this specific question
    const [answers] = await pool.query(
      `SELECT email, answer_text, answer_options, answered_at 
       FROM ${tableName} 
       WHERE question_number = ?`,
      [questionId]
    );
    
    console.log(`📝 Found ${answers.length} answers for question ${questionId}`);
    
    // Process answers to create distribution
    const distributionMap = {};
    
    answers.forEach(row => {
      let answerValue = '';
      
      // Check answer_text first
      if (row.answer_text && row.answer_text.trim() !== '') {
        answerValue = row.answer_text;
      } 
      // Check answer_options (JSON array for checkbox questions)
      else if (row.answer_options) {
        try {
          const parsed = JSON.parse(row.answer_options);
          if (Array.isArray(parsed)) {
            // For checkbox questions, each option is separate
            // We'll count each individually
            parsed.forEach(option => {
              if (option && option.trim() !== '') {
                distributionMap[option.trim()] = (distributionMap[option.trim()] || 0) + 1;
              }
            });
            return; // Skip the single answer push below
          } else {
            answerValue = String(parsed);
          }
        } catch {
          answerValue = String(row.answer_options);
        }
      }
      
      // Only count non-empty answers (for non-checkbox questions)
      if (answerValue && answerValue.trim() !== '') {
        distributionMap[answerValue] = (distributionMap[answerValue] || 0) + 1;
      }
    });
    
    // Convert to array format
    const distribution = Object.keys(distributionMap).map(key => ({
      answer: key,
      count: distributionMap[key]
    }));
    
    // Sort by count descending
    distribution.sort((a, b) => b.count - a.count);
    
    // Parse options from question
    let options = [];
    if (questionInfo[0].options) {
      try {
        options = JSON.parse(questionInfo[0].options);
      } catch {
        options = [];
      }
    }
    
    const response = {
      question: {
        text: questionInfo[0].question_text,
        type: questionInfo[0].question_type,
        options: options
      },
      totalResponses: answers.length,
      distribution: distribution,
    };
    
    console.log(`✅ Returning ${distribution.length} distribution items`);
    
    res.json(response);
    
  } catch (error) {
    console.error('Error fetching question answers:', error);
    // Return empty distribution on error
    res.status(500).json({ 
      error: 'Server error: ' + error.message,
      question: {
        text: 'Question',
        type: 'unknown',
        options: []
      },
      totalResponses: 0,
      distribution: []
    });
  }
});

// ============================================
// GET DAILY REGISTRATIONS
// ============================================
router.get('/analytics/daily', auth, isAdmin, async (req, res) => {
  try {
    const [daily] = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM users WHERE is_active = TRUE 
       GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`
    );
    res.json(daily);
  } catch (error) {
    console.error('Error fetching daily registrations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET SCALE DISTRIBUTION (Composite Key)
// ============================================
router.get('/analytics/scale', auth, isAdmin, async (req, res) => {
  try {
    const [scaleData] = await pool.query(
      `SELECT q.role, q.question_number, q.question_text, a.answer_text, COUNT(*) as count
       FROM questions q
       JOIN patient_answers a ON q.role = a.role AND q.question_number = a.question_number
       WHERE q.question_type = 'scale' AND a.answer_text IS NOT NULL
       GROUP BY q.role, q.question_number, a.answer_text
       UNION ALL
       SELECT q.role, q.question_number, q.question_text, a.answer_text, COUNT(*) as count
       FROM questions q
       JOIN coach_answers a ON q.role = a.role AND q.question_number = a.question_number
       WHERE q.question_type = 'scale' AND a.answer_text IS NOT NULL
       GROUP BY q.role, q.question_number, a.answer_text
       UNION ALL
       SELECT q.role, q.question_number, q.question_text, a.answer_text, COUNT(*) as count
       FROM questions q
       JOIN family_answers a ON q.role = a.role AND q.question_number = a.question_number
       WHERE q.question_type = 'scale' AND a.answer_text IS NOT NULL
       GROUP BY q.role, q.question_number, a.answer_text`
    );
    res.json(scaleData);
  } catch (error) {
    console.error('Error fetching scale data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET PROGRESS DISTRIBUTION
// ============================================
router.get('/analytics/progress', auth, isAdmin, async (req, res) => {
  try {
    const [progress] = await pool.query(
      `SELECT 
        CASE 
          WHEN is_complete = TRUE THEN 'Complete'
          WHEN completion_percentage > 0 THEN 'In Progress'
          ELSE 'Not Started'
        END as status,
        COUNT(*) as count
       FROM response_summary
       GROUP BY status`
    );
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress distribution:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET COMPLETION TREND
// ============================================
router.get('/analytics/trend', auth, isAdmin, async (req, res) => {
  try {
    const [trend] = await pool.query(
      `SELECT DATE(completed_at) as date, COUNT(*) as completions
       FROM response_summary
       WHERE is_complete = TRUE AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(completed_at) ORDER BY date ASC`
    );
    res.json(trend);
  } catch (error) {
    console.error('Error fetching trend data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET WEEKLY REGISTRATIONS
// ============================================
router.get('/analytics/weekly', auth, isAdmin, async (req, res) => {
  try {
    const [weekly] = await pool.query(
      `SELECT YEARWEEK(created_at) as week, MIN(DATE(created_at)) as week_start, COUNT(*) as count
       FROM users WHERE is_active = TRUE
       GROUP BY YEARWEEK(created_at) ORDER BY week DESC LIMIT 4`
    );
    res.json(weekly);
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET COMPLETION STATUS
// ============================================
router.get('/analytics/completion-status', auth, isAdmin, async (req, res) => {
  try {
    const [status] = await pool.query(
      `SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN is_complete = TRUE THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN is_complete = FALSE AND completion_percentage > 0 THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN is_complete = FALSE AND completion_percentage = 0 THEN 1 ELSE 0 END) as not_started
       FROM response_summary`
    );

    res.json(status[0] || { total_users: 0, completed: 0, in_progress: 0, not_started: 0 });
  } catch (error) {
    console.error('Error fetching completion status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;