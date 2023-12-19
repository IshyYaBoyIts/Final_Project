import React, { useState } from 'react';
import './styles/AddItemPage.css'; 

function AddItemPage({ setTasks, setRoutines }) {
  const [isAddingTask, setIsAddingTask] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddingTask) {
      setTasks(prevTasks => [...prevTasks, { name: itemName, description, tag, date }]);
    } else {
      setRoutines(prevRoutines => [...prevRoutines, { name: itemName, description, frequency }]);
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
            <select id="tag" name="tag">
              <option value="" disabled selected>Select a tag</option>
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
        <div className="actions">
          {/* Icons or buttons for actions like voice input, etc. */}
        </div>
        <button type="submit" className="create-button">{isAddingTask ? "Create task" : "Create routine"}</button>
      </form>
    </div>
  );
}

export default AddItemPage;
