import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext.js';
import { addTaskToDB, addRoutineToDB } from '../components/firebase-config.js';
import './styles/AddItemPage.css';

const AddItemPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAddingTask, setIsAddingTask] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleTagChange = (e) => setSelectedTag(e.target.value);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechRecognitionSupported = !!SpeechRecognition;

  let recognition;
  if (isSpeechRecognitionSupported) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Transcript:', transcript);

      const words = transcript.split(' ');
      if (words.includes('name')) {
        setItemName(transcript.split('name ')[1].split(' description')[0]);
      }
      if (words.includes('description')) {
        setDescription(transcript.split('description ')[1].split(' tag')[0]);
      }
      if (words.includes('tag')) {
        setSelectedTag(transcript.split('tag ')[1].split(' date')[0]);
      }
      if (words.includes('date')) {
        const dateText = transcript.split('date ')[1];
        setDate(parseDateFromSpeech(dateText));
      }

      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  }

  const startRecognition = () => {
    if (isSpeechRecognitionSupported && recognition) {
      recognition.start();
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const parseDateFromSpeech = (transcriptDate) => {
    // Assuming transcriptDate is in the format "dd mm yyyy" or "dd mm yy"
    let parts = transcriptDate.split(' ');
  
    // Basic validation to ensure we have at least day and month
    if (parts.length < 2) return '';
  
    let day = parts[0];
    let month = parts[1];
    let year = parts.length === 3 ? parts[2] : new Date().getFullYear().toString().substr(-2); // Default to current year if year is not specified
  
    // Pad single digit day and month with zero
    day = day.padStart(2, '0');
    month = month.padStart(2, '0');
  
    // Handle two-digit year format by determining century
    if (year.length === 2) {
      let currentYear = new Date().getFullYear();
      let currentCentury = Math.floor(currentYear / 100) * 100;
      year = currentCentury + parseInt(year, 10);
    }
  
    // Return date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  };
  
  // Example usage:
  console.log(parseDateFromSpeech("21 04 2023")); // "2023-04-21"
  console.log(parseDateFromSpeech("5 12 22")); // Assuming current year is 2023, "2022-12-05"
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add tasks or routines.");
      return;
    }

    try {
      if (isAddingTask) {
        const newTask = {
          userId: currentUser.uid,
          name: itemName,
          description,
          tag: selectedTag,
          date
        };
        await addTaskToDB(newTask);
      } else {
        const newRoutine = {
          userId: currentUser.uid,
          name: itemName,
          description,
          frequency
        };
        await addRoutineToDB(newRoutine);
      }
      navigate('/');
    } catch (error) {
      console.error("Error adding task/routine:", error);
      alert("Failed to add task/routine. Please try again.");
    }
  };

  return (
    <div className="add-item-container">
      <div className="tabs">
        <button className={isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(true)}>TASK</button>
        <button className={!isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(false)}>ROUTINE</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Task name or Routine name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        {isAddingTask && (
          <select value={selectedTag} onChange={handleTagChange}>
            <option value="" disabled>Select a tag</option>
            <option value="home">Home</option>
            <option value="school">School</option>
            <option value="work">Work</option>
            <option value="project">Project</option>
          </select>
        )}
        {isAddingTask ? <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> : <input type="text" placeholder="Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} />}
        <button type="submit" className="create-button">{isAddingTask ? "Add Task" : "Add Routine"}</button>
      </form>
      {isSpeechRecognitionSupported ? (
        <>
          <button onClick={startRecognition} disabled={isListening}>
            {isListening ? "Listening..." : "Start Voice Input"}
          </button>
          {isListening && (
            <button onClick={stopRecognition}>
              Stop
            </button>
          )}
        </>
      ) : (
        <p>Speech recognition not supported, try using Google Chrome</p>
      )}
    </div>
  );
};

export default AddItemPage;
