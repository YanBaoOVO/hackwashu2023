import React, { useState } from 'react';
import { fetchUserByUsername, checkUsernameExists } from './dbutils.js';
import bcrypt from 'bcryptjs';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there is a user 
    if (await checkUsernameExists(username) > 0) {
      const user = await fetchUserByUsername(username);

      try {
        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          alert('Login successful');
        } else {
          alert('Incorrect credentials');
        }
      } catch (error) {
        console.error('Password comparison error', error);
        alert('Login failed');
      }
    } else {
      alert('Username does not exist');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br></br>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br></br>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
