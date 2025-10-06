import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { userId } = req.query;
  try {
    const result = await pool.query(`
      SELECT c.course_id, c.title, c.course_summary
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.user_id = $1`, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error in /api/enrollments:", error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
}

