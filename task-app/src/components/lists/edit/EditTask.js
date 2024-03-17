import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getTaskById, updateTaskInDB } from '../../firebase/firebase-config'; 
import { AuthContext } from '../../firebase/AuthContext';
import { db } from '../../firebase/firebase-config';
import VoiceRecognition from '../../voiceUtils/VoiceRecognitionTask'; 
import { processTranscript } from '../../voiceUtils/SpeechProcessing'; 
import './styles/EditComponent.css';

function TaskEditPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [task, setTask] = useState({
    name: '',
    description: '',
    date: '',
    tag: '',
    isComplete: false,
  });
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      alert('Please log in to edit tasks.');
      navigate('/login');
      return;
    }

    const fetchTask = async () => {
      const taskData = await getTaskById(currentUser.uid, taskId);
      if (taskData) {
        setTask(taskData);
        setSelectedTag(taskData.tag);
      } else {
        console.log('Task not found');
        navigate('/tasks');
      }
    };

    const fetchTags = async () => {
      const tagsDocRef = doc(db, 'users', currentUser.uid, 'tags', 'taskTags');
      const docSnap = await getDoc(tagsDocRef);
      if (docSnap.exists() && docSnap.data().tags) {
        setTags(docSnap.data().tags);
        if (!selectedTag && docSnap.data().tags.length > 0) {
          setSelectedTag(docSnap.data().tags[0]);
        }
      } else {
        console.error("Tags not found");
        setTags([]);
      }
    };

    fetchTask();
    fetchTags();
  }, [currentUser, taskId,selectedTag, navigate]);

  const handleTranscriptReceived = (transcript) => {
    const processed = processTranscript(transcript);
    setTask({ ...task, ...processed });
    if (processed.tag) {
      setSelectedTag(processed.tag);
    }
    setIsListening(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTaskInDB(currentUser.uid, taskId, { ...task, tag: selectedTag });
    navigate('/tasks');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  return (
    <div className="form-item">
      <h2>Edit Task</h2>
      <VoiceRecognition
        isListening={isListening}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
        onTranscriptReceived={handleTranscriptReceived}
      />
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Task Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            value={task.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={task.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Due Date:</label>
          <input
            id="date"
            name="date"
            type="date"
            className="form-control"
            value={task.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tag">Tag:</label>
          <select
            id="tag"
            name="tag"
            className="form-control"
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
          >
            {tags.map((tag, index) => (
              <option key={index} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn">Save Task</button>
      </form>
      <button onClick={() => setIsListening(!isListening)} className="listen-btn">
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
}

export default TaskEditPage;
