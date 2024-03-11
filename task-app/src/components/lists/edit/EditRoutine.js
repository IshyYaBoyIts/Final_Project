import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoutineById, updateRoutineInDB } from '../../firebase/firebase-config';
import { AuthContext } from '../../firebase/AuthContext';
import VoiceRecognition from '../../voiceUtils/VoiceRecognitionTask';
import { processTranscript } from '../../voiceUtils/SpeechProcessing';
import './styles/EditComponent.css'; // Assuming this CSS file contains the styles you've shared

function RoutineEditPage() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [routine, setRoutine] = useState({
    name: '',
    description: '',
    frequencyNumber: 1,
    frequencyPeriod: 'day',
  });
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      alert('Please log in to edit routines.');
      navigate('/login'); // Adjust as needed
      return;
    }
    const fetchRoutine = async () => {
      const fetchedRoutine = await getRoutineById(currentUser.uid, routineId);
      if (fetchedRoutine) {
        setRoutine(fetchedRoutine);
      } else {
        console.log('Routine not found');
        navigate('/'); // Adjust as needed
      }
    };

    fetchRoutine();
  }, [currentUser, routineId, navigate]);

  const handleTranscriptReceived = (transcript) => {
    const processed = processTranscript(transcript);
    setRoutine({ ...routine, ...processed });
    setIsListening(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateRoutineInDB(currentUser.uid, routineId, routine);
    navigate('/routines'); // Adjust as needed
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      [name]: value,
    }));
  };

  return (
    <div className="form-item">
      <h2>Edit Routine</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            value={routine.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={routine.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="frequencyNumber">Frequency Number:</label>
          <input
            id="frequencyNumber"
            name="frequencyNumber"
            type="number"
            className="form-control"
            min="1"
            value={routine.frequencyNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="frequencyPeriod">Frequency Period:</label>
          <select
            id="frequencyPeriod"
            name="frequencyPeriod"
            className="form-control"
            value={routine.frequencyPeriod}
            onChange={handleChange}
          >
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
      <VoiceRecognition
        isListening={isListening}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
        onTranscriptReceived={handleTranscriptReceived}
        className="listen-btn"
      />
    </div>
  );
}

export default RoutineEditPage;
