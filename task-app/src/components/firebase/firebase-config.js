import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, addDoc, collection, query, getDocs } from 'firebase/firestore';
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

// TASK DB FUNCTIONS

export const addTaskToDB = async (userId, newTask) => {
  try {
    const taskWithCompletion = { ...newTask, isComplete: false };
    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), taskWithCompletion);
    console.log("Task added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const getTasksFromDB = async (userId) => {
  const q = query(collection(db, `users/${userId}/tasks`));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTaskStatusInDB = async (userId, taskId, isComplete) => {
  const taskDocRef = doc(db, `users/${userId}/tasks`, taskId);
  await updateDoc(taskDocRef, { isComplete });
};

// ROUTINE DB FUNCITONS

export const addRoutineToDB = async (userId, newRoutine) => {
  const createdAt = new Date(); 
  const checkboxCount = getCheckboxCount(newRoutine); // Function to calculate checkbox count based on routine
  const checkboxes = new Array(checkboxCount).fill("unchecked"); 

  const validatedRoutine = {
    ...newRoutine,
    createdAt: createdAt.toISOString(), 
    checkboxStates: checkboxes, 
  };

  try {
    const docRef = await addDoc(collection(db, `users/${userId}/routines`), validatedRoutine);
    console.log("Routine added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding routine:", error);
    throw new Error("Failed to add the routine to the database.");
  }
};


export const getRoutinesFromDB = async (userId) => {
  const q = query(collection(db, `users/${userId}/routines`));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateRoutineCheckboxStates = async (userId, routineId, checkboxIndex, isChecked) => {
  const routineRef = doc(db, `users/${userId}/routines`, routineId);
  const docSnap = await getDoc(routineRef);
  if (docSnap.exists()) {
    const routine = docSnap.data();
    routine.checkboxStates[checkboxIndex] = isChecked ? "checked" : "unchecked"; 
    await updateDoc(routineRef, { checkboxStates: routine.checkboxStates });
  }
};


export { db, auth, googleAuthProvider };
