import { db } from './firebase-config'; 
import { doc, updateDoc } from 'firebase/firestore';

// Function to update the user's theme in Firestore
export const updateThemeInFirestore = async (userId, newTheme) => {
  try {
    const userDocRef = doc(db, 'users', userId); 

    // Update the 'theme' field in the user's document
    await updateDoc(userDocRef, {
      theme: newTheme,
    });

    return Promise.resolve(); // Resolve the promise if the update is successful
  } catch (error) {
    console.error('Error updating user theme in Firestore:', error);
    return Promise.reject(error); // Reject the promise if there's an error
  }
};
