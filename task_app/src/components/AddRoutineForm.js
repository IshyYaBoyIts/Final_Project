import React, { useState } from 'react';

function AddRoutineForm({ onAddRoutine }) {
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [routineTag, setRoutineTag] = useState('');
  const [routineFrequency, setRoutineFrequency] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a routine object
    const newRoutine = {
      name: routineName,
      description: routineDescription,
      tag: routineTag,
      frequency: routineFrequency
    };
    // Call the onAddRoutine function passed from the parent component
    onAddRoutine(newRoutine);
    // Reset the form
    setRoutineName('');
    setRoutineDescription('');
    setRoutineTag('');
    setRoutineFrequency('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Routine Name"
        value={routineName}
        onChange={(e) => setRoutineName(e.target.value)}
      />
      <textarea
        placeholder="Routine Description"
        value={routineDescription}
        onChange={(e) => setRoutineDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tag"
        value={routineTag}
        onChange={(e) => setRoutineTag(e.target.value)}
      />
      <input
        type="text"
        placeholder="Frequency"
        value={routineFrequency}
        onChange={(e) => setRoutineFrequency(e.target.value)}
      />
      <button type="submit">Add Routine</button>
    </form>
  );
}

export default AddRoutineForm;
