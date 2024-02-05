import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/firebase/AuthContext';
import { addTaskToDB, addRoutineToDB } from '../components/firebase/firebase-config';
import VoiceRecognition from '../components/voiceUtils/VoiceRecognitionTask';
import { processTranscript } from '../components/voiceUtils/SpeechProcessing';
import { formatDateFromSpeech } from '../components/voiceUtils/DateProcessing';
import './styles/AddItemPage.css';


const AddItemPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAddingTask, setIsAddingTask] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedTag, setSelectedTag] = useState('home'); // Default to 'home' for simplification
  const [isListening, setIsListening] = useState(false);

  const handleTagChange = (e) => setSelectedTag(e.target.value);

  const onTranscriptReceived = (transcript) => {
    console.log('Transcript received:', transcript);
    const processed = processTranscript(transcript);
    console.log('Processed data:', processed);
    setItemName(processed.name);
    setDescription(processed.description);
    setSelectedTag(processed.tag);
    // Use formatDateFromSpeech if necessary or ensure processTranscript handles date formatting
    console.log('Setting date:', processed.date);
    setDate(processed.date);
    setIsListening(false); // Turn off listening once processed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add tasks or routines.");
      return;
    }

    const data = isAddingTask ? {
      name: itemName,
      description: description,
      tag: selectedTag,
      date: date
    } : {
      name: itemName,
      description: description,
      frequency: frequency
    };

    try {
      const addFunc = isAddingTask ? addTaskToDB : addRoutineToDB;
      await addFunc(currentUser.uid, data);
      navigate('/'); // Navigate to home or confirmation page
    } catch (error) {
      console.error("Error adding task/routine:", error);
      alert("Failed to add task/routine. Please try again.");
    }
  };

  return (
    <div className="add-item-container">
      <VoiceRecognition
        isListening={isListening}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
        onTranscript={onTranscriptReceived}
      />
      <div className="tabs">
        <button onClick={() => setIsAddingTask(true)} className={isAddingTask ? 'active' : ''}>Task</button>
        <button onClick={() => setIsAddingTask(false)} className={!isAddingTask ? 'active' : ''}>Routine</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={isAddingTask ? "Task Name" : "Routine Name"}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={selectedTag} onChange={handleTagChange}>
          <option value="">Select a tag</option>
          <option value="home">Home</option>
          <option value="school">School</option>
          <option value="work">Work</option>
          <option value="project">Project</option>
        </select>
        {isAddingTask && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        )}
        {!isAddingTask && (
          <input
            type="text"
            placeholder="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        )}
        <button type="submit" className="submit-btn">{isAddingTask ? "Add Task" : "Add Routine"}</button>
      </form>
      <button onClick={() => setIsListening(!isListening)} className="listen-btn">
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default AddItemPage;
