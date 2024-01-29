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

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechRecognitionSupported = SpeechRecognition !== undefined;

  let recognition;
  if (isSpeechRecognitionSupported) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('Transcript:', transcript);

      if (transcript.toLowerCase().startsWith('name')) {
        setItemName(transcript.substring(5));
      } else if (transcript.toLowerCase().startsWith('description')) {
        setDescription(transcript.substring(13));
      } else if (transcript.toLowerCase().startsWith('date')) {
        setDate(transcript.substring(5));
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
        <input type="text" placeholder={isAddingTask ? "Task name" : "Routine name"} value={itemName} onChange={e => setItemName(e.target.value)} />
        <textarea placeholder="Add a description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
        {isAddingTask ? (
          <>
            <select id="tag" name="tag" value={selectedTag} onChange={handleTagChange}>
              <option value="" disabled>Select a tag</option>
              <option value="home">Home</option>
              <option value="school">School</option>
              <option value="work">Work</option>
              <option value="project">Project</option>
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </>
        ) : (
          <input type="text" placeholder="Frequency" value={frequency} onChange={e => setFrequency(e.target.value)} />
        )}
        <button type="submit" className="create-button">{isAddingTask ? "Create task" : "Create routine"}</button>
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
        <p>Speech recognition not supported</p>
      )}
    </div>
  );
};

export default AddItemPage;
