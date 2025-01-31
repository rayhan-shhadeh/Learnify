import React from "react";
import Quiz from "../Components/fileComponents/fileQuiz.jsx";
import "../CSS/fileQuiz.css"
import Header1 from '../Components/HomePageComponents/Header1'

const QuizPage = () => {
    return (
      <div>
        <Header1></Header1>
        <Quiz></Quiz>
      </div>
    );
  };
  
export default QuizPage;
