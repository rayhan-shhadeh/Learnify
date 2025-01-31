import React,{useState} from"react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from"@mui/icons-material/Save";
import DeleteIcon from"@mui/icons-material/Delete";
import QuestionMarkIcon from"@mui/icons-material/QuestionMark";
import LightbulbIcon from"@mui/icons-material/Lightbulb";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import LaunchIcon from "@mui/icons-material/Launch"; // Open Page Icon
import CloseIcon from '@mui/icons-material/Close';

import "../../CSS/flashcard.css";

const Flashcard = ({ flashcard, onSave, onDelete, handleSaveNewItem, isEditingParent, handleCancelNewItem,
  handleOpenPageFlashcard }) => {
  console.log(isEditingParent)
  const [isEditing, setIsEditing] = useState(isEditingParent);
  const [editedQuestion, setEditedQuestion] = useState(flashcard.flashcardQ);
  const [editedAnswer, setEditedAnswer] = useState(flashcard.flashcardA);

  const handleSave = () => {
    onSave(flashcard.id, editedQuestion, editedAnswer);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    if (flashcard.isNew) {
      handleSaveNewItem(editedQuestion, editedAnswer);
    } else {
      handleSave();
    }
  };

  return (
    <div className="flashcard-container">
      <div className="flashcard-left">
        <div className="ai-badge"><NoteAltIcon/></div>
        <div className="vertical-line"></div>
      </div>

      <div className="flashcard-content">
        <p className="flashcard-question">
          <QuestionMarkIcon className="flashcard-icon question-icon" />
          {isEditing ? (
            <textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="flashcard-input"
            />
          ) : (
            editedQuestion
          )}
        </p>

        <hr className="flashcard-separator" />

        <p className="flashcard-answer">
          <LightbulbIcon className="flashcard-icon question-icon" />
          {isEditing ? (
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className="flashcard-input"
            />
          ) : (
            editedAnswer
          )}
        </p>
        <div className="flashcard-actions">
          {isEditing ? (
            <>
              <SaveIcon onClick={flashcard.isNew ? handleSaveClick  : handleSave} className="flashcard-action-icon save" />
              <CloseIcon onClick={handleCancelNewItem} className="flashcard-action-icon cancel"/>
            </>
          ) : (
            <EditIcon onClick={() => setIsEditing(true)} className="flashcard-action-icon edit" />
          )}
          {!flashcard.isNew && (
            <>
            <DeleteIcon
              onClick={() => onDelete(flashcard.id)}
              className="flashcard-action-icon delete"
            />
    {flashcard.type === 1 && (
      <LaunchIcon
        onClick={() => handleOpenPageFlashcard(flashcard.id)}
        className="flashcard-action-icon edit"
      />
    )}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
  