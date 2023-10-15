import React, { useState } from 'react';
import './App.css';
import Login from "./login.js";
import Register from "./register.js";

function App() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    return (
        <div className="App">
            <div className="account-box">
                <button onClick={() => setLoginModalOpen(true)}>Login</button>
                <button onClick={() => setRegisterModalOpen(true)}>Register</button>
                <div className='search-box'>
                    <input type="text" placeholder="Search"></input>
                    <button >Search</button>
                </div>
            </div>
            <h1 className='header-bar'>Tables</h1>

            {isLoginModalOpen && (
                <div className="login-modal">
                    <div className="login-box">
                        <button className="close-button" onClick={() => setLoginModalOpen(false)}>Close</button>
                        <Login />
                    </div>
                </div>
            )}

            {isRegisterModalOpen && (
                <div className="register-modal">
                    <div className="register-box">
                        <button className="close-button" onClick={() => setRegisterModalOpen(false)}>Close</button>
                        <Register />
                    </div>
                </div>
            )}

            <main>
                <h2>Our Mission</h2>
                <p>Our mission is to create a platform for students to help each other.</p>

                {/* Add other website content here */}
            </main>

            <footer>
                <p>&copy; 2023 Tables</p>
            </footer>
        </div>
    );
}

export default App;
