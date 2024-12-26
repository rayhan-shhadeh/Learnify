import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconBrain } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import BadgeComponent from '../loadingAndErrorComponents/badge';
import NoFlashcardsComponent from '../../Components/loadingAndErrorComponents/NoFlashcardsComponent'
import '../../CSS/filePractice.css';

const Practice = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(); 
  const location = useLocation();
  const { fileId,courseId ,title} = location.state;
  const [finish,setFinish]=useState(false);
  const [practiceFlag,setPracticeFlag] = useState(true); 
  const gradients = [
    "linear-gradient(135deg, #f9f9f9, #e8f0ff)",
    "linear-gradient(135deg, #fff4e6, #ffe9f0)",
    "linear-gradient(135deg, #f0f9ff, #e8f0e6)",
    "linear-gradient(135deg, #e9f7ff, #fff7e6)",
    "linear-gradient(135deg, #f9efff, #f9fff9)",
    "linear-gradient(135deg, #fff9e6, #ffe6f0)",
    "linear-gradient(135deg, #e8fffa, #ffeef0)",
    "linear-gradient(135deg, #f0ffe6, #fff4e6)",
    "linear-gradient(135deg, #f9e6ff, #e6f9ff)",
    "linear-gradient(135deg, #e6f9ff, #fff4f9)",
  ];
  function getRandomGradient() {
    return gradients[Math.floor(Math.random() * gradients.length)];
  }

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.post(`http://localhost:8080/api/file/practice/${fileId}`);
        const fetchedFlashcards = response.data.map((flashcard) => ({
          id: flashcard.flashcardId,
          question: flashcard.flashcardQ || '',
          answer: flashcard.flashcardA || '',
        }));
        setFlashcards(fetchedFlashcards);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
    };
    if (!practiceFlag) return;
    if(practiceFlag){
      fetchFlashcards();
      setPracticeFlag(false);
      return
    }  
  }, [fileId,practiceFlag]);


  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedIndex(null);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    else if (currentIndex === flashcards.length - 1) {
      setFinish(true);
    }
  };

  const handleRating = async (rating) => {
    setSelectedIndex(rating); // Update the selected index
    try {
      await axios.post(`http://localhost:8080/api/file/practice/review/${flashcards[currentIndex].id}`, { rating });
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) return <div className="practice-page">Loading...</div>;
  if (flashcards.length === 0) return <NoFlashcardsComponent/>;

  return (
    finish?(
      <div>
      <BadgeComponent courseId={courseId} title={title}></BadgeComponent>
      </div>
    ):(
    <div className="practice-page">
      <div className="progress-bar-container-practice">
        <h1>
        <IconBrain size={40} color={"#E893C5"}className='ICON-BRAIN'/>
        </h1>

        <div className="custom-progress-bar" style={{ width: '50%' }}>
          <div
            className="custom-progress"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text-practice">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </div>
      <div className="flashcard-container-practice">
        <motion.div
          className="flashcard-practice"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          initial={{ rotateY: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleFlip}
          style={{
            border: `4px solid rgba(0, 73, 151, 0.5)`,
            background: getRandomGradient()
          }}
        >
          <div
            className="flashcard-content front"
            style={{ display: !isFlipped ? 'flex' : 'none' ,
              
            }}
          >
            {flashcards[currentIndex].question}
          </div>
          <div
            className="flashcard-content back"
            style={{ display: isFlipped ? 'flex' : 'none',
              
            }}
          >
            {flashcards[currentIndex].answer}
          </div>
        </motion.div>
        <IconButton className="next-arrow" onClick={handleNext} style={{
          border: '2px solidrgb(0, 103, 212)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'solidrgb(0, 103, 212)',
          position: 'absolute',
          right: '-100px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}>
          <ChevronRightIcon fontSize="medium" />
        </IconButton>

      </div>

      <div className="rating-slider">
  {[
    { emoji: "😡", label: "Very Hard", color: "red" },
    { emoji: "😞", label: "Hard", color: "red" },
    { emoji: "😐", label: "Okay", color: "orange" },
    { emoji: "🙂", label: "Easy", color: "green" },
    { emoji: "😀", label: "Very Easy", color: "green" },
  ].map((item, index) => (
    <div
      key={index}
      className={`rating-item ${selectedIndex === index + 1 ? "selected" : ""}`}
      onClick={() => handleRating(index + 1)} // Call with values 1 to 6
    >
      <div
        className="emoji-circle"
        style={{
          backgroundColor: "orange" ,
          transform: selectedIndex === index + 1 ? "scale(1.5)" : "scale(1)",
          transition: "transform 0.3s ease, background-color 0.3s ease",
        }}
      >
        {item.emoji}
      </div>
      <span
        className="label"
        style={{
          color: selectedIndex === index + 1 ? item.color : "#000",
        }}
      >
        {item.label}
      </span>
    </div>
  ))}
</div>

</div>
    )
  );
};

export default Practice;
