require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

// ✅ CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'edvin',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ✅ MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Camellia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ DB Connection Check
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
  }
})();

// ==================== HELPER FUNCTIONS ====================

/**
 * Logs an activity to the ActivityLog table
 * @param {string} action - The action description
 * @param {string} icon - The icon to display (emoji)
 * @param {number} userId - The user ID performing the action
 */
const logActivity = async (action, icon, userId = null) => {
  try {
    await pool.execute(
      'INSERT INTO ActivityLog (action, icon, userId) VALUES (?, ?, ?)',
      [action, icon, userId]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

/**
 * Validates required fields in request body
 * @param {object} body - Request body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {string|null} Error message or null if validation passes
 */
const validateRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter(field => !body[field]);
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }
  return null;
};

// ==================== AUTH ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    const validationError = validateRequiredFields(req.body, ['username', 'password']);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.execute(
      'INSERT INTO Users (UserName, Password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    await logActivity(`User registered: ${username}`, '👤', result.insertId);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    const validationError = validateRequiredFields(req.body, ['username', 'password']);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const [users] = await pool.execute(
      'SELECT * FROM Users WHERE UserName = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, users[0].Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      id: users[0].UserID,
      username: users[0].UserName
    };
    

    await logActivity(`User logged in: ${username}`, '🔑', users[0].UserID);
    res.json({ message: 'Logged in successfully', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  if (req.session.user) {
    logActivity(`User logged out: ${req.session.user.username}`, '🚪', req.session.user.id);
  }
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// ==================== POSTS ====================

app.post('/api/posts', async (req, res) => {
  try {
    const { postName } = req.body;
    
    // Validate input
    const validationError = validateRequiredFields(req.body, ['postName']);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const [result] = await pool.execute(
      'INSERT INTO Post (PostName) VALUES (?)',
      [postName]
    );

    await logActivity(`Post created: ${postName}`, '📝', req.session.user.id);
    res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const [posts] = await pool.execute('SELECT * FROM Post');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const [posts] = await pool.execute(
      'SELECT * FROM post WHERE PostID = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(posts[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { postName } = req.body;
    
    // Validate input
    const validationError = validateRequiredFields(req.body, ['postName']);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const [result] = await pool.execute(
      'UPDATE Post SET PostName = ? WHERE PostID = ?',
      [postName, postId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await logActivity(`Post updated: ${postName}`, '✏️', req.session.user.id);
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // First get the post name for logging
    const [posts] = await pool.execute(
      'SELECT PostName FROM Post WHERE PostID = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const [result] = await pool.execute(
      'DELETE FROM Post WHERE PostID = ?',
      [postId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await logActivity(`Post deleted: ${posts[0].PostName}`, '🗑️', req.session.user.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== CANDIDATES ====================

app.post('/api/candidates', async (req, res) => {
  try {
    const {
      candidateNationalId,
      firstName,
      lastName,
      gender,
      postID,
      examDate,
      phoneNumber,
      marks,
      dateOfBirth
    } = req.body;
    
    // Validate input
    const validationError = validateRequiredFields(req.body, [
      'candidateNationalId',
      'firstName',
      'lastName',
      'gender',
      'postID',
      'examDate',
      'phoneNumber',
      'marks',
      'dateOfBirth'
    ]);
    
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Data type validation
    if (isNaN(parseInt(postID))) {
      return res.status(400).json({ error: 'postID must be a number' });
    }

    if (isNaN(parseFloat(marks))) {
      return res.status(400).json({ error: 'marks must be a number' });
    }

    const [result] = await pool.execute(
      `INSERT INTO Candidate (
        CandidateNationalId, FirstName, LastName, Gender,
        DataOfficials, PostID, ExamDate, PhoneNumber, Marks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        candidateNationalId,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        postID,
        examDate,
        phoneNumber,
        marks
      ]
    );

    await logActivity(
      `Candidate added: ${firstName} ${lastName}`,
      '👤'
    );
    
    res.status(201).json({ message: 'Candidate added successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Candidate with this ID already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/api/candidates', async (req, res) => {
  try {
    const [candidates] = await pool.execute(`
      SELECT c.*, p.PostName 
      FROM Candidate c
      LEFT JOIN Post p ON c.PostID = p.PostID
      ORDER BY c.Marks DESC
    `);
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/candidates/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;
    const [candidates] = await pool.execute(`
      SELECT c.*, p.PostName 
      FROM Candidate c
      LEFT JOIN Post p ON c.PostID = p.PostID
      WHERE c.CandidateNationalId = ?
    `, [candidateId]);

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidates[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/candidates/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phoneNumber,
      postID,
      examDate,
      marks
    } = req.body;
    
    // Validate input
    const validationError = validateRequiredFields(req.body, [
      'firstName',
      'lastName',
      'gender',
      'dateOfBirth',
      'phoneNumber',
      'postID',
      'examDate',
      'marks'
    ]);
    
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const [result] = await pool.execute(
      `UPDATE Candidate SET
        FirstName = ?,
        LastName = ?,
        Gender = ?,
        DataOfficials = ?,
        PhoneNumber = ?,
        PostID = ?,
        ExamDate = ?,
        Marks = ?
      WHERE CandidateNationalId = ?`,
      [
        firstName,
        lastName,
        gender,
        dateOfBirth,
        phoneNumber,
        postID,
        examDate,
        marks,
        candidateId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    await logActivity(
      `Candidate updated: ${firstName} ${lastName}`,
      '✏️',
      req.session.user.id
    );
    
    res.json({ message: 'Candidate updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/candidates/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;
    
    // First get candidate details for logging
    const [candidates] = await pool.execute(
      'SELECT FirstName, LastName FROM Candidate WHERE CandidateNationalId = ?',
      [candidateId]
    );

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const [result] = await pool.execute(
      'DELETE FROM Candidate WHERE CandidateNationalId = ?',
      [candidateId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    await logActivity(
      `Candidate deleted: ${candidates[0].FirstName} ${candidates[0].LastName}`,
      '🗑️',
    );
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ACTIVITY LOG ====================

app.get('/api/activities', async (req, res) => {
  try {
    const [activities] = await pool.execute(`
      SELECT a.*, u.UserName 
      FROM ActivityLog a
      LEFT JOIN Users u ON a.userId = u.UserID
      ORDER BY a.time DESC
      LIMIT 50
    `);
    
    // Format the time for better readability
    const formattedActivities = activities.map(activity => ({
      ...activity,
      time: new Date(activity.time).toLocaleString()
    }));
    
    res.json(formattedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== DASHBOARD ====================

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [posts, candidates, avgMarks, recentExams, users, activities] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM Post'),
      pool.query('SELECT COUNT(*) AS total FROM Candidate'),
      pool.query('SELECT AVG(Marks) AS average FROM Candidate'),
      pool.query('SELECT COUNT(*) AS exams FROM Candidate WHERE ExamDate >= DATE_SUB(NOW(), INTERVAL 30 DAY)'),
      pool.query('SELECT COUNT(*) AS total FROM Users'),
      pool.query('SELECT COUNT(*) AS total FROM ActivityLog WHERE time >= DATE_SUB(NOW(), INTERVAL 7 DAY)')
    ]);

    res.json({
      posts: posts[0][0].total,
      candidates: candidates[0][0].total,
      avgMarks: parseFloat(avgMarks[0][0].average) || 0,
      recentExams: recentExams[0][0].exams,
      users: users[0][0].total,
      recentActivities: activities[0][0].total
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard/top-candidates', async (req, res) => {
  try {
    const [topCandidates] = await pool.query(`
      SELECT 
        c.CandidateNationalId, 
        CONCAT(c.FirstName, ' ', c.LastName) AS fullName,
        c.Marks,
        p.PostName
      FROM Candidate c
      LEFT JOIN Post p ON c.PostID = p.PostID
      ORDER BY c.Marks DESC
      LIMIT 5
    `);

    res.json(topCandidates);
  } catch (err) {
    console.error('Top candidates error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard/recent-activities', async (req, res) => {
  try {
    const [activities] = await pool.query(`
      SELECT 
        a.action,
        a.icon,
        a.time,
        u.UserName
      FROM ActivityLog a
      LEFT JOIN Users u ON a.userId = u.UserID
      ORDER BY a.time DESC
      LIMIT 10
    `);

    const formattedActivities = activities.map(activity => ({
      ...activity,
      time: new Date(activity.time).toLocaleString()
    }));

    res.json(formattedActivities);
  } catch (err) {
    console.error('Recent activities error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== GLOBAL ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message || 'An unexpected error occurred' 
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});