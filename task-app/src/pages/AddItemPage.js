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
    recognition.continuous = false; // Set to false to not keep listening after capturing the input

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Transcript:', transcript);

      // Split transcript into words to better handle different parts
      const words = transcript.split(' ');
      
      // Parse for 'name', 'description', 'tag', and attempt to parse 'date'
      let tempName = '', tempDescription = '', tempTag = '', tempDate = '';

      let currentIndex = 0;
      words.forEach((word, index) => {
        if (word.includes('name')) {
          currentIndex = index + 1;
          while (currentIndex < words.length && !['description', 'tag', 'date'].includes(words[currentIndex])) {
            tempName += words[currentIndex] + ' ';
            currentIndex++;
          }
        } else if (word.includes('description')) {
          currentIndex = index + 1;
          while (currentIndex < words.length && !['name', 'tag', 'date'].includes(words[currentIndex])) {
            tempDescription += words[currentIndex] + ' ';
            currentIndex++;
          }
        } else if (word.includes('tag')) {
          currentIndex = index + 1;
          if (currentIndex < words.length) tempTag = words[currentIndex];
        } else if (word.includes('date')) {
          currentIndex = index + 1;
          while (currentIndex < words.length && !['name', 'description', 'tag'].includes(words[currentIndex])) {
            tempDate += words[currentIndex] + ' ';
            currentIndex++;
          }
        }
      });

      setItemName(tempName.trim());
      setDescription(tempDescription.trim());
      setSelectedTag(tempTag.trim());
      // Handle date conversion here
      setDate(parseDateFromTranscript(tempDate.trim()));

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

  const parseDateFromTranscript = (transcriptDate) => {
    // You can enhance this function to convert spoken dates to your desired format
    // This is a basic example and might need adjustments based on your requirements
    return transcriptDate; // Return as is for now
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add tasks or routines.");
      return;
    }

    // Submission logic remains the same
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
        <p>Speech recognition not supported, try using Google Chrome</p>
      )}
    </div>
  );
};

export default AddItemPage;
