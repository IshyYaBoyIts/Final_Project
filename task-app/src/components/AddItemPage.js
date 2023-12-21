import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.js'; 
import { addTaskToDB, addRoutineToDB } from './firebase-config.js'; 
import './styles/AddItemPage.css'; 

function AddItemPage() {
  const { currentUser } = useContext(AuthContext);
  // console.log("Current user in AddItemPage:", currentUser);
  const navigate = useNavigate();
  const [isAddingTask, setIsAddingTask] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedTag, setSelectedTag] = useState(''); 

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to add tasks or routines.");
      return;
    }
  
    try {
      if (isAddingTask) {
        const newTask = {
          userId: currentUser.uid,
          name: itemName,
          description,
          tag: selectedTag,
          date
        };
        await addTaskToDB(newTask);
      } else {
        const newRoutine = {
          userId: currentUser.uid,
          name: itemName,
          description,
          frequency
        };
        await addRoutineToDB(newRoutine);
      }
      navigate('/');
    } catch (error) {
      console.error("Error adding task/routine:", error);
      alert("Failed to add task/routine. Please try again.");
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
            <select id="tag" name="tag" value={selectedTag} onChange={handleTagChange}>
              <option value="" disabled>Select a tag</option>
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
