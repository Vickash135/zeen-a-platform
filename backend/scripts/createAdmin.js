const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createAdmin() {
  try {
    console.log('📡 Connecting to MySQL...');
    console.log('📧 DB_HOST:', process.env.DB_HOST);
    console.log('👤 DB_USER:', process.env.DB_USER);
    console.log('📊 DB_NAME:', process.env.DB_NAME);

    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root123',
      database: process.env.DB_NAME || 'zeen_a_db',
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully!');
    connection.release();

    const password = 'Admin@123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('🔐 Generated hash:', passwordHash);

    // Delete existing admin
    const [deleteResult] = await pool.query("DELETE FROM admin_users WHERE email = 'admin@zeena.com'");
    console.log(`🗑️ Deleted ${deleteResult.affectedRows} existing admin record(s)`);

    // Insert new admin
    const [insertResult] = await pool.query(
      `INSERT INTO admin_users (email, password_hash, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      ['admin@zeena.com', passwordHash, 'Admin', 'Zeen', 'super_admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@zeena.com');
    console.log('🔑 Password: Admin@123');
    console.log('🆔 Insert ID:', insertResult.insertId);

    // Verify the admin was inserted
    const [verifyResult] = await pool.query(
      'SELECT email, first_name, last_name, role FROM admin_users WHERE email = ?',
      ['admin@zeena.com']
    );

    if (verifyResult.length > 0) {
      console.log('✅ Verification successful:');
      console.log('   📧', verifyResult[0].email);
      console.log('   👤', verifyResult[0].first_name, verifyResult[0].last_name);
      console.log('   🔐', verifyResult[0].role);
    }

    await pool.end();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Full error:', error);
  }
}

createAdmin();