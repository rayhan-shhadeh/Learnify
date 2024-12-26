import React from 'react';
import '../../CSS/loading.css'
import badgeImage from '../../assets/images/medal.gif'
import {useNavigate } from "react-router-dom";

const BadgeComponent = ({courseId ,title}) => {
  const navigate = useNavigate();
  const handleGoToFiles=()=>{
    navigate('/files',{state:{courseId,title}});
  }
  return (
    <div className="loading-container">
      <img src={badgeImage} alt="Loading..." className="loading-image" />
      <div className="loading-container">
      <button onClick={ handleGoToFiles}>Finish Practice</button>
      </div>
    </div>
  );
};
export default BadgeComponent;
