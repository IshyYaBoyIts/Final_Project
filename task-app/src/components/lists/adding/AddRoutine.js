import React, { useState, useContext } from 'react';
import { AuthContext } from '../../firebase/AuthContext';
import { addRoutineToDB } from '../../firebase/firebase-config';
import './styles/AddComponent.css';

const RoutineComponent = ({ onRoutineAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [frequencyNumber, setFrequencyNumber] = useState(1);
  const [frequencyPeriod, setFrequencyPeriod] = useState('day');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add routines.");
      return;
    }

    // Validate and format the newRoutine object before sending it to Firestore
    const newRoutine = {
      name: itemName.trim(), // Trim whitespace
      description: description.trim(), // Trim whitespace
      frequencyNumber: parseInt(frequencyNumber, 10), // Ensure it's an integer
      frequencyPeriod: frequencyPeriod,
      completionsToday: 0, // Initialize completionsToday
      routineStart: new Date().toISOString(), // ISO string for the start of the current period
    };

    try {
      await addRoutineToDB(currentUser.uid, newRoutine);
      onRoutineAdded();
    } catch (error) {
      console.error("Error adding routine:", error);
      alert("Failed to add routine. Please try again.");
    }
  };

  return (
    <div className="form-item">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Routine Name"
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
        {/* Frequency number input */}
        <div className="form-group">
          <input
            type="number"
            className="form-control"
            placeholder="Frequency Number"
            value={frequencyNumber}
            min="1"
            onChange={(e) => setFrequencyNumber(e.target.value)}
          />
        </div>
        <h3>Times per</h3>
        <div className="form-group">
          <select
            className="form-control"
            value={frequencyPeriod}
            onChange={(e) => setFrequencyPeriod(e.target.value)}
          >
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        <button type="submit" className="btn submit-btn">Add Routine</button>
      </form>
    </div>
  );
};

export default RoutineComponent;