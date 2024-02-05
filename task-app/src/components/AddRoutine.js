import React, { useState, useContext } from 'react';
import { AuthContext } from './firebase/AuthContext';
import { addRoutineToDB } from './firebase/firebase-config';
import './styles/AddComponent.css';

const RoutineComponent = ({ onRoutineAdded }) => {
  const { currentUser } = useContext(AuthContext);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add routines.");
      return;
    }

    const newRoutine = {
      name: itemName,
      description: description,
      frequency: frequency,
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
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Frequency (e.g., Daily, Weekly)"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>
        <button type="submit" className="btn submit-btn">Add Routine</button>
      </form>
    </div>
  );
};

export default RoutineComponent;
