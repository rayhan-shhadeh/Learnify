import React from 'react';
import '../../CSS/loading.css'
import badgeImage from '../../assets/images/medal.gif'
import {useNavigate } from "react-router-dom";

const BadgeComponent = ({courseId ,title, flashcards}) => {
  const navigate = useNavigate();
  const buttonDescription = flashcards?"Finish Practice" : "Back To Files";
  const handleGoToFiles=()=>{
    navigate('/files',{state:{courseId,title}});
  }
  return (

    <div className="loading-container">
      <img src={badgeImage} alt="Loading..." className="loading-image" />
      <div className="loading-container">
      <button onClick={ handleGoToFiles}>
        {buttonDescription}
      </button>
      </div>
    </div>
  );
};
export default BadgeComponent;
