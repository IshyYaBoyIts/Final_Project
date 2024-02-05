// TaskComponent.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './firebase/AuthContext';
import { addTaskToDB } from './firebase/firebase-config';
import VoiceRecognition from './voiceUtils/VoiceRecognitionTask';
import { processTranscript } from './voiceUtils/SpeechProcessing';
import './styles/AddComponent.css';

const TaskComponent = ({ onTaskAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedTag, setSelectedTag] = useState('home');
  const [isListening, setIsListening] = useState(false);

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
          <select className="form-control" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
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
