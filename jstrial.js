const bcrypt = require('bcrypt');
//const plaintextPassword = 'testpass123';//$2b$10$XqZ5qzuWgiy0F0A1FXSaTuCz1161Ao37KuEQKjGLY6IER8mhdXxAi
const plaintextPassword = '123';

bcrypt.hash(plaintextPassword, 10, function(err, hash) {
  if (err) throw err;
  console.log(hash);
  // Store this hash in your 'password_hash' column in the database
});