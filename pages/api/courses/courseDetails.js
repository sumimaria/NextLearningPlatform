import pool from '../../../lib/db';

// This is correct! It is the default function expected by Next.js API Routes.
export default async function handler(req, res) { 
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get courseId from the URL query parameter
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    // Select all relevant course detail columns
    const result = await pool.query(
      `
      SELECT 
        course_id, 
        title, 
        course_summary, 
        what_you_will_learn, 
        syllabus_structure 
      FROM courses 
      WHERE course_id = $1
      `,
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Return the single course object
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to fetch course details:', error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
}