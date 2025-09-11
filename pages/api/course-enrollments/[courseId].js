import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { courseId } = req.query;
  try {
    const result = await pool.query(`
      SELECT u.user_id, u.name, u.email
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      WHERE e.course_id = $1`, [courseId]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled users' });
  }
}