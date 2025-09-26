import pool from '../../../lib/db';

/**
 * API handler to create a new course.
 * Expects a POST request with course details in the body.
 */
export default async function handler(req, res) {
  // 1. Check for POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 2. Destructure data from the request body
  const { 
    title, 
    course_summary, 
    what_you_will_learn, 
    syllabus_structure 
  } = req.body;

  // 3. Basic Validation
  if (!title || !course_summary) {
    return res.status(400).json({ error: 'Title and course summary are required fields.' });
  }

  // 4. Validate JSON fields (Ensure they are present, even if empty arrays)
  const learnData = what_you_will_learn || [];
  const syllabusData = syllabus_structure || [];

  try {
    // 5. PostgreSQL INSERT Query
    // Note: We use $1, $2, $3, $4 for parameterized queries to prevent SQL injection.
    const queryText = `
      INSERT INTO Courses (
        title, 
        course_summary, 
        what_you_will_learn, 
        syllabus_structure
      )
      VALUES ($1, $2, $3, $4)
      RETURNING course_id, title;
    `;
    
    const values = [
      title, 
      course_summary, 
      // PostgreSQL automatically handles JS arrays/objects inserted into JSONB columns
      JSON.stringify(learnData), 
      JSON.stringify(syllabusData) 
    ];

    const result = await pool.query(queryText, values);
    
    // 6. Return the newly created course details
    res.status(201).json({
      message: 'Course created successfully',
      course: result.rows[0],
    });
    
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course due to a server error.' });
  }
}