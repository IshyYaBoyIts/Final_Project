import React, { useContext, useState, useEffect } from 'react';
import { signInWithGoogle, auth, db } from '../firebase/firebase-config';
import { AuthContext } from '../firebase/AuthContext';
import ThemeSelector from '../theme/ThemeSelector';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import './styles/ProfilePage.css';
import { themes } from '../theme/Themes'; // Assuming this path is correct

const ProfilePage = () => {
  // Destructure setTheme from useContext(AuthContext)
  const { currentUser, theme, setTheme } = useContext(AuthContext); // <-- Ensure setTheme is included here
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Assuming 'themes' is an object keyed by theme names, and each theme has color properties
  const themeStyles = themes[theme] || themes['default']; // Fallback to default theme if needed

  useEffect(() => {
    const fetchTags = async () => {
      if (currentUser) {
        const tagsDocRef = doc(db, 'users', currentUser.uid, 'tags', 'taskTags');
        try {
          const docSnap = await getDoc(tagsDocRef);
          if (docSnap.exists()) {
            setTags(docSnap.data().tags || []);
          }
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      }
    };

    fetchTags();
  }, [currentUser]);

  const addTag = async () => {
    if (newTag.trim() !== '' && currentUser) {
      const tagsDocRef = doc(db, 'users', currentUser.uid, 'tags', 'taskTags');
      try {
        await updateDoc(tagsDocRef, {
          tags: arrayUnion(newTag.trim())
        });
        setTags(prevTags => [...prevTags, newTag.trim()]);
        setNewTag('');
      } catch (error) {
        console.error("Error adding new tag:", error);
      }
    }
  };

  // Apply themeStyles directly via inline styles
  return (
    <div className="profile-page" style={{ backgroundColor: themeStyles.tertiary }}>
      {currentUser ? (
        <div className="profile-container" style={{ backgroundColor: themeStyles.quaternary }}>
          <ThemeSelector onThemeChange={setTheme} selectedTheme={theme} />
          <div className="profile-item">
            <h2>Welcome, {currentUser.displayName}</h2>
          </div>
          <div className="profile-item">
            <p>Email: {currentUser.email}</p>
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
