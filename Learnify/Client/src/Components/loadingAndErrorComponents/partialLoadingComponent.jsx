import React from 'react';
import '../../CSS/loadingPartial.css'
import loadingImage from '../../assets/images/loading.gif'
const PartialLoadingImageComponent = () => {
  return (
    <div className="loading-container-partial">
      <img src={loadingImage} alt="Loading..." className="loading-image-partial" />
    </div>
  );
};

export default PartialLoadingImageComponent;
