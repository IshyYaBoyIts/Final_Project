import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../firebase/AuthContext';
import { addTaskToDB } from '../firebase/firebase-config';
import VoiceRecognition from '../voiceUtils/VoiceRecognitionTask';
import { processTranscript } from '../voiceUtils/SpeechProcessing';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config'; // Make sure this path matches your file structure
import './styles/AddComponent.css';

const TaskComponent = ({ onTaskAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState([]); // State to store user's tags
  const [selectedTag, setSelectedTag] = useState(''); // State to store the currently selected tag
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      if (currentUser) {
        const tagsDocRef = doc(db, 'users', currentUser.uid, 'tags', 'taskTags');
        try {
          const docSnap = await getDoc(tagsDocRef);
          if (docSnap.exists() && docSnap.data().tags) {
            setTags(docSnap.data().tags);
            setSelectedTag(docSnap.data().tags[0]); // Default to the first tag if available
          } else {
            setTags([]);
          }
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      }
    };

    fetchTags();
  }, [currentUser]);

  const onTranscriptReceived = (transcript) => {
    const processed = processTranscript(transcript);
    setItemName(processed.name);
    setDescription(processed.description);
    setSelectedTag(processed.tag);
    setDate(processed.date);
    setIsListening(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add tasks.");
      return;
    }

    const newTask = {
      name: itemName,
      description: description,
      tag: selectedTag,
      date: date,
      isComplete: false,
    };

    try {
      await addTaskToDB(currentUser.uid, newTask);
      onTaskAdded();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="form-item">
      <VoiceRecognition
        isListening={isListening}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
        onTranscript={onTranscriptReceived}
      />
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Task Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select
            className="form-control"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))
            ) : (
              <option value="">No tags available</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn submit-btn">Add Task</button>
      </form>
      <button onClick={() => setIsListening(!isListening)} className="btn listen-btn">
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default TaskComponent;
