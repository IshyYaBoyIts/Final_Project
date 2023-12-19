import React from 'react';
import './styles/TaskList.css';

function TaskList({ tasks }) {
    return (
        <div className="task-list">
            {tasks.map((task, index) => (
                <div key={index} className="task">
                    {task.content}
                    {/* Add buttons or actions for each task */}
                </div>
            ))}
        </div>
    );
}

export default TaskList;
