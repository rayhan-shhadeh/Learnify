import React from 'react';
import { Link } from 'react-router-dom';
import classes from '../CSS/Home.module.css';


const chosenName = ' RayhanShhadeh';
function Home(props) {
  return (
    <div className={classes.home}>
      <h1 className={classes.homesubheader}>Welcome to the App</h1>
      <div>
      <p>{chosenName}</p>
      <p>{props.author}</p>
      <p>{props.body}</p>
      <Link to="/login">
          <button className={classes.homebutton}>Go to Login</button>
        </Link>
      </div>
      <div>
        <Link to="/signup">
          <button>Go to Signup</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;