import React,{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../CSS/courseFiles.css";
import { UploadFile } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { Dialog, DialogContent, DialogActions, Button,TextField, DialogContentText} from '@mui/material';
import MenuBook from "@mui/icons-material/MenuBook";
import {Delete,Edit} from '@mui/icons-material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined"; // Study Icon
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined"; // Quiz Icon
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined"; // Practice Icon

const Files = () => {
  const [loading, setLoading] = useState(true);    
  const location = useLocation();
  const { courseId ,title} = location.state;
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // Course being viewed/edited
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [requiredDiv, setRequiredDiv] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchedFiles,setFetchedFiles]=useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("Sort"); // Sorting criteria
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [newFile,setNewFile] = useState(null);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false );

  useEffect(() => {
    const rootElement = document.getElementById("root");
    const button = document.querySelector("button");
  
    if (rootElement?.getAttribute("aria-hidden") === "true" && button) {
      button.blur(); // Remove focus from the button
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleClickOnFile = (file) => {
    setFile(file);
    setShowPopup(true);
  };
  
  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      uploadFile(file);
    }
  };

  const handleFileBrowse = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    if (!file) {
      setShowMetadataDialog(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("courseId", courseId);
  
      const response = await axios.post("http://localhost:8080/api/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const newFile = {
        id: response.data.fileId,
        name: file.name,
        fileDeadline: new Date().setDate(new Date().getDate() + 14),
        fileURL: file.fileURL,
      };
      setFiles([...files, newFile]);
      setNewFile(newFile);
      setSelectedFile(newFile);
      setShowMetadataDialog(true); // Show dialog for metadata
      //setUrl(file.fileURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload file.";
      alert(errorMessage);
    }
  };
  
    const handleSaveAfterUpload = async () => {
      try {
        await axios.put(`http://localhost:8080/api/file/${newFile.id}`, {
        "fileName": newFile.name,
        "fileDeadline": new Date(newFile.fileDeadline),
        "fileURL": newFile.fileURL
      });
      setFiles((prevFiles) =>
          prevFiles.map((file) =>
            String(file.id) === String(selectedFile.id) ? { ...selectedFile } : file
          )
      );
      setFiles(files);
      setFetchedFiles(files);
        closePopup();
      } catch (error) {
        console.error(":", error);
      }
    };
    useEffect(() => {
    if (!courseId) {
      return;
    }
    const fetchCourseFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/course/files/${courseId}`);
        if (!response.data || response.data.length === 0) {
          setFiles([]);
          setLoading(false);
          return;
        }
        const fetchedFiles = response.data.map((file) => ({
          id: file.fileId,
          name: file.fileName,
          fileDeadline: file.fileDeadline || '',
          fileURL: file.fileURL || 0,
          practiceCount: file.practiceCount || '',
        }));
        console.log(fetchedFiles);
        setFiles(fetchedFiles);
        setFetchedFiles(fetchedFiles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
      }
    };
  
    fetchCourseFiles();
  }, [courseId]); // Runs only when courseId changes
  

  const handleDelete = (file) => {
    console.log('Selected file for deletion:', file); // Log the file object
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedFile(null);
  };

  const handleConfirmedDelete = async () => {
    if (selectedFile) {
        try {
            await axios.delete(`http://localhost:8080/api/file/delete/${selectedFile.id}`);
            setFiles((prevFiles) => prevFiles.filter((file) => file.id !== selectedFile.id));
            handleCloseModal(); // Close the modal after deletion
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }
  };

  const handleEdit= async(file)=>{
    setSelectedFile(file);
    setShowEditModal(true);
  };

  const handleEditFile = async () => {
  setRequiredDiv(false);
  const newErrors = {
    name: !selectedFile.name,
  };
  setErrors(newErrors);
  if (newErrors.name) {
    setRequiredDiv(true);
    return;
  }
  try {
    console.log("from update: "+selectedFile.id )
    console.log("from update: "+selectedFile.name )
    await axios.put(
      `http://localhost:8080/api/file/${selectedFile.id}/${selectedFile.name}`,
    );
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        String(file.id) === String(selectedFile.id)
          ? { ...file, name: selectedFile.name } // Update file name
          : file
      )
    );
    setFetchedFiles(files)
    closePopup();
  } catch (error) {
    console.error("Error updating file name:", error);
  }
};
const closePopup = () => {
  setRequiredDiv(false);
  setShowEditModal(false);
};

const handleSearch = () => {
  if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      const searchedFiles = files.filter((file) =>
        regex.test(file.name) 
      );
      setFiles(searchedFiles);
  } else {
      setFiles(fetchedFiles);
  }
};

const handleInputChange =(e) =>{
  const value = e.target.value;
  setSearchQuery(value);
  if (!value) {
    setFiles(fetchedFiles);
  }    
};

