import React, { useContext, useState, useEffect } from 'react';
import { signInWithGoogle, auth, db } from '../firebase/firebase-config';
import { AuthContext } from '../firebase/AuthContext';
import ThemeSelector from '../theme/ThemeSelector';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import './styles/ProfilePage.css';

const ProfilePage = () => {
    const { currentUser, theme, setTheme } = useContext(AuthContext); 
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        // This useEffect is for fetching tags specifically, theme is managed globally
        const fetchTags = async () => {
            if (currentUser) {
                const tagsDocRef = doc(db, 'users', currentUser.uid, 'tags', 'taskTags');
                try {
                    const docSnap = await getDoc(tagsDocRef);
                    if (docSnap.exists()) {
                        setTags(docSnap.data().tags || []);
                    } else {
                        // Handle the case where the document does not exist (e.g., no tags yet)
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

    return (
        <div className="profile-page">
            {currentUser ? (
                <div className="profile-container">
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
