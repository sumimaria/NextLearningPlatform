import pool from '../../../lib/db'; // Assuming your db connection is here

/**
 * API handler to record user progress/completion of a content item (exercise).
 * Expects a POST request with userId, contentId, score, and attempts in the body.
 */
export default async function handler(req, res) {
  // 1. Method Check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 2. Extract Data from Request Body
  // Note: score and attempts are optional in the request body
  const { userId, contentId, score, attempts } = req.body;

  // 3. Input Validation
  if (!userId || !contentId) {
    return res.status(400).json({ error: 'Missing required fields: userId and contentId.' });
  }

  // Basic type conversion and validation
  const uId = parseInt(userId, 10);
  const cId = parseInt(contentId, 10);
  const finalScore = score === undefined ? null : parseFloat(score); // Use NULL if score is missing
  const finalAttempts = attempts === undefined ? 1 : parseInt(attempts, 10);

  if (isNaN(uId) || isNaN(cId) || (finalScore !== null && isNaN(finalScore)) || isNaN(finalAttempts)) {
    return res.status(400).json({ error: 'Invalid data types provided for one or more fields.' });
  }
  
  try {
    // 4. PostgreSQL UPSERT Logic (Recommended)
    // To handle re-submission or updates:
    // If a record already exists (user_id, content_id), update it.
    // If no record exists, insert a new one.
    const queryText = `
      INSERT INTO userprogress (user_id, content_id, is_completed, score, attempts)
      VALUES ($1, $2, TRUE, $3, $4)
      ON CONFLICT (user_id, content_id) DO UPDATE 
      SET 
        score = EXCLUDED.score, 
        attempts = EXCLUDED.attempts,
        completed_at = NOW(),
        is_completed = TRUE
      RETURNING progress_id;
    `;
    
    const result = await pool.query(queryText, [
      uId, 
      cId, 
      finalScore, 
      finalAttempts
    ]);

    // 5. Return Success
    res.status(201).json({ 
      message: 'User progress recorded successfully.', 
      progressId: result.rows[0].progress_id 
    });
    
  } catch (error) {
    console.error('Error recording user progress:', error);
    
    // Check for common Foreign Key constraint violations (if possible)
    if (error.code === '23503') { // PostgreSQL Foreign Key Violation Code
        return res.status(409).json({ error: 'Invalid User ID or Content ID provided.' });
    }

    res.status(500).json({ error: 'Failed to record user progress due to a server error.' });
  }
}