const handleSort = (criteria) => {
  setSortCriteria(criteria);

  const sortedFiles = [...files].sort((a, b) => {
    if (criteria === "soonest") {
      return new Date(a.fileDeadline) - new Date(b.fileDeadline); 
    } else if (criteria === "latest") {
      return new Date(b.fileDeadline) - new Date(a.fileDeadline);
    } else if (criteria === "name") {
      return a.name.localeCompare(b.name); 
    }
    return 0;
  });

  setFiles(sortedFiles);
  };

  const handleOpenStudy=(fileId,fileURL)=>{
    navigate(`/files/fileStudy`, { state: {fileId,fileURL} });
  };

  const handleOpenPractice=(fileId)=>{
    navigate(`/files/filePractice`, { state: {fileId,courseId ,title} });
  };

  const handleOpenQuiz=(fileId)=>{
    navigate(`/files/fileQuiz`, { state: { fileId,courseId ,title} });
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
  {/* Left Section */}
  <div className="left-section ">
    <h1 className="course-title">
    <InsertDriveFileIcon  style={{ fontSize: "35px", color: "#1ca7ec" }}/>
    {title} Files  
      </h1> 

    <div className="search-order-container">
                <div className="search-bar-container-files">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleInputChange}        
                  />
                  <button className="search-button" onClick={() => handleSearch()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#3785D8"
                      viewBox="0 0 24 24"
                      width="20px"
                      height="20px"
                    >
                      <path d="M10 2a8 8 0 015.292 13.71l5 5a1 1 0 01-1.414 1.415l-5-5A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
                    </svg>
                  </button>
               </div>
    <select className="order-dropdown" defaultValue="0" value={sortCriteria} onChange={(e) => handleSort(e.target.value)}>
      <option value="Sort" disabled > <MenuBook/>Sort</option>
      <option value="name">Name(A-Z)</option>
      <option value="soonest">Deadline(Soonest first)</option>
      <option value="latest">Deadline(Latest first)</option>
    </select>
    </div>
    <div className="file-list">
      {files.map((file) => (
        <div key={file.id} className="file-item">
          <span>
          {file.name}
          </span>
          <div className="file-actions">
          <button className="action-button" onClick={()=>{handleClickOnFile(file)}}><MenuBook/></button>
            <button className="action-button" onClick={()=>{handleEdit(file)}}><Edit/></button>
            <button className="action-button delete-button-files" onClick={()=>{handleDelete(file)}}><Delete/></button>
          </div>
        </div>
      ))}
    </div>
  </div>
  {/* Right Section */}
  <div className="right-section">
    <div className="drag-and-drop-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="drag-area">
      <div className="upload-icon">
  <UploadFile style={{ fontSize: "45px", color: "#1ca7ec" }} />
</div>
        <p>Drag your study materials here</p>
        <small>only PDFs</small>
        <label className="browse-link">
          or <span>browse your files...</span>
          <input
            type="file"
            onChange={handleFileBrowse}
            className="hidden-input"
            accept=".pdf"
          />
        </label>
      </div>
      {uploadedFile && <p className="file-name">Uploaded File: {uploadedFile.name}</p>}
    </div>
  </div>
</div>
          {/* Confirmation Modal */}
            <Dialog
                open={showDeleteModal}
                onClose={handleCloseModal}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to delete the file ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmedDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

                    <Dialog
                      open={showEditModal}
                    >
                      <DialogContent>
                        <TextField
                          fullWidth
                          label="file name"
                          value={selectedFile?.name || ''}
                          onChange={(e) =>
                            setSelectedFile({ ...selectedFile, name: e.target.value })
                          }
                          margin="normal"
                        />
                        {requiredDiv && errors.title && (
                          <div
                            style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}
                          >
                            Title is required
                          </div>
                        )}
                        </DialogContent>
                      <DialogActions>
                      <Button onClick={closePopup} color="#000000">
                          Cancel
                        </Button>

                        <Button onClick={handleEditFile} color="primary">
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog open={showMetadataDialog} onClose={() => setShowMetadataDialog(false)}>
    <DialogContent>
      <TextField
        fullWidth
        label="File Name"
        value={newFile?.name || ""}
        onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
        margin="normal"
      />
<TextField
  fullWidth
  label="Deadline"
  type="date"
  value={new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0]}
  onChange={(e) => setNewFile({ ...newFile, fileDeadline: e.target.value })}
  margin="normal"
  InputLabelProps={{ shrink: true }}
/>
{requiredDiv && (
              <div
                style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}
              >
                Invalid deadline
              </div>
            )}

    </DialogContent>
    <DialogActions>
  <Button onClick={() => {setShowMetadataDialog(false);       setRequiredDiv(false);}
 } color="black">
    Cancel
  </Button>
  <Button
    onClick={() => {
      if (!newFile.name || !newFile.fileDeadline) {
        return;
      }
      if (new Date(newFile.fileDeadline).getTime() < new Date().getTime()) {
        setRequiredDiv(true);
        return;
      }
      setRequiredDiv(false);
      setShowMetadataDialog(false);
      handleSaveAfterUpload();
    }}
    color="primary"
  >
    Save
  </Button>
</DialogActions>
  </Dialog>
  {showPopup &&(
    <div>
    <div className="popup-overlay" onClick={handleClosePopup}></div>

{/* Popup Content */}
<div className="popup-container">
  <button className="popup-close-btn" onClick={handleClosePopup}>
    ×
  </button>
  <div className="popup-buttons">
    {/* Study Button */}
    <div
      className="popup-button"
      onClick={() => handleOpenStudy(file.id,file.fileURL)}
    >
      <div className="popup-icon"><MenuBookOutlinedIcon/></div>
      <div className="popup-text">
        <h3>Study</h3>
        <p>Generate flashcards and key terms while viewing PDFs.</p>
      </div>
    </div>
    {/* Practice Button */}
    <div
      className="popup-button"
      onClick={() => handleOpenPractice(file.id)}
    >
      <div className="popup-icon"><RepeatOutlinedIcon/></div>
      <div className="popup-text">
        <h3>Practice</h3>
        <p>Use spaced repetition to boost memory retention.</p>
      </div>
    </div>

    {/* Quiz Button */}
    <div
      className="popup-button"
      onClick={() => handleOpenQuiz(file.id)}
    >
      <div className="popup-icon"><QuizOutlinedIcon/></div>
      <div className="popup-text">
        <h3>Quiz</h3>
        <p>Create customized quizzes tailored to your needs.</p>
      </div>
    </div>
  </div>
</div>
</div>
)}
    </div>
  );
};

export default Files;
