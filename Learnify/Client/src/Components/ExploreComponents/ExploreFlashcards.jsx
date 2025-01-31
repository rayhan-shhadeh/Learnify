import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../CSS/ExploreFlashcards.css";
import axios from "axios";

const ExploreFlashcards = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flashcards: initialFlashcards, topic, popular, related, suggested } =
    location.state || {};
  const [flashcards, setFlashcards] = useState(initialFlashcards || []);
  const [showAnswer, setShowAnswer] = useState(
    Array(initialFlashcards?.length).fill(false)
  );
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flashcards-page">
        <h1 className="flashcards-title">No Flashcards Found</h1>
        <button className="control-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const handleExploreMore = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/exploreflashcards/exploreMore/${topic}`
      );
      if (response.data && response.data.length > 0) {
        setResources(response.data);
      } else {
        alert("No additional resources found.");
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      alert("An error occurred while exploring more resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    setShowAnswer((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <div className="flashcards-page">
      <h1 className="flashcards-title">{topic} Flashcards</h1>
      <div className="flashcards-grid">
        {flashcards.map((card, index) => (
          <div
            key={index}
            className="flashcard"
            onClick={() => toggleCard(index)}
          >
            <div className="flashcard-content">
              {!showAnswer[index] ? card.ExploreFlashcardQ : card.ExploreFlashcardA}
            </div>
          </div>
        ))}
      </div>
      <div className="explore-more-section">
      <button
          onClick={() =>
            navigate("/explore", {
              state: { back: true, popular, related, suggested },
            })
          }
          className=" bu resource-link"
        >
          Back to Explore
        </button>
      </div>
      <div className="explore-more-section">
        <button onClick={handleExploreMore} className="control-button">
          Explore More Resources
        </button>
      </div>

      {loading && (
  <div className="resources-loading">
    <div className="spinner"></div>
    <p>Generating resources...</p>
  </div>
)}

{!loading && resources.length > 0 && (
  <div className="resources-list">
    <h2 className="resources-title">Additional Resources</h2>
    <ul>
      {resources.map((resource, index) => (
        <li key={index} className="resource-item">
          <a
            href={resource.resourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-link"
          >
            {resource.resourceName}
          </a>
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
};

export default ExploreFlashcards;
