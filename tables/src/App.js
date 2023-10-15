import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './login.js';
import { fetchAllTasks, addTask } from './dbutils.js'; // Import addTask function
import Register from "./register.js";
import Timestamp from 'firebase/firestore';

function App() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State to hold the current search term.
    const [displayedTasks, setDisplayedTasks] = useState([]); // State to hold the tasks that are displayed on the UI.

    useEffect(() => {
        // Fetch tasks when the component mounts
        const fetchData = async () => {
            const allTasks = await fetchAllTasks();
            setTasks(allTasks);
            setDisplayedTasks(allTasks);
        };
        fetchData();
    }, []);

    function isLoggedIn() {
        return localStorage.getItem('username') != null;
    }

    const handleSearch = () => {
        if (!searchTerm) {
            setDisplayedTasks(tasks);
        } else {
            const filteredTasks = tasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDisplayedTasks(filteredTasks);
        }
    };

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTaskCardClick = (task) => {
        setSelectedTask(task);
        setTaskModalOpen(true);
    };

    const closeTaskModal = () => {
        setTaskModalOpen(false);
        setSelectedTask(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        alert("You are logged out");
        window.location.reload();
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();

        // Get input values
        const title = e.target.elements.title.value;
        const deadline = e.target.elements.deadline.value;
        const reward = e.target.elements.reward.value;
        const desc = e.target.elements.desc.value;
        const post_time = new Date();

        // Add the task to the database
        const [success, taskId] = await addTask(
            deadline,
            desc,
            post_time,
            localStorage.getItem('username'),
            null, // Set responder to null initially
            reward,
            0,
            title
        );

        if (success) {
            console.log('Task added with ID: ', taskId);
            e.target.reset(); // Reset the form
            window.location.reload();
        } else {
            console.error('Failed to add the task');
        }
    };

    return (
        <div className="App">
            <div className="account-box">
                {isLoggedIn() ? (
                    <>
                        <div className='hello-text'>You are logged in as: {localStorage.getItem('username')}</div>
                        <button onClick={handleLogout}>Log Out</button>
                    </>

                ) : (
                    <>
                        <button onClick={() => setLoginModalOpen(true)}>Login</button>
                        <button onClick={() => setRegisterModalOpen(true)}>Register</button>
                    </>
                )}

                <div className='search-box'>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onKeyUp={handleSearch}
                        onChange={handleSearchInput}
                    />
                    <button onClick={handleSearch}>Search</button>
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
                <h1>What would you like the community to do for you?</h1>
                <form onSubmit={handleSubmitTask}>
                    <div className='task-card-container'>
                        I want to
                        <input type='text' placeholder='buy me a cup of coffee' name="title" required />
                        by
                        <input type='datetime-local' name="deadline" required />
                        , the reward is
                        <input type='text' placeholder='a cup of coffee...' name="reward" required />
                        .
                        Here are some notes to help accomplish this task:
                        <input type='text' placeholder='whole milk please...' name="desc" />
                        . Thanks!
                        <button type="submit">Submit</button>
                    </div>
                </form>

                <h1>What will you bring to the table?</h1>
                <div className="task-card-container">
                    {displayedTasks.length > 0 ? (
                        displayedTasks.map((task) => (
                            <div
                                className="task-card"
                                key={task.id}
                                onClick={() => handleTaskCardClick(task)}
                            >
                                <h2>{task.title}</h2>
                                <p>{task.description}</p>
                                <p>Deadline {new Date(task.deadline.seconds * 1000).toLocaleString()}</p>
                                <p>Reward {task.reward}</p>
                                <p>By {task.requester}</p>
                            </div>
                        ))
                    ) : (
                        <p>No tasks available</p>
                    )}
                </div>
            </main>

            {isTaskModalOpen && selectedTask && (
                <div className="task-modal">
                    <div className="task-modal-container">
                        <h2>{selectedTask.title}</h2>
                        <p>{selectedTask.description}</p>
                        <p>Deadline {new Date(selectedTask.deadline.seconds * 1000).toLocaleString()}</p>
                        <p>Reward {selectedTask.reward}</p>
                        <p>By {selectedTask.requester}</p>
                        {isLoggedIn() && <button>Accept task</button>}
                        <button onClick={closeTaskModal}>Close</button>
                    </div>
                </div>
            )}

            <footer>
                <p>&copy; 2023 Tables</p>
            </footer>
        </div>
    );
}

export default App;
