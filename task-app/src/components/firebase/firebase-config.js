import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // Added doc and updateDoc
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

export const addTaskToDB = async (userId, newTask) => {
  try {
    const taskWithCompletion = { ...newTask, isComplete: false }; // Add isComplete flag
    // Assuming tasks are under a 'users' collection, then a subcollection 'tasks' for each user
    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), taskWithCompletion);
    console.log("Task added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const addRoutineToDB = async (userId, newRoutine) => {
  try {
    // Assuming routines are under a 'users' collection, then a subcollection 'routines' for each user
    const docRef = await addDoc(collection(db, `users/${userId}/routines`), newRoutine);
    console.log("Routine added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding routine:", error);
  }
};

export const getTasksFromDB = async (userId) => {
  const q = query(collection(db, `users/${userId}/tasks`));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRoutinesFromDB = async (userId) => {
  const q = query(collection(db, `users/${userId}/routines`));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTaskStatusInDB = async (userId, taskId, isComplete) => {
  const taskDocRef = doc(db, `users/${userId}/tasks`, taskId);
  await updateDoc(taskDocRef, {
    isComplete: isComplete
  });
};

// Export Firebase instances
export { db, auth, googleAuthProvider };
