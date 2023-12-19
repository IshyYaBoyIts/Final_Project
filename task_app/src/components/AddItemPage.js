import React, { useState } from 'react';
import Tabs from './Tabs';
import AddTaskForm from './AddTaskForm';
import AddRoutineForm from './AddRoutineForm';

function AddItemPage() {
  const [currentForm, setCurrentForm] = useState('task'); // 'task' or 'routine'

  return (
    <div>
      <Tabs currentView={currentForm} onChangeView={setCurrentForm} />
      {currentForm === 'task' && (
        <AddTaskForm />
        // Include the form fields for Name, Description, Tag, Due Date
      )}
      {currentForm === 'routine' && (
        <AddRoutineForm />
        // Include the form fields for Name, Description, Tag, Frequency
      )}
    </div>
  );
}

export default AddItemPage;
