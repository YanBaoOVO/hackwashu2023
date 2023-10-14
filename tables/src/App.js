import React, { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'; // Import setDoc and doc
import { db } from './firebase';

function App() {
    const [users, setUsers] = useState([]);

    const addUser = async () => {
        try {
            // Use setDoc to add data to the "cities" collection
            await setDoc(doc(db, "users"), {
                username: "User 1",
                password: "password",
            });
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(newData);
    }

    useEffect(() => {
        fetchUsers();
        addUser(); // Call the function to add a city when the component mounts
    }, []);

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <strong>ID:</strong> {user.id}<br />
                        <strong>Username:</strong> {user.username}<br />
                        <strong>Password:</strong> {user.password}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
