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

    const newRoutine = {
      name: itemName,
      description: description,
      frequencyNumber: frequencyNumber,
      frequencyPeriod: frequencyPeriod,
      lastCompleted: null, // Ensure routines start as incomplete
      previousCompletion: null, // Initialize with no previous completion
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
