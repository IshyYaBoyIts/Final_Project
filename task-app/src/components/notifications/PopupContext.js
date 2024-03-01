import React, { createContext, useContext, useState } from 'react';
import './styles/Notifications.css';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => setPopupVisible(true);
  const hidePopup = () => setPopupVisible(false);

  return (
    <PopupContext.Provider value={{ isPopupVisible, showPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
