import React from 'react';
import '../../CSS/loading.css'
import loadingImage from '../../assets/images/loading.gif'
const LoadingImageComponent = () => {
  return (
    <div className="loading-container">
      <img src={loadingImage} alt="Loading..." className="loading-image" />
    </div>
  );
};

export default LoadingImageComponent;
