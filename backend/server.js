const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// DATABASE CONNECTION
// ============================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zeen_a_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
(async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('📝 Please check your database credentials in Render environment variables.');
  }
})();

// Make pool available to routes
app.set('db', pool);

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://zeen-a-platform.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// TEST ROUTES
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Zeen A API is running' });
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ 
      connected: true, 
      data: result,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST
    });
  } catch (error) {
    res.status(500).json({ 
      connected: false, 
      error: error.message,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST
    });
  }
});

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/admin', require('./routes/admin'));

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  DB Test: http://localhost:${PORT}/api/db-test`);
});