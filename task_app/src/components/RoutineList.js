import React from 'react';
import './styles/RoutineList.css';

function RoutineList({ routines }) {
    return (
        <div className="routine-list">
            {routines.map((task, index) => (
                <div key={index} className="routine">
                    {routines.content}
                    {/* Add buttons or actions for each routine */}
                </div>
            ))}
        </div>
    );
}

export default RoutineList;
