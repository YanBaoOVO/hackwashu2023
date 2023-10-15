import React, { useState, useEffect } from 'react';
// import './App.css';
import Login from './login.js';
import { fetchAllTasks, addTask, updateTaskStatus } from './dbutils.js';
import Register from "./register.js";
import Timestamp from 'firebase/firestore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AppBar from '@mui/material/AppBar'; // Import AppBar component
import Toolbar from '@mui/material/Toolbar'; // Import Toolbar component
import List from '@mui/material/List';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import { ListItemButton } from '@mui/material';
import { ListItemText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';



function App() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedTasks, setDisplayedTasks] = useState([]);
    const navItems = ['Login', 'Regsiter'];

    useEffect(() => {
        const fetchData = async () => {
            const allTasks = await fetchAllTasks();
            setTasks(allTasks);
            setDisplayedTasks(allTasks);
        };
        fetchData();
    }, []);

    function isLoggedIn() {
        return localStorage.getItem('username') !== null;
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

    const acceptTask = () => {
        const res = updateTaskStatus(selectedTask.id, 1);

        if (res) {
            alert("You have accepted this task!");
        }
        else {
            alert("Accept task failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        alert("You are logged out");
        window.location.reload();
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();

        const title = e.target.elements.title.value;
        const deadline = e.target.elements.deadline.value;
        const reward = e.target.elements.reward.value;
        const desc = e.target.elements.desc.value;
        const post_time = new Date();

        const [success, taskId] = await addTask(
            deadline,
            desc,
            post_time,
            localStorage.getItem('username'),
            null,
            reward,
            0,
            title
        );

        if (success) {
            console.log('Task added with ID: ', taskId);
            e.target.reset();
            window.location.reload();
        } else {
            console.error('Failed to add the task');
        }
    };

    return (
        <div className="App">
            {/* App Bar */}
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <List>
                            {isLoggedIn() ? (
                                <div className='hello-text'>You are logged in as: {localStorage.getItem('username')}</div>
                            ) : (
                                <>
                                    <Button variant="contained" onClick={() => setLoginModalOpen(true)}>Login</Button>
                                    <Button variant="contained" onClick={() => setRegisterModalOpen(true)}>Register</Button>
                                </>
                            )}
                        </List>

                        {/* { (
                            <>
                                <Button variant="contained" onClick={() => setLoginModalOpen(true)}>Login</Button>
                                <Button variant="contained" onClick={() => setRegisterModalOpen(true)}>Register</Button>
                            </>
                        )} */}


                        <div style={{ float: 'right', color: 'white' }}>
                            <form>
                                <TextField
                                    id="search-bar"
                                    className="text"
                                    onKeyUp={handleSearch}
                                    onChange={handleSearchInput}
                                    value={searchTerm}
                                    variant="outlined"
                                    placeholder="Search..."
                                    size="small"
                                />
                                <Button type="submit" onClick={handleSearch}>Go</Button>
                            </form>
                        </div>

                    </Toolbar>
                </Container>
            </AppBar>

            {isLoginModalOpen && (
                <div className="login-modal">
                    <div className="login-box">
                        <Button className="close-button" onClick={() => setLoginModalOpen(false)}>Close</Button>
                        <Login />
                    </div>
                </div>
            )}

            {isRegisterModalOpen && (
                <div className="register-modal">
                    <div className="register-box">
                        <Button className="close-button" onClick={() => setRegisterModalOpen(false)}>Close</Button>
                        <Register />
                    </div>
                </div>
            )}

            <main>
                <Box p={2}>
                    <h1 className='header-bar'>Tables</h1>
                    <h2>What would you like the community to do for you?</h2>
                    <form onSubmit={handleSubmitTask}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Create a Task</Typography>
                                <TextField
                                    name="title"
                                    label="Title"
                                    variant="outlined"
                                    required
                                    style={{ marginRight: '8px' }}
                                />
                                <TextField
                                    name="deadline"
                                    type="datetime-local"
                                    variant="outlined"
                                    required
                                    style={{ marginRight: '8px' }}
                                />
                                <TextField
                                    name="reward"
                                    label="Reward"
                                    variant="outlined"
                                    required
                                    style={{ marginRight: '8px' }}
                                />
                                <TextField
                                    name="desc"
                                    label="Description"
                                    variant="outlined"
                                />
                                <div style={{ display: 'block' }}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>

                    <h2>What will you bring to the table?</h2>
                    {displayedTasks.length > 0 ? (
                        displayedTasks.map((task) => (
                            <Card key={task.id} onClick={() => handleTaskCardClick(task)}>
                                <CardContent>
                                    <Typography variant="h6">{task.title}</Typography>
                                    <Typography>{task.description}</Typography>
                                    <Typography>Deadline {new Date(task.deadline.seconds * 1000).toLocaleString()}</Typography>
                                    <Typography>Reward {task.reward}</Typography>
                                    <Typography>By {task.requester}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1">No tasks available</Typography>
                    )}
                </Box>
            </main>

            {isTaskModalOpen && selectedTask && (
                <Modal open={isTaskModalOpen}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">{selectedTask.title}</Typography>
                            <Typography>{selectedTask.description}</Typography>
                            <Typography>Deadline {new Date(selectedTask.deadline.seconds * 1000).toLocaleString()}</Typography>
                            <Typography>Reward {selectedTask.reward}</Typography>
                            <Typography>By {selectedTask.requester}</Typography>
                            {isLoggedIn() && <Button onClick={acceptTask} variant="contained" color="primary">Accept task</Button>}
                            <Button onClick={closeTaskModal} variant="contained">Close</Button>
                        </CardContent>
                    </Card>
                </Modal>
            )}

            <footer>
                <p>&copy; 2023 Tables</p>
            </footer>
        </div>
    );
}

export default App;
