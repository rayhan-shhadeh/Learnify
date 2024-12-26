import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizImage from '../../assets/images/quiz-icon.png';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import TuneIcon from '@mui/icons-material/Tune';
import { useLocation,useNavigate } from "react-router-dom";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LoadingImageComponent from '../loadingAndErrorComponents/loadingComponent'
import '../../CSS/fileQuiz.css';
import ErrorComponent from '../loadingAndErrorComponents/errorComponent';

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [popupVisible, setPopupVisible] = useState(true);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizId,setQuizId] = useState();
  const [review,setReview]=useState();
  const [score,setScore] = useState();
  const location = useLocation();
  const { fileId,courseId ,title} = location.state;
  const [error,setError] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    if (!popupVisible) {
      generateQuiz();
    }
  }, [popupVisible]);
  
  const getId=async()=>{
    let id = await axios.get('http://localhost:8080/api/maxQuizId');
    id = id.data.maxQuizId+1;
    console.log(id);
    setQuizId(id);
    return;
  }

  const generateQuiz = async () => {
    try {
      await getId();
      let response = await axios.post(`http://localhost:8080/api/file/generateQuiz/${fileId}`, {
        numQuestions,
        difficulty,
      });      
      const Quiz = {
        title: response.data.title,
        description: response.data.description,
        questions: response.data.questions.map((q) => ({
          question: q.questionText,
          questionId : q.questionId,
          choices: q.choices.map((choice, index) => ({
            text: choice,
            isCorrect: String.fromCharCode(65 + index) === q.correctAnswer,
          })),
        })),
      };
      setQuiz(Quiz);
    } catch (error) {
      setError(true);
      handeleError();
      console.error('Error generating quiz:', error);
    }
  };

  const handleChoiceClick = async (choice,id) => {
    try {
      console.log (id);
      await axios.post('http://localhost:8080/api/answer', {
        chosenAnswer: choice.text,
        isCorrect: choice.isCorrect, 
        question:{
          connect: {
            questionId : id
          }
        }
      });
      // Update the selected answer in the quiz state
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions[currentQuestionIndex].selectedAnswer = choice.text;
      setQuiz(updatedQuiz);
    } catch (error) {
      console.error('Error storing answer:', error);
    }
    setSelectedChoice(choice);
  };

  const handleContinue=()=>{
    setTimeout(() => {
      if(selectedChoice){
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
      setSelectedChoice(null);
    }, 1000);
  };

  const handlePopupSubmit = () => {
    setPopupVisible(false);
  };

  const handleScore =()=>{
  const calculatedScore = quiz.questions.reduce((acc, question) => {
    const userAnswer = question.selectedAnswer;
    const correctChoice = question.choices.find((choice) => choice.isCorrect);
    if (userAnswer === correctChoice.text) {
      return acc + 1;
    }
    return acc;
  }, 0);
  setScore(calculatedScore);
  }

  const handleFinishReview=()=>{
    navigate(`/files`, { state: { courseId,title} });
  }

  if(error){
    return (<ErrorComponent/> );
  }
 
  if (popupVisible) {
    return (
      <div>
      <div className="popup-header-banner">
        <h1 className="banner-title">
          <span className="highlight">Now</span>, unleash your potential and challenge your mind!
        </h1>
      </div>
      <div className="popup">
        <div className="popup-header">
          <img src={QuizImage}></img>
        </div>
        <div className="popup-body">
          <label>
            <QuestionMarkIcon/>
            Number of Questions:
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min="1"
            />
          </label>
          <label>
          <TuneIcon />
            Difficulty:
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>
        <div className="popup-footer">
          <button className="start-button" onClick={handlePopupSubmit}>Start Quiz</button>
        </div>
      </div>
      </div>
    );
  }

  if (!quiz) return (<LoadingImageComponent/> );
  const currentQuestion = quiz.questions[currentQuestionIndex];

  if(review  ){
    return (
      <div className="review-page">
        <h1> <NoteAltIcon style={{color:"#3785De",fontSize:"40px"}}></NoteAltIcon> Your Score : {score}/{numQuestions}</h1>
        <ul className="review-list">
          {quiz.questions.map((q, index) => (
            <li key={index} className="review-item">
              <h3>
                {index + 1}. {q.question}
              </h3>
              <ul className="choices-review">
                {q.choices.map((choice, i) => (
                  <li
                    key={i}
                    className={`review-choice ${
                      choice.isCorrect
                        ? 'correct-choice'
                        : q.selectedAnswer === choice.text
                        ? 'wrong-choice'
                        : ''
                    }`}
                  >
                    <span className="choice-label">{String.fromCharCode(65 + i)}</span> {choice.text}
                    {choice.isCorrect && <span> (Correct)</span>}
                    {q.selectedAnswer === choice.text && !choice.isCorrect && <span> (Your Answer)</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <button className='continue-button' onClick={handleFinishReview}>Finish Review</button>
      </div>
    );
  }
  return (
    <div>
    <div className="quiz-page">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${(currentQuestionIndex + 1) / quiz.questions.length * 100}%` }}></div>
        <div className="progress-text">{currentQuestionIndex + 1}/{quiz.questions.length}</div>
      </div>
      {/* Question */}
      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
      </div>
      {/* Choices */}
      <div className="choices">
        {currentQuestion.choices.map((choice, index) => (
          <button
            key={index}
            className={`choice-button ${
              selectedChoice === choice
                ? choice.isCorrect
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
            onClick={() => handleChoiceClick(choice, currentQuestion.questionId)}
          >
            <span className="choice-label">{String.fromCharCode(65 + index)}</span>
            {choice.text}
          </button>
        ))}
      </div>
    </div>
    {/* Continue or Submit Button */}
    <div className="button-container">
      {currentQuestionIndex + 1 === quiz.questions.length ? (
        <button className="submit-button" onClick={() =>{setReview(true); handleScore();}}>
          Submit
        </button>
      ) : (
        <button className="continue-button" onClick={() => handleContinue()}>
          Continue
        </button>
      )}
    </div>
    </div>
  );
  };

export default Quiz;



