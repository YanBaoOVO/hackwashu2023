import React, { useState } from 'react';
import { addUser } from './dbutils.js'; // Assume you have a function to call API for user registration
import bcrypt from 'bcryptjs';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hashedPassword, setHashedPassword] = useState(''); // State to store the hashed password

    // Hash the password when it changes
    const hashPassword = async (passwordToHash) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(passwordToHash, salt);
            setHashedPassword(hash);
        } catch (error) {
            console.error("Could not hash password", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // Optionally hash the password on the client-side before sending it to the server
        await hashPassword(password);

        // Send the username and hashed password to the server
        // Here we're assuming the server expects properties 'username' and 'password'
        try {
            await addUser(username, hashedPassword );
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