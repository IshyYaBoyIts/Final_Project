import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AddItemPage.css'; // Make sure you have this CSS file

function AddItemPage({ setTasks, setRoutines }) {
  const [isAddingTask, setIsAddingTask] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState(''); // Only for tasks
  const [dueDate, setDueDate] = useState(''); // Only for tasks
  const [frequency, setFrequency] = useState(''); // Only for routines
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      name,
      description,
      ...(isAddingTask ? { tag, dueDate } : { frequency }),
    };

    if (isAddingTask) {
      setTasks(prevTasks => [...prevTasks, item]);
    } else {
      setRoutines(prevRoutines => [...prevRoutines, item]);
    }
    navigate('/');
  };

  return (
    <div className="add-item-container">
      <div className="tabs">
        <button className={isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(true)}>TASK</button>
        <button className={!isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(false)}>ROUTINE</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        {isAddingTask ? (
          <>
            <input type="text" placeholder="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </>
        ) : (
          <input type="text" placeholder="Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
        )}
        <button type="submit" className="create-button">{isAddingTask ? "Create Task" : "Create Routine"}</button>
      </form>
    </div>
  );
}

export default AddItemPage;
