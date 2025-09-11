import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT course_id, title, description FROM courses');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}