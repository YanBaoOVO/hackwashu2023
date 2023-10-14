import React, { useState, useEffect } from 'react';
import {fetchUserByUsername, checkUsernameExists} from './dbutils.js';
import bcrypt from 'bcryptjs'; // Import bcrypt for client-side hashing

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hashedPassword, setHashedPassword] = useState(''); // State to store the hashed password

    // Hash the password when it changes
    useEffect(() => {
        if (password) {
            // Generate a salt and hash the password
            bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (!err) {
                            setHashedPassword(hash);
                        }
                    });
                }
            });
        } else {
            // Clear the hashed password if the password field is empty
            setHashedPassword('');
        }
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const ifUserNameExists = checkUsernameExists(username);
        if (ifUserNameExists) {
            const user = fetchUserByUsername(username);

            // Compare the hashed password with the stored hash
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    alert('Login successful');
                } else {
                    alert('Incorrect credentials');
                }
            });
        } else {
            alert('Username does not exist');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" // Use "text" for username, not "username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
