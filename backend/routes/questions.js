const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get answer table name based on role
const getAnswerTable = (role) => {
  const tables = {
    patient: 'patient_answers',
    coach: 'coach_answers',
    family: 'family_answers'
  };
  return tables[role] || 'patient_answers';
};

// Update response summary
async function updateResponseSummary(email, role) {
  try {
    const tableName = getAnswerTable(role);

    const [totalResult] = await pool.query(
      'SELECT COUNT(*) as total FROM questions WHERE role = ?',
      [role]
    );

    const [answeredResult] = await pool.query(
      `SELECT COUNT(*) as answered FROM ${tableName} WHERE email = ?`,
      [email]
    );

    const total = totalResult[0]?.total || 0;
    const answered = answeredResult[0]?.answered || 0;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
    const isComplete = total > 0 && answered === total;

    await pool.query(
      `INSERT INTO response_summary 
       (email, role, total_questions, answered_questions, completion_percentage, is_complete, last_activity)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
       total_questions = VALUES(total_questions),
       answered_questions = VALUES(answered_questions),
       completion_percentage = VALUES(completion_percentage),
       is_complete = VALUES(is_complete),
       last_activity = CURRENT_TIMESTAMP,
       completed_at = IF(VALUES(is_complete) = 1 AND is_complete = 0, CURRENT_TIMESTAMP, completed_at)`,
      [email, role, total, answered, percentage, isComplete]
    );
  } catch (error) {
    console.error('Error updating summary:', error);
  }
}

// ============================================
// GET QUESTIONS BY ROLE
// ============================================
router.get('/:role', auth, async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['coach', 'family', 'patient'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Using composite key (role, question_number)
    const [questions] = await pool.query(
      `SELECT question_number as id, section, question_text, question_type, options, sort_order 
       FROM questions 
       WHERE role = ? 
       ORDER BY sort_order`,
      [role]
    );

    // Parse JSON options
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null
    }));

    res.json(parsedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// SAVE ANSWER
// ============================================
router.post('/answer', auth, async (req, res) => {
  try {
    const { questionId, answerText, answerOptions } = req.body;
    const email = req.user.email;
    const role = req.user.role;
    
    const tableName = getAnswerTable(role);
    // questionId from frontend is the question_number
    const questionNumber = questionId;

    console.log(`📝 Saving: Role=${role}, Question=${questionNumber}, Email=${email}`);

    if (!questionNumber) {
      return res.status(400).json({ error: 'Question ID required' });
    }

    // Check if answer exists using composite key
    const [existing] = await pool.query(
      `SELECT id FROM ${tableName} WHERE email = ? AND question_number = ?`,
      [email, questionNumber]
    );

    if (existing.length > 0) {
      // Update existing answer
      await pool.query(
        `UPDATE ${tableName} 
         SET answer_text = ?, answer_options = ?, answered_at = CURRENT_TIMESTAMP
         WHERE email = ? AND question_number = ?`,
        [answerText || null, answerOptions || null, email, questionNumber]
      );
    } else {
      // Insert new answer with role
      await pool.query(
        `INSERT INTO ${tableName} (email, role, question_number, answer_text, answer_options)
         VALUES (?, ?, ?, ?, ?)`,
        [email, role, questionNumber, answerText || null, answerOptions || null]
      );
    }

    // Update response summary
    await updateResponseSummary(email, role);

    res.json({ 
      success: true,
      message: 'Answer saved successfully',
      email: email,
      questionNumber: questionNumber
    });
  } catch (error) {
    console.error('❌ Error saving answer:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET USER'S ANSWERS
// ============================================
router.get('/answers/me', auth, async (req, res) => {
  try {
    const email = req.user.email;
    const role = req.user.role;
    const tableName = getAnswerTable(role);

    const [answers] = await pool.query(
      `SELECT question_number as question_id, answer_text, answer_options, answered_at 
       FROM ${tableName} 
       WHERE email = ?`,
      [email]
    );

    res.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// GET PROGRESS
// ============================================
router.get('/progress/:role', auth, async (req, res) => {
  try {
    const email = req.user.email;
    const { role } = req.params;
    const tableName = getAnswerTable(role);

    // Total questions for role
    const [totalResult] = await pool.query(
      'SELECT COUNT(*) as total FROM questions WHERE role = ?',
      [role]
    );

    // Answered questions
    const [answeredResult] = await pool.query(
      `SELECT COUNT(*) as answered FROM ${tableName} WHERE email = ?`,
      [email]
    );

    const total = totalResult[0]?.total || 0;
    const answered = answeredResult[0]?.answered || 0;

    res.json({
      total,
      answered,
      remaining: total - answered,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
      isComplete: total > 0 && answered === total
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;