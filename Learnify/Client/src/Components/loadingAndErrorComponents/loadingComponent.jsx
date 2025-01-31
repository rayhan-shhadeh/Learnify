import React from 'react';
import '../../CSS/loading.css'
import loadingImage from '../../assets/images/loading.gif'
const LoadingImageComponent = () => {
  return (
    <div>
    <div className="loading-container">
      <img src={loadingImage} alt="Loading..." className="loading-image" />
    </div>
    </div>
  );
};

export default LoadingImageComponent;
