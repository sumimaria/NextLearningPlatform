import pool from '../../../../lib/db';

/**
 * API handler to fetch the complete, ordered syllabus outline for a given course.
 * Expects a GET request with courseId in the URL path (e.g., /api/courses/2/syllabus).
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get courseId from the dynamic route parameter
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required.' });
  }

  try {
    // Select essential navigation data from CourseContent
    const queryText = `
      SELECT 
        content_id, 
        topic_title, 
        topic_order, 
        title, 
        content_order, 
        content_type
      FROM CourseContent 
      WHERE course_id = $1
      ORDER BY topic_order ASC, content_order ASC; 
    `;
    
    const result = await pool.query(queryText, [courseId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Syllabus content not found for this course.' });
    }

    // Return the ordered list of all content pieces
    res.status(200).json(result.rows);
    
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    res.status(500).json({ error: 'Failed to fetch syllabus due to a server error.' });
  }
}