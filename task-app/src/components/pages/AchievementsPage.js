import React, { useEffect, useState, useContext } from 'react';
import { getUserAchievements } from '../firebase/firebase-config'; // Adjust the path as necessary
import { AuthContext } from '../firebase/AuthContext'; // Adjust the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import './styles/AchievementsPage.css'; // Assuming you have created a CSS file for styling

const AchievementsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [achievements, setAchievements] = useState({ tasksCompleted: 0, routinesCompleted: 0 }); // Initialize with default values

  useEffect(() => {
    if (currentUser) {
      getUserAchievements(currentUser.uid).then((data) => {
        // Assuming getUserAchievements might return null if no data found
        if (data) {
          setAchievements(data);
        }
      });
    }
  }, [currentUser]);

  const getTrophyColor = (count) => {
    if (count >= 15) return 'gold';
    if (count >= 10) return 'silver';
    if (count >= 5) return 'bronze';
    return 'grey';
  };
  const achievementsOrder = [
    { key: 'tasksAdded', label: 'Tasks Added' },
    { key: 'tasksCompleted', label: 'Tasks Completed' },
    { key: 'routinesAdded', label: 'Routines Added' },
    { key: 'routinesCompleted', label: 'Routines Completed' },
  ];
  

  return (
    <div className="achievements-page">
      <h2>Achievements</h2>
      <div className="achievement-container">
        {achievementsOrder.map((achievement) => (
            <div key={achievement.key} className="achievement">
            <div className="achievement-title">
                {achievement.label}: {achievements[achievement.key] || 0}
            </div>
            <FontAwesomeIcon icon={faTrophy} color={getTrophyColor(achievements[achievement.key])} size="3x" />
            </div>
        ))}
        </div>
    </div>
  );
};

export default AchievementsPage;
