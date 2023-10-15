import React, { useState } from 'react';
import { addUser, checkUsernameExists } from './dbutils.js'; // Assume you have a function to call API for user registration
import bcrypt from 'bcryptjs';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // check for duplicate usernames
        if(await checkUsernameExists(username) > 0){
            alert("Duplicate username, please think of another username");
            return;
        }

        // Hash the password on the client-side before sending it to the server
        try {
            const hashed = await bcrypt.hash(password, 10);
            // Send the username and hashed password to the server
            await addUser(username, hashed);
            alert('Registration successful');
        } catch (error) {
            alert('Failed to register');
            console.error("Registration error", error);
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
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
