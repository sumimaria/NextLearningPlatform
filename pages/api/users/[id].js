import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const result = await pool.query('SELECT user_id, name, email FROM users WHERE user_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}