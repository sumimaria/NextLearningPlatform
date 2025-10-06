import pool from '../../../../lib/db'; // Assuming your db connection is here

/**
 * API handler to fetch all content items for a given course, ordered by page order.
 * Expects a GET request with courseId in the URL path (e.g., /api/courses/42/content).
 */
export default async function handler(req, res) {
  // 1. Method Check
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 2. Get courseId from the dynamic route parameter
  const { courseId } = req.query;

  // 3. Input Validation
  const id = parseInt(courseId, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Valid Course ID is required.' });
  }

  try {
    // 4. PostgreSQL Query
    // Note: Assuming your 'CourseContent' table has the columns from your original schema.
    const queryText = `
      SELECT 
        content_id, 
        title, 
        content_type, 
        content_order, 
        content_body, 
        video_url
      FROM 
        CourseContent 
      WHERE 
        course_id = $1
      ORDER BY 
        content_order ASC, content_id ASC; 
    `;
    
    // Execute the query using the parameterized approach (PostgreSQL: $1, $2, etc.)
    const result = await pool.query(queryText, [id]);

    // 5. Handle Not Found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course content not found for this course ID.' });
    }

    // 6. Return the results
    res.status(200).json(result.rows);
    
  } catch (error) {
    console.error('Error fetching course content:', error);
    // Respond with a generic server error message
    res.status(500).json({ error: 'Failed to retrieve course content due to a server error.' });
  }
}