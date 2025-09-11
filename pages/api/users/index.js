import pool from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT user_id, name, email FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database query failed:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing user information' });
    }
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, name, email, created_at',
        [name, email, passwordHash]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}