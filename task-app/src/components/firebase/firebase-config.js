import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, addDoc, getDoc,deleteDoc, setDoc, collection, query, getDocs, orderBy, serverTimestamp, increment  } from 'firebase/firestore';
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

// NOTIFICATIONS
export const createNotification = async (userId, notification) => {
  try {
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    await addDoc(notificationsRef, {
      ...notification,
      timestamp: serverTimestamp(),
      readStatus: false
    });
    console.log("Notification created successfully");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Fetch notifications for a specific user
export const getNotifications = async (userId) => {
  const userNotificationsRef = collection(db, `users/${userId}/notifications`);
  const q = query(userNotificationsRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update the read status of a specific notification
export const updateNotificationStatus = async (userId, notificationId, readStatus) => {
  const notificationRef = doc(db, `users/${userId}/notifications`, notificationId);
  await updateDoc(notificationRef, { readStatus });
};
// Update the read status all notifications
export const markNotificationAsReadOrUnread = async (userId, notificationId, shouldBeRead) => {
  try {
    const notificationRef = doc(db, `users/${userId}/notifications`, notificationId);
    await updateDoc(notificationRef, { readStatus: shouldBeRead });
    console.log("Notification read status updated successfully");
  } catch (error) {
    console.error("Error updating notification read status:", error);
  }
};
// Delete all notification
export const deleteNotification = async (userId, notificationId) => {
  const notificationRef = doc(db, `users/${userId}/notifications`, notificationId);
  await deleteDoc(notificationRef); // Ensure deleteDoc is imported
};

// ACHIEVEMENTS

// Function to get user achievements
export const getUserAchievements = async (userId) => {
  const achievementsRef = doc(db, 'users', userId, 'achievements', 'current');
  const docSnap = await getDoc(achievementsRef);
  if (docSnap.exists()) {
      return docSnap.data();
  } else {
      // If no achievements found, create initial achievements
      await setDoc(achievementsRef, { tasksCompleted: 0, routinesCompleted: 0 });
      return { tasksCompleted: 0, routinesCompleted: 0 };
  }
};

// Function to update achievements based on different actions
export const updateAchievements = async (userId, actionType) => {
  const achievementsRef = doc(db, 'users', userId, 'achievements', 'current');
  let updateObject = {};

  switch (actionType) {
    case 'addTask':
      updateObject = { tasksAdded: increment(1) };
      break;
    case 'completeTask':
      updateObject = { tasksCompleted: increment(1) };
      break;
    case 'incompleteTask':
      updateObject = { tasksCompleted: increment(-1) };
      break;
    case 'addRoutine':
      updateObject = { routinesAdded: increment(1) };
      break;
    // ... include cases for other types of achievements as needed ...
    default:
      console.log('Unknown action type for achievements.');
  }

  try {
    if (Object.keys(updateObject).length > 0) {
      await updateDoc(achievementsRef, updateObject);
    }
  } catch (error) {
    console.error('Error updating achievements:', error);
  }
};

// Function to increment tasks completed in achievements
export const incrementTasksCompleted = async (userId) => {
  const achievementsRef = doc(db, 'users', userId, 'achievements', 'current');
  await updateDoc(achievementsRef, {
    tasksCompleted: increment(1)
  });
};

// Function to decrement tasks completed in achievements
export const decrementTasksCompleted = async (userId) => {
  const achievementsRef = doc(db, 'users', userId, 'achievements', 'current');
  await updateDoc(achievementsRef, {
    tasksCompleted: increment(-1) // Use increment with a negative value to decrement
  });
};

// TASK DB FUNCTIONS

export const addTaskToDB = async (userId, newTask) => {
  try {
    const taskWithCompletion = { ...newTask, isComplete: false };
    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), taskWithCompletion);
    console.log("Task added with ID:", docRef.id);
    // Update achievements for adding task
    await updateAchievements(userId, 'addTask');
    // Create a notification for task creation
    await createNotification(userId, {
      message: `New task "${newTask.name}" has been created.`,
    });
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
  const docSnap = await getDoc(taskDocRef);
  
  if (docSnap.exists()) {
    const taskData = docSnap.data(); // This line was missing
    const taskName = taskData.name; // Correctly define taskName from the task's data
    await updateDoc(taskDocRef, { isComplete });

    // If the task is completed, increment the count, otherwise decrement
    if (isComplete) {
      await incrementTasksCompleted(userId);
      await createNotification(userId, {
        message: `Task "${taskName}" completed.`,
      });
    } else {
      // Call decrementTasksCompleted only if the task was previously completed
      if (taskData.isComplete) {
        await decrementTasksCompleted(userId);
      }
      await createNotification(userId, {
        message: `Task "${taskName}" marked as incomplete.`,
      });
    }
  } else {
    console.log("No such task!");
  }
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
  try {
    const checkboxCount = getCheckboxCount(newRoutine);
    const initialCheckboxStates = Array(checkboxCount).fill("unchecked");
    const routineToAdd = {
      ...newRoutine,
      checkboxStates: initialCheckboxStates,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, `users/${userId}/routines`), routineToAdd);
    console.log("Routine added with ID:", docRef.id);
    // Create a notification for routine creation
    await createNotification(userId, {
      message: `New routine "${newRoutine.name}" has been created.`,
    });
  } catch (error) {
    console.error("Error adding routine:", error);
  }
};



export const getRoutinesFromDB = async (userId) => {
  const q = query(collection(db, `users/${userId}/routines`));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateRoutineCheckboxStates = async (userId, routineId, checkboxStates) => {
  const routineRef = doc(db, `users/${userId}/routines`, routineId);
  const docSnap = await getDoc(routineRef);
  if (docSnap.exists()) {
    const routineName = docSnap.data().name; // Assuming the routine object has a name field
    await updateDoc(routineRef, { checkboxStates });
    // Use routine name in the notification message
    await createNotification(userId, {
      message: `Routine "${routineName}" has been updated.`,
    });
  } else {
    console.log("No such routine!");
  }
};


export { db, auth, googleAuthProvider };
