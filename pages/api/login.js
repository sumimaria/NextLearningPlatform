import pool from '../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Use an environment variable for your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT user_id, name, email, password_hash FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Create a JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    // Omit password hash from the response
    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Login successful',
      token, // Send the token to the client
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
}


// import pool from '../../lib/db';
// import bcrypt from 'bcrypt';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
//   const { email, password } = req.body;
//   try {
//     const result = await pool.query('SELECT user_id, name, email, password_hash FROM users WHERE email = $1', [email]);
//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid email' });
//     }
//     const user = result.rows[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password_hash);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }
//     // Omit password hash from the response
//     const { password_hash, ...userWithoutPassword } = user;
//     res.status(200).json({
//       message: 'Login successful',
//       user: userWithoutPassword,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred during login' });
//   }
// }