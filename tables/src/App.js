import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './login.js';
import { fetchAllTasks } from './dbutils.js';
import Register from "./register.js";

function App() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);

    useEffect(() => {
        // Fetch tasks when the component mounts
        const fetchData = async () => {
            const allTasks = await fetchAllTasks();
            setTasks(allTasks);
        };

        fetchData();
    }, []);

    // Function to handle task card click
    const handleTaskCardClick = (task) => {
        setSelectedTask(task);
        setTaskModalOpen(true);
        console.log(task + " is clicked");
    };

    // Function to close the task modal
    const closeTaskModal = () => {
        setTaskModalOpen(false);
        setSelectedTask(null);
    };

    return (
        <div className="App">
            <div className="account-box">
                <button onClick={() => setLoginModalOpen(true)}>Login</button>
                <button onClick={() => setRegisterModalOpen(true)}>Register</button>
                <div className='search-box'>
                    <input type="text" placeholder="Search"></input>
                    <button onClick={() => setLoginModalOpen(true)}>Search</button>
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
                <div className='task-card-container'>
                I want to <input type='text' placeholder='buy me a cup of coffee'></input> by <input type='datetime-local'></input>, the reward is <input type='text' placeholder='a cup of coffee...'></input>.
                Here are some notes to help accomplish this task: <input type='text' placeholder='whole milk please...'></input>. Thanks!
                </div>
                <h1>What will you bring to the table?</h1>
                <div className="task-card-container">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                className="task-card"
                                key={task.id}
                                onClick={() => handleTaskCardClick(task)} // Click event to open the task modal
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

            {/* Task Modal */}
            {isTaskModalOpen && selectedTask && (
                <div className="task-modal">
                    <div className="task-modal-container">
                        <h2>{selectedTask.title}</h2>
                        <p>{selectedTask.description}</p>
                        <p>Deadline {new Date(selectedTask.deadline.seconds * 1000).toLocaleString()}</p>
                        <p>Reward {selectedTask.reward}</p>
                        <p>By {selectedTask.requester}</p>
                        <button>Accept task</button>
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
