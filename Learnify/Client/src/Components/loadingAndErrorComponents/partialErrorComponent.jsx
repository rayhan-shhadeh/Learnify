import React from 'react';
import '../../CSS/loadingPartial.css'
import errorImage from '../../assets/images/errorPartial.png'
const PartialErrorComponent = () => {
  return (
    <div className="loading-container-partial">
      <img src={errorImage} alt="Loading..." className="loading-image-partial" />
      <div className="loading-container-partial">
      </div>
    </div>
  );
};

export default PartialErrorComponent;
