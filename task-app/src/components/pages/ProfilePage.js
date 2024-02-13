import React, { useEffect, useState } from 'react';
import { signInWithGoogle, auth, db } from '../firebase/firebase-config';
import ThemeSelector from '../theme/ThemeSelector';
import { themes } from '../theme/Themes';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import './styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setSelectedTheme(docSnap.data().theme);
          }
        } catch (error) {
          console.error("Error accessing user document:", error);
        }

        const tagsDocRef = doc(db, 'users', firebaseUser.uid, 'tags', 'taskTags');
        try {
          const tagsDocSnap = await getDoc(tagsDocRef);
          if (tagsDocSnap.exists()) {
            setTags(tagsDocSnap.data().tags || []);
          }
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      } else {
        setSelectedTheme('default');
        setTags([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const updateTheme = async (newTheme) => {
    if (user && selectedTheme !== newTheme) {
      const userDocRef = doc(db, 'users', user.uid);

      try {
        await updateDoc(userDocRef, { theme: newTheme });
        setSelectedTheme(newTheme);
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    }
  };

  const addTag = async () => {
    if (newTag.trim() !== '' && user) {
      const tagsDocRef = doc(db, 'users', user.uid, 'tags', 'taskTags');
      try {
        // Check if the document exists
        const docSnap = await getDoc(tagsDocRef);
        if (!docSnap.exists()) {
          // If the document does not exist, create it with the new tag
          await setDoc(tagsDocRef, { tags: [newTag.trim()] });
        } else {
          // If the document exists, use arrayUnion to add the new tag
          await updateDoc(tagsDocRef, { tags: arrayUnion(newTag.trim()) });
        }
        // Update local state
        setTags(prevTags => [...prevTags, newTag.trim()]);
        setNewTag(''); // Clear the input field
      } catch (error) {
        console.error("Error adding new tag:", error);
      }
    }
  };

  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-container">
          <ThemeSelector user={user} onThemeChange={updateTheme} selectedTheme={selectedTheme} />
          <div className="profile-item">
            <h2>Welcome, {user.displayName}</h2>
          </div>
          <div className="profile-item">
            <p>Email: {user.email}</p>
          </div>
          <div className="profile-item">
            <h3>Your Tags</h3>
            <select>
              {tags.map((tag, index) => (
                <option key={index} value={tag}>{tag}</option>
              ))}
            </select>
            <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add new tag" />
            <button onClick={addTag}>Add Tag</button>
          </div>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default ProfilePage;
