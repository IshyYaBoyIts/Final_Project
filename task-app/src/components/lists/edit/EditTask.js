import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, updateTaskInDB } from '../../firebase/firebase-config';
import { AuthContext } from '../../firebase/AuthContext';
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
  const [tags, setTags] = useState([]); // State to store user's tags
  const [selectedTag, setSelectedTag] = useState(''); // State to store the currently selected tag
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
      } else {
        console.log('Task not found');
        navigate('/tasks'); // Adjust as needed
      }
    };

    fetchTask();
  }, [currentUser, taskId, navigate]);

  const handleTranscriptReceived = (transcript) => {
    const processed = processTranscript(transcript);
    setTask({ ...task, ...processed });
    setIsListening(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTaskInDB(currentUser.uid, taskId, task);
    navigate('/tasks'); // Adjust as needed
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  return (
    <div className="form-item">
      <h2>Edit Task</h2>
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
        <button type="submit" className="submit-btn">Save Task</button>
      </form>
      <button onClick={() => setIsListening(!isListening)} className="listen-btn">
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
}

export default TaskEditPage;
