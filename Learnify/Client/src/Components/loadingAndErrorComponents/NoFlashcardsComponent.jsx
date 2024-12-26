import React from 'react';
import '../../CSS/loading.css'
import NoFlashcardsImage from '../../assets/images/paper.png'
const NoFlashcardsComponent = () => {
  return (
    <div className="loading-container">
      <img src={NoFlashcardsImage} alt="Loading..." className="loading-image" />
      <div className="loading-container">
      <h2>No Flashcards for review today.</h2>
      </div>
    </div>
  );
};
export default NoFlashcardsComponent;
