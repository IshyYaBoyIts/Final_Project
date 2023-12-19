import React, { useState } from 'react';

function AddRoutineForm({ onAddRoutine }) {
  const [routine, setRoutine] = useState({
    name: '',
    description: '',
    frequency: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRoutine(routine);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name your routine"
        value={routine.name}
        onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
      />
      <textarea
        placeholder="Add a description"
        value={routine.description}
        onChange={(e) => setRoutine({ ...routine, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Frequency"
        value={routine.frequency}
        onChange={(e) => setRoutine({ ...routine, frequency: e.target.value })}
      />
      <button type="submit">Create Routine</button>
    </form>
  );
}

export default AddRoutineForm;
