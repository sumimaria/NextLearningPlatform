import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: 'User ID and Course ID are required' });
  }

  try {
    // Check if the enrollment already exists
    const existingEnrollment = await pool.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (existingEnrollment.rows.length > 0) {
      return res.status(409).json({ error: 'User is already enrolled in this course' });
    }

    // Insert the new enrollment record
    const result = await pool.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING enrollment_id',
      [userId, courseId]
    );

    res.status(201).json({
      message: 'Enrollment successful',
      enrollmentId: result.rows[0].enrollment_id,
    });
  } catch (error) {
    console.error('Enrollment API error:', error);
    res.status(500).json({ error: 'An error occurred during enrollment' });
  }
}