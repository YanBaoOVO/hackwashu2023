import {
    fetchAllUsers,
    fetchUserByUsername,
    checkUsernameExists,
    addUser,
    fetchAllTasks,
    getTaskByIdFromFirestore,
    addTask,
    updateTaskStatus,
    editTask,
    deleteTask,
} from './dbutils.js'; // Import your Firebase functions

async function testFirestoreFunctions() {
    // Test User-related Functions
    const allUsers = await fetchAllUsers();
    console.log('All Users:', allUsers);

    const usernameToFind = 'User1';
    const foundUser = await fetchUserByUsername(usernameToFind);
    console.log('User by Username:', foundUser);

    const usernameToCheck = 'User1';
    const isUsernameExists = await checkUsernameExists(usernameToCheck);
    console.log(`Username ${usernameToCheck} Exists:`, isUsernameExists);

    const newUserAdded = await addUser('a', 'b');
    console.log('New User Added:', newUserAdded);

    // Test Task-related Functions
    const allTasks = await fetchAllTasks();
    console.log('All Tasks:', allTasks);

    // Add a new task
    const newTaskAdded = await addTask(
        '2023-12-31T23:59:59',
        'New Task Description',
        '2023-10-15T12:00:00',
        'User1',
        'User2',
        '100',
        0,
        'New Task Title'
    );
    console.log('New Task Added:', newTaskAdded);

    if (newTaskAdded) {
        const taskIdToRetrieve = newTaskAdded[1]; // Replace with an actual task ID
        const retrievedTask = await getTaskByIdFromFirestore(taskIdToRetrieve);
        console.log('Retrieved Task by ID:', retrievedTask);


        const taskIdToUpdate = newTaskAdded[1]; // Get the ID of the added task
        const newStatusToUpdate = 1; // Replace with the desired status
        await updateTaskStatus(taskIdToUpdate, newStatusToUpdate);
        console.log('Task Status Updated:', taskIdToUpdate, newStatusToUpdate);

        //FIXME: type error, cannot read prop of undefined 
        const taskIdToEdit = newTaskAdded[1]; // Get the ID of the added task
        const updatedCharacteristics = {
            deadline: '2023-12-31T23:59:59',
            description: 'Updated Task Description',
            post_time: '2023-10-15T12:00:00',
            requester: 'User1',
            responder: 'User2',
            reward: '150',
            status: 2,
            title: 'Updated Task Title',
        };
        const taskEdited = await editTask(taskIdToEdit, updatedCharacteristics);
        console.log('Task Edited:', taskEdited);

        const taskIdToDelete = newTaskAdded[1]; // Get the ID of the added task
        const taskDeleted = await deleteTask(taskIdToDelete);
        console.log('Task Deleted:', taskDeleted);
    }
}

// Execute the test function
testFirestoreFunctions();
