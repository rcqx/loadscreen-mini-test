const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/employees', (req, res) => {
  const { search, department, sort = 'id', order = 'asc' } = req.query;

  const allowedSort = ['id', 'name', 'department', 'position', 'hire_date', 'salary'];
  const allowedOrder = ['asc', 'desc'];
  const sortCol = allowedSort.includes(sort) ? sort : 'id';
  const sortOrder = allowedOrder.includes(order) ? order : 'asc';

  let query = 'SELECT * FROM employees WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR position LIKE ? OR email LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (department && department !== 'all') {
    query += ' AND department = ?';
    params.push(department);
  }

  query += ` ORDER BY ${sortCol} ${sortOrder.toUpperCase()}`;

  const employees = db.prepare(query).all(...params);
  res.json(employees);
});

app.post('/api/employees', (req, res) => {
  const { name, department, position, email, phone, hire_date, salary } = req.body;

  if (!name || !department || !position || !email || !hire_date || !salary) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = db.prepare(`
      INSERT INTO employees (name, department, position, email, phone, hire_date, salary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = query.run(name, department, position, email, phone || null, hire_date, salary);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email must be unique' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

app.patch('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, department, position, email, phone, hire_date, salary } = req.body;

  if (!name || !department || !position || !email || !hire_date || !salary) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = db.prepare(`
      UPDATE employees
      SET name = ?, department = ?, position = ?, email = ?, phone = ?, hire_date = ?, salary = ?
      WHERE id = ?
    `);
    const info = query.run(name, department, position, email, phone || null, hire_date, salary, id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email must be unique' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = db.prepare('DELETE FROM employees WHERE id = ?');
  const info = query.run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json({ success: true });
});

app.get('/api/departments', (req, res) => {
  const departments = db.prepare('SELECT DISTINCT department FROM employees ORDER BY department').all();
  res.json(departments.map(d => d.department));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
