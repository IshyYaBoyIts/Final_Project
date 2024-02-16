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

// LOGIN FUNCTIONS
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

export const getCheckboxCount = (routine) => {
  switch (routine.frequencyPeriod) {
    case 'hour':
      // Assuming frequencyNumber is how many times per hour, to show checkboxes for each occurrence in a day
      return 24 * routine.frequencyNumber;
    case 'day':
      // Show a checkbox for each occurrence in a day
      return routine.frequencyNumber;
    case 'week':
      // For weekly routines, a single checkbox is needed
      return 1;
    case 'month':
      // For monthly routines, a single checkbox is needed
      return 1;
    case 'year':
      // For yearly routines, a single checkbox is needed
      return 1;
    default:
      console.warn(`Unknown frequency period: ${routine.frequencyPeriod}`);
      return 0;
  }
};

export const addRoutineToDB = async (userId, newRoutine) => {
  const checkboxCount = getCheckboxCount(newRoutine); 
  const initialCheckboxStates = Array(checkboxCount).fill("unchecked");

  const routineToAdd = {
    ...newRoutine,
    checkboxStates: initialCheckboxStates,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, `users/${userId}/routines`), routineToAdd);
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

export const updateRoutineCheckboxStates = async (userId, routineId, checkboxStates) => {
  const routineRef = doc(db, `users/${userId}/routines`, routineId);
  await updateDoc(routineRef, { checkboxStates });
};


export { db, auth, googleAuthProvider };
