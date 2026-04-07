const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change this to your MySQL username
  password: '', // Change this to your MySQL password
  database: 'studyflow' // Change this to your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes for tasks
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, category, priority, dueDate, completed } = req.body;
  const query = 'INSERT INTO tasks (title, description, category, priority, dueDate, completed) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [title, description, category, priority, dueDate, completed], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, category, priority, dueDate, completed } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, dueDate = ?, completed = ? WHERE id = ?';
  db.query(query, [title, description, category, priority, dueDate, completed, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, ...req.body });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted' });
  });
});

// Routes for streak
app.get('/api/streak', (req, res) => {
  db.query('SELECT * FROM streak LIMIT 1', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0] || { current: 0, best: 0, lastActiveDate: '' });
  });
});

app.put('/api/streak', (req, res) => {
  const { current, best, lastActiveDate } = req.body;
  const query = 'INSERT INTO streak (current, best, lastActiveDate) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE current = ?, best = ?, lastActiveDate = ?';
  db.query(query, [current, best, lastActiveDate, current, best, lastActiveDate], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(req.body);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});