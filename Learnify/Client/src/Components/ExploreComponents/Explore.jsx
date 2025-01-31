import React, { useEffect, useState, useRef } from "react";
import "../../CSS/explore.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // MUI Icon
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'
import LoadingImageComponent from "../loadingAndErrorComponents/loadingComponent";
const Explore = () => {
  const [popularTopics, setPopularTopics] = useState([]);
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTopic, setSearchTopic] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Medium");
  const [userId,setUserId] =useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialRender = useRef(true);
useEffect(() => {
    const initializeUser = async () => {
      const token = Cookies.get('token');
      console.log('Retrieved Token:', token);
      if (token) {
        try {
          console.log('Decoding token... from courses Page');
          const decoded =  jwtDecode(token);
          setUserId(decoded.id); // Adjust this based on the token structure
          console.log('Decoded Token:', decoded);
        } catch (error) {
          navigate('/auth/login');
        }
      } else {
        navigate('/auth/login');
      }
    };
    initializeUser();
  }, []);

  useEffect(() => {
    if(!userId)
    {
      return;
    }
    const fetchTopics = async () => {
      setLoading(true);
      try {
        if (location.state?.back) {
          const { popular, related, suggested } = location.state;
          setPopularTopics(popular || []);
          setRelatedTopics(related || []);
          setSuggestedTopics(suggested || []);
        } else {
          const response = await axios.get(
            `http://localhost:8080/api/exploreflashcards/generateTopics/${userId}`
          );
          const {
            "Popular Topics": popular = [],
            "Related Topics": related = [],
            "Suggested Topics": suggested = [],
          } = response.data;
          setPopularTopics(popular);
          setRelatedTopics(related);
          setSuggestedTopics(suggested);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isInitialRender.current) {
      isInitialRender.current = false;
      fetchTopics();
    }
  }, [location.state,userId]);


  const handleSearch = async (explorTopic = searchTopic) => {
    if (!explorTopic) {
      alert("Please enter a topic to search");
      return;
  }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/exploreflashcards/searchTopic/${explorTopic}`,
        {
          level: selectedLevel,
          userId: userId,
        }
      );
      if (response.data && response.data.length > 0) {
        const flashcards = response.data;
        navigate("/explore/exploreFlashcards", {
          state: {
            flashcards,
            topic: explorTopic,
            back: true,
            popular: popularTopics,
            related: relatedTopics,
            suggested: suggestedTopics,
          },
        });
      } else {
        alert("No flashcards found for this topic.");
      }
    } catch (error) {
      console.error("Error searching topic:", error);
      alert("An error occurred while searching. Please try again.");
    }
  };


  const gradientPool = [
    /*
    // Blue Gradients
    ["#B1BEF2", "#E2EAFB"], // Light pastel blue → softer pastel blue
    ["#B1BEF2", "#C6D3F5"], // Light pastel blue → slightly darker blue
    ["#B1BEF2", "#A0BFF5"], // Light pastel blue → medium sky blue
  
    // Pink Gradients
    ["#F5C4E2", "#FEE3EC"], // Soft pastel pink → lighter pastel pink
    ["#F4C9DA", "#FEE3EC"], // Medium soft pink → light pastel pink
    ["#F4C9DA", "#F5C4E2"], // Medium soft pink → richer pastel pink
    ["#FEE3EC", "#F4C9DA"], // Lighter pastel pink → soft warm pink
    */
    ["#4E8BC4", "#96CBFC"], // Medium blue → light blue
    ["#96CBFC", "#C2E1FC"], // Light blue → softer pastel blue
    ["#4E8BC4", "#C2E1FC"], // Medium blue → soft pastel blue
  
    // Pink Gradients
    ["#FFC2D9", "#FF99BE"], // Soft pink → rich pastel pink
    ["#FF99BE", "#FFC2D9"], // Rich pastel pink → soft pink
    ["#FFC2D9", "#FEE3EC"], // Soft pink → light pastel pink
    ["#FF99BE", "#F4C9DA"], // Rich pastel pink → soft warm pink
  
  ];
  
  const handleTopicClick = (topic) => {
    setSearchTopic(topic);
    handleSearch(topic);
  };

const renderTopics = (topics, sectionTitle) => (
<section className="topics-section">
  <h2 className="section-title">{sectionTitle}</h2>
  <div className="topics-grid">
    {topics.map((topic, index) => {
      const gradient = gradientPool[index % gradientPool.length]; // Apply gradients in fixed order
      return (
        <div
          key={index}
          className="topic-card"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          <h3>{topic}</h3>
          <div
            className="icon-container"
            onClick={() => handleTopicClick(topic)}

          >
            <ArrowForwardIcon fontSize="large" className="icon" />
          </div>
        </div>
      );
    })}
  </div>
</section>
);

/*
const renderTopics = (topics, sectionTitle, handleTopicClick) => {
  const gradientPool = createAlternatingGradientPool();
  
  const shuffledGradients = [...gradientPool].sort(() => Math.random() - 0.5);

  return (
    <section className="topics-section">
      <h2 className="section-title">{sectionTitle}</h2>
      <div className="topics-grid">
        {topics.map((topic, index) => {
          const gradient = shuffledGradients[index % shuffledGradients.length];
          return (
            <div
              key={index}
              className="topic-card"
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
              }}
            >
              <h3>{topic}</h3>
              <div
                className="icon-container"
                onClick={() => handleTopicClick(topic)}
              >
                <ArrowForwardIcon fontSize="large" className="icon" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

    const renderTopics = (topics, sectionTitle, handleTopicClick) => (
      <section className="topics-section">
        <h2 className="section-title">{sectionTitle}</h2>
        <div className="topics-grid">
          {topics.map((topic, index) => {
            const gradient = randomGradient();
            return (
              <div
                key={index}
                className="topic-card"
                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
              >
                <h3>{topic}</h3>
                <div
                  className="icon-container"
                  onClick={() => handleTopicClick(topic)}
                >
                  <ArrowForwardIcon fontSize="large" className="icon" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
*/
  if (loading) {
    return (
      <LoadingImageComponent></LoadingImageComponent>
    );
  }

  return (
    <div className="explore-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Search and explore flashcards tailored to your needs.</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a topic..."
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
          />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="level-selector"
          >
            <option value="Beginner">Beginner</option>
            <option value="Medium">Medium</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button onClick={handleSearch}>Generate</button>
        </div>
      </div>

      {/* Topic Sections */}
      {renderTopics(popularTopics, "Popular Topics")}
      {renderTopics(relatedTopics, "Related Topics")}
      {renderTopics(suggestedTopics, "Suggested Topics")}
    </div>
  );
};

export default Explore;
