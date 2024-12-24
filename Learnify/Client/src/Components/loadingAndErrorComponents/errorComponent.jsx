import React from 'react';
import '../../CSS/loading.css'
import errorImage from '../../assets/images/error.png'
const ErrorComponent = () => {
  return (
    <div className="loading-container">
      <img src={errorImage} alt="Loading..." className="loading-image" />
      <div className="loading-container">
      <h2>Oops Something went wrong.. Please Try Agian!</h2>
      </div>
    </div>
  );
};
export default ErrorComponent;
