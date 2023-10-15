import { query, where, collection, getDocs, getDoc, setDoc, doc, Timestamp, updateDoc, deleteDoc, addDoc } from 'firebase/firestore'; // Import setDoc and doc
import { db } from './firebase.js';

// get all users
async function fetchAllUsers(){
    const querySnapshot = await getDocs(collection(db, "users"));
    const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return newData;
}

// get one user 
async function fetchUserByUsername (username) {
    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('username', '==', username));

    const querySnapshot = await getDocs(userQuery);

    // returns false if there is no such user 
    if (querySnapshot.size === 0) {
        return false;
    } else {
        // Retrieve the first user (assuming usernames are unique)
        const userData = querySnapshot.docs[0].data();
        return userData;
    }
}

// check if there is already a username
async function checkUsernameExists(username) {
    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('username', '==', username));
    const querySnapshot = await getDocs(userQuery);

    return querySnapshot.size; // Returns true if a user with the provided username exists, false otherwise
}

// create a user
async function addUser(username, password) {
    const usersCollection = collection(db, 'users');

    // Create a new user document with the provided username and password
    const userDocument = {
        username: username,
        password: password,
    };

    try {
        const dcref = doc(usersCollection);
        const ref = await setDoc(dcref, userDocument);
        console.log('User added to Firestore successfully.');
        return [true, dcref.id];
    } catch (error) {
        console.error('Error adding user to Firestore:', error);
        return false;
    }
}

// delete a user 
//WARN: untested 
async function deleteUser(userId) {
    const usersCollection = collection(db, 'users');

    try {
        const userDocRef = doc(usersCollection, userId);
        await deleteDoc(userDocRef);
        console.log(`User with ID ${userId} deleted from Firestore.`);
        return true;
    } catch (error) {
        console.error(`Error deleting user with ID ${userId} from Firestore:`, error);
        return false;
    }
}

// get all tasks
async function fetchAllTasks() {
    const tasksCollection = collection(db, 'tasks');

    try {
        const querySnapshot = await getDocs(tasksCollection);
        const tasks = [];

        // debug

        querySnapshot.forEach((doc) => {
            // Retrieve each task document's data and add it to the tasks array
            tasks.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        console.log(tasks);

        return tasks;
    } catch (error) {
        console.error('Error retrieving tasks from Firestore:', error);
        return false; // Return an empty array in case of an error
    }
}

// fetch a specific task with id
async function getTaskByIdFromFirestore(taskId) {
    const tasksCollection = collection(db, 'tasks');
    const taskDocRef = doc(tasksCollection, taskId);

    try {
        const taskSnapshot = await getDoc(taskDocRef);

        if (taskSnapshot.exists()) {
            const taskData = taskSnapshot.data();
            return {
                id: taskSnapshot.id,
                ...taskData,
            };
        } else {
            console.log(`Task with ID ${taskId} not found.`);
            return false;
        }
    } catch (error) {
        console.error(`Error retrieving task with ID ${taskId} from Firestore:`, error);
        return false;
    }
}

// add a new task
async function addTask(deadline, desc, post_time, requester, responder, reward, status = 0, title) {
    const tasksCollection = collection(db, 'tasks');

    // Convert the date strings to Firestore Timestamps
    const deadlineTimestamp = Timestamp.fromDate(new Date(deadline));
    const postTimeTimestamp = Timestamp.fromDate(new Date(post_time));

    // Create a new task document
    const taskDocument = {
        deadline: deadlineTimestamp,
        description: desc,
        post_time: postTimeTimestamp,
        requester: requester,
        responder: responder,
        reward: reward,
        status: status,
        title: title,
    };

    try {
        // this returns an array, the first one is the return status, the second one is the id of the task just
        // being added 
        const ref = doc(tasksCollection);
        const d = await setDoc(ref, taskDocument);
        console.log('Task added to Firestore successfully.');
        return [true, ref.id];
    } catch (error) {
        console.error('Error adding task to Firestore:', error);
        return false;
    }
}

// update a task - set a different status
// about status: 0 is task is created, 1 is task is being done, 2 task is already done. Note that status is a number. 
async function updateTaskStatus(taskId, status) {
    const tasksCollection = collection(db, 'tasks');
    const taskDocRef = doc(tasksCollection, taskId);

    try {
        const d = await updateDoc(taskDocRef, {
            status: status,
        });

        console.log(`Task status for ID ${taskId} updated to ${status} in Firestore.`);
        return [true, taskId];
    } catch (error) {
        console.error(`Error updating task status for ID ${taskId} in Firestore:`, error);
    }
}

// edit a task - edit a task 
//FIXME: type error, cannot read prop of undefined 
async function editTask(taskId, { deadline, description, post_time, requester, responder, reward, status, title }) {
    const tasksCollection = collection(db, 'tasks');
    const taskDocRef = doc(tasksCollection, taskId);

    const updatedCharacteristics = {
        deadline,
        description,
        post_time,
        requester,
        responder,
        reward,
        status,
        title,
    };

    try {
        const d = await updateDoc(taskDocRef, updatedCharacteristics);
        console.log(`Task with ID ${taskId} updated in Firestore.`);
        return [true, d.id];
    } catch (error) {
        console.error(`Error updating task with ID ${taskId} in Firestore:`, error);
        return false;
    }
}

// delete a task
async function deleteTask(taskId) {
    const tasksCollection = collection(db, 'tasks');
    const taskDocRef = doc(tasksCollection, taskId);

    try {
        await deleteDoc(taskDocRef);
        console.log(`Task with ID ${taskId} deleted from Firestore.`);
        return true;
    } catch (error) {
        console.error(`Error deleting task with ID ${taskId} from Firestore:`, error);
        return false;
    }
}

export {
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
};