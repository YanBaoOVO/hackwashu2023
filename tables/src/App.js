import React, { useState } from 'react';
import './App.css';
import Login from "./login.js";

function App() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    return (
        <div className="App">
            <header className="App-header">

                <div className="left">
                    <div className = "login-container">
                        <button onClick={() => setLoginModalOpen(true)}>Login</button>
                    </div>
                </div>

                <div className = "title">
                    <h1>Tables</h1>
                </div>

                <div className="right">{/*search*/}
                    <input type="text" placeholder="Search" />
                    <button>Search</button>
                </div>

                <div className="right"></div>
            </header>

            {isLoginModalOpen && (
                <div className="login-modal">
                    <div className="login-box">
                        <button onClick={() => setLoginModalOpen(false)}>Close</button>
                        <Login />
                    </div>
                </div>
            )}

            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/services">Services</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>

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
