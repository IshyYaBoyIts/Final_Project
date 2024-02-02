import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import VoiceRecognition from '../components/VoiceRecognition';
import { addTaskToDB, addRoutineToDB } from '../components/firebase-config';
import './styles/AddItemPage.css';

const AddItemPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAddingTask, setIsAddingTask] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedTag, setSelectedTag] = useState('home'); // Default to 'home' or any value you prefer
  const [isListening, setIsListening] = useState(false);

  const handleTagChange = (e) => setSelectedTag(e.target.value);

  const onTranscriptReceived = (transcript) => {
    console.log('Transcript:', transcript);
    const processingResult = processTranscript(transcript);
    if (processingResult.name) setItemName(processingResult.name);
    if (processingResult.description) setDescription(processingResult.description);
    if (processingResult.date) setDate(processingResult.date);
    if (processingResult.tag) setSelectedTag(processingResult.tag);
    setIsListening(false);
  };

  const processTranscript = (transcript) => {
    // Dummy processing function - replace with your logic
    return { name: transcript, description: 'Processed Description', date: '2022-01-01', tag: 'home' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add tasks or routines.");
      return;
    }

    try {
      const taskOrRoutine = isAddingTask ? {
        name: itemName,
        description,
        tag: selectedTag,
        date,
      } : {
        name: itemName,
        description,
        frequency,
      };

      const addFunction = isAddingTask ? addTaskToDB : addRoutineToDB;
      await addFunction(currentUser.uid, taskOrRoutine);
      navigate('/');
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
          placeholder="Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {isAddingTask && (
          <>
            <select value={selectedTag} onChange={handleTagChange}>
              <option value="">Select a tag</option>
              <option value="home">Home</option>
              <option value="school">School</option>
              <option value="work">Work</option>
              <option value="project">Project</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </>
        )}
        {!isAddingTask && (
          <input
            type="text"
            placeholder="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        )}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
      <button onClick={() => setIsListening(!isListening)} className="listen-btn">
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default AddItemPage;
