import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb15mnrCs8SIKfyHmUtfFbEeMi75zRpMQ",
  authDomain: "task-app-14e6d.firebaseapp.com",
  projectId: "task-app-14e6d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

// Functions
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleAuthProvider);
};

export const logout = () => {
  return signOut(auth);
};

export const addTaskToDB = async (newTask) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), newTask);
    console.log("Task added with ID:", docRef.id); // Log the document ID of the added task
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Failed to add task. Please try again.");
  }
};


export const addRoutineToDB = async (newRoutine) => {
  try {
    const docRef = await addDoc(collection(db, "routines"), newRoutine);
    console.log("Routine added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding routine:", error);
  }
};

export const getTasksFromDB = async (userId) => {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRoutinesFromDB = async (userId) => {
  const q = query(collection(db, "routines"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Export Firebase instances
export { db, auth, googleAuthProvider };
