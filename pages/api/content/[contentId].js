import pool from '../../../lib/db';

/**
 * API handler to fetch details for a single piece of course content.
 * Expects a GET request with contentId in the URL path (e.g., /api/content/15).
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get contentId from the dynamic route parameter
  const { contentId } = req.query;

  if (!contentId) {
    // This case shouldn't happen with a dynamic route but is good defensive programming
    return res.status(400).json({ error: 'Content ID is required.' });
  }

  try {
    // Select all columns for the specific content page
    const queryText = `
      SELECT 
        content_id, 
        course_id, 
        topic_title, 
        topic_order, 
        title, 
        content_order, 
        content_type, 
        content_body, 
        video_url
      FROM CourseContent 
      WHERE content_id = $1;
    `;
    
    const result = await pool.query(queryText, [contentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course content not found.' });
    }

    // Return the single content object
    res.status(200).json(result.rows[0]);
    
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to fetch course content due to a server error.' });
  }
}