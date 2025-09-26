import pool from '../../../lib/db';

/**
 * API handler to add a single piece of content (lecture, exercise, etc.)
 * to a specified topic within a course.
 * Expects a POST request with content details in the body.
 */
export default async function handler(req, res) {
  // 1. Check for POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 2. Destructure data from the request body
  const { 
    course_id, 
    topic_title, 
    topic_order, 
    title, 
    content_order, 
    content_type, 
    content_body, 
    video_url 
  } = req.body;

  // 3. Basic Validation (Crucial fields)
  if (!course_id || !topic_title || topic_order === undefined || !title || content_order === undefined) {
    return res.status(400).json({ error: 'Course ID, topic title/order, and content title/order are required fields.' });
  }

  // Ensure topic_order and content_order are numbers (PostgreSQL will validate INT)
  // and convert content_type to a safe default if missing.
  const finalContentType = content_type || 'lecture';

  try {
    // 4. PostgreSQL INSERT Query
    const queryText = `
      INSERT INTO CourseContent (
        course_id, 
        topic_title, 
        topic_order, 
        title, 
        content_order, 
        content_type, 
        content_body, 
        video_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING content_id, title, topic_title;
    `;
    
    const values = [
      course_id,
      topic_title,
      topic_order,
      title,
      content_order,
      finalContentType,
      content_body,
      video_url
    ];

    const result = await pool.query(queryText, values);
    
    // 5. Return the newly created content identifier
    res.status(201).json({
      message: 'Course content created successfully',
      content: result.rows[0],
    });
    
  } catch (error) {
    // Check for unique constraint violation error (code 23505)
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'Conflict: Content with this topic order and content order already exists in the course.' 
      });
    }
    console.error('Error creating course content:', error);
    res.status(500).json({ error: 'Failed to create course content due to a server error.' });
  }
}