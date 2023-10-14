import React from 'react';
import './App.css';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My College Help Website</h1>
        </header>

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
          <p>
            Our mission is to create a platform for students to help each other.
          </p>

          {/* Add other website content here */}
        </main>

        <footer>
          <p>&copy; 2023 College Help</p>
        </footer>
      </div>
  );
}

export default App;
