import React,{useState,useEffect} from"react";
import axios from "axios";
import SearchIcon from"@mui/icons-material/Search";
import "../../CSS/fileStudy.css";
import Flashcard from "../../Components/fileComponents/flashcard";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from"@mui/icons-material/Save";
import DeleteIcon from"@mui/icons-material/Delete";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Add from '@mui/icons-material/Add';
import { useLocation } from "react-router-dom"; 
import PartialLoadingImageComponent from '../../Components/loadingAndErrorComponents/partialLoadingComponent'
import PartialErrorComponent from "../loadingAndErrorComponents/partialErrorComponent";
import LaunchIcon from "@mui/icons-material/Launch"; 

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const FileStudy = () => {
    const [activeTab, setActiveTab] = useState("flashcards");
    const [searchQuery, setSearchQuery] = useState("");
    const [flashcards, setFlashcards] = useState([]);
    const [keyterms, setKeyterms] = useState([]);
    const [fetchedFlashcards, setFetchedFlashcards] = useState("flashcards"); 
    const [loading , setLoading ] = useState();
    const [fetchedKeyterms,setFetchedKeyterms] =useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [editedDef, setEditedDef] = useState("");
    const [newItem, setNewItem] = useState(null);
    const location = useLocation();
    const {fileId,fileURL} = location.state; 
    const [wait,setWait] = useState(false);
    const [error,setError] = useState(false);
    const [showFCModal, setShowFCModal] = useState(false);
    const [complexity, setComplexity] = useState("Medium");
    const [numPages , setNumPages ] = useState();
    const [currentPage , setCurrentPage ] = useState();
    const [length, setLength] = useState("Medium");
    const [baseURL,setBaseURL] =useState(fileURL);
    const [URL, setURL]= useState(fileURL);//URL for baseURL + page# 
    const [isAllPages, setIsAllPages] = useState(true);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
  
    useEffect(() => {
      if (activeTab === "flashcards") {
        fetchFlashcards();
      } else {
        fetchKeyterms();
      }
    }, [activeTab]);


    const handleFCClose = () => setShowFCModal(false);
    const handleStartPageChange = (e) => {
      const value = Number(e.target.value);
      setStartPage(value < 1 ? 1 : value); // Ensure start page is at least 1
    };
  
    const handleEndPageChange = (e) => {
      const value = Number(e.target.value);
      setEndPage(value < startPage ? startPage : value); // Ensure end page is at least start page
    };
  
    const handleCreateNew = () => {
        if (activeTab === "flashcards") {
          const newFlashcard = {
            id: Date.now(), // Temporary ID
            flashcardQ: "",
            flashcardA: "",
            isNew: true,
            isEditing : true,
          };
          setFlashcards((prev) => [newFlashcard, ...prev]);
          setNewItem(newFlashcard);
        } else if (activeTab === "keyterms") {
          const newKeyterm = {
            id: Date.now(), // Temporary ID
            keytermText: "",
            keytermDef: "",
            isNew: true,
          };
          setKeyterms((prev) => [newKeyterm, ...prev]);
          setEditingId(newKeyterm.id);
          setNewItem(newKeyterm);
        }
    };
    const handleClickGenerateFlashcards = async()=>{
      setShowFCModal(true);
    }
    const handleClickGenerateKeyterms = async()=>{
      setShowFCModal(true);
    }

    const handleGenerateFlashcards = async()=>{
        if (!fileId) {
          return;
        }
        setWait(true);
        try {
            const response = await axios.post(
              `http://localhost:8080/api/smartFlashcards/${fileId}`,
              {
                complexity: complexity,
                length: length,
                allPages:isAllPages,
                startPage: startPage ,
                endPage: endPage
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!response.data || response.data.length === 0) {
              setFlashcards([]);
              setFetchedFlashcards([]);
              setLoading(false);
              return;
            }
            setWait(false);
            const fetchedFlashcards = response.data.map((flashcard) => ({
              id: flashcard.flashcardId,
              name: flashcard.flashcardName,
              flashcardQ: flashcard.flashcardQ || '',
              flashcardA: flashcard.flashcardA || '',
              type:1
            }));
            setFlashcards(fetchedFlashcards);
            setFetchedFlashcards(fetchedFlashcards);
            setLoading(false);
            setShowFCModal(false);
          } catch (error) {
            console.error('Error fetching flashcards: *_*', error);
            setLoading(false);
            setWait(false)
            setError(true);
          }
    };
  
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/file/flashcards/${fileId}`);
        const data = response.data.map((flashcard) => ({
          id: flashcard.flashcardId,
          flashcardQ: flashcard.flashcardQ || "",
          flashcardA: flashcard.flashcardA || "",
          type : flashcard.type
        }));
        setFlashcards(data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
  
    const fetchKeyterms = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/file/keyterms/${fileId}`);
        const data = response.data.map((keyterm) => ({
          id: keyterm.keytermId,
          keytermText: keyterm.keytermText,
          keytermDef: keyterm.keytermDef || "",
          type: keyterm.type
        }));
        setKeyterms(data);
      } catch (error) {
        console.error("Error fetching keyterms:", error);
      }
    };
  
    const handleSaveFlashcard = async (id, question, answer) => {
      try {
        await axios.put(`http://localhost:8080/api/flashcard/${id}`, {
          flashcardQ: question,
          flashcardA: answer,
        });
        setFlashcards((prev) =>
          prev.map((flashcard) =>
            flashcard.id === id ? { ...flashcard, flashcardQ: question, flashcardA: answer } : flashcard
          )
        );
      } catch (error) {
        console.error("Error saving flashcard:", error);
      }
    };

    const handleSaveKeyTerm = async (id, def, text) => {
        try {
          await axios.put(`http://localhost:8080/api/keyterm/${id}`, {
            keytermText: text,
            keytermDef: def,
          });
          setKeyterms((prev) =>
            prev.map((keyTerm) =>
                keyTerm.id === id ? { ...keyTerm, keytermText: text, keytermDef: def } : keyTerm
            )
          );
          setEditingId(null)
          setEditedDef(null)
          setEditedText(null)
        } catch (error) {
          console.error("Error saving flashcard:", error);
        }
    };
    
  
    const handleDeleteFlashcard = async (id) => {
      try {
        await axios.delete(`http://localhost:8080/api/flashcard/${id}`);
        setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
      } catch (error) {
        console.error("Error deleting flashcard:", error);
      }
    };

    const onDeleteKeyTerm = async (id) => {
        try {
          await axios.delete(`http://localhost:8080/api/keyterm/${id}`);
          setKeyterms((prev) => prev.filter((keyTerm) => keyTerm.id !== id));
        } catch (error) {
          console.error("Error deleting flashcard:", error);
        }
      };

      const onEditKeyTerm = async (id, def, text) => {
        try {
          setEditingId(id)
          setEditedDef(def)
          setEditedText(text)
        } catch (error) {
          console.error("Error deleting flashcard:", error);
        }
      };
  
    const handleSearch = (query) => {
      setSearchQuery(query);
      if (activeTab === "flashcards") {
        setFlashcards((prev) =>
          prev.filter((flashcard) =>
            flashcard.flashcardQ.toLowerCase().includes(query.toLowerCase()) ||
            flashcard.flashcardA.toLowerCase().includes(query.toLowerCase())
          )
        );
      } else {
        setKeyterms((prev) =>
          prev.filter((keyterm) =>
            keyterm.keytermText.toLowerCase().includes(query.toLowerCase()) ||
            keyterm.keytermDef.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
    };

    const handleGenerateKeyterms = async()=>{
        if (!fileId) {
          return;
        }
        try {
            setWait(true);
            const response = await axios.post(`http://localhost:8080/api/smartKeyterms/${fileId}`,
             {
              complexity: complexity,
              length: length,
              allPages:isAllPages,
              startPage: startPage ,
              endPage: endPage
    
             }
          );
            if (!response.data || response.data.length === 0) {
              setKeyterms([]);
              setFetchedKeyterms([]);
              setLoading(false);
              console.log("hi");
              return;
            }
            const fetchedKeyterms = response.data.map((Keyterm) => ({
              id: Keyterm.keytermId,
              keytermText: Keyterm.keytermText,
              keytermDef: Keyterm.keytermDef || '',
              type:1
            }));
            setKeyterms(fetchedKeyterms);
            setFetchedKeyterms(fetchedKeyterms);
            setLoading(false);
            setWait(false);
          } catch (error) {
            console.error('Error fetching flashcards: *_*', error);
            setError(true);
            setLoading(false);
          }
    };

    const handleSaveNewItem = async (Q , A) => {
        try {
          if (activeTab === "flashcards" && newItem) {
            const response = await axios.post("http://localhost:8080/api/flashcard", {
              flashcardQ: Q,
              flashcardA: A,
              flashcardName : "",
              page:0 ,
              type:0,
              file: {
                connect: {
                  fileId: fileId, // Assuming `fileId` is already defined
                },
              },
            });
            const savedFlashcard = {
              id: response.data.flashcardId,
              flashcardQ: response.data.flashcardQ,
              flashcardA: response.data.flashcardA,
            };
            setFlashcards((prev) =>
              prev.map((fc) => (fc.id === newItem.id ? savedFlashcard : fc))
            );
          } else if (activeTab === "keyterms" && newItem) {
            const response = await axios.post("http://localhost:8080/api/keyterm", {
                keytermText: editedText,
                keytermDef: editedDef,
                page:0 ,
                type:0,  
                file: {
                  connect: {
                    fileId: fileId, // Assuming `fileId` is already defined
                  },
                },
            });
            const savedKeyterm = {
              id: response.data.keytermId,
              keytermText: response.data.keytermText,
              keytermDef: response.data.keytermDef,
            };
            setKeyterms((prev) =>
              prev.map((kt) => (kt.id === newItem.id ? savedKeyterm : kt))
            );
          }
          setNewItem(null);
          setEditingId(null);
          setEditedText("");
          setEditedDef("");
        } catch (error) {
          console.error("Error saving new item:", error);
        }
      };
    
      const handleCancelNewItem = () => {
        if (activeTab === "flashcards") {
          setFlashcards((prev) => prev.filter((fc) => fc.id !== newItem.id));
        } else if (activeTab === "keyterms") {
          setKeyterms((prev) => prev.filter((kt) => kt.id !== newItem.id));
        }
        setNewItem(null);
        setEditingId(null);
        setEditedText("");
        setEditedDef("");
      };
      const handleOpenPageFlashcard = async (flashcardId) => {
        try {
          const response = await axios.get(`http://localhost:8080/api/flashcard/${flashcardId}`);
          const page = response.data.page || 1;
          setURL("");
          setTimeout(() => {
            setURL(baseURL+'#page='+page);
          }, 0);
          console.log(`Navigated to page ${page}`);
        } catch (error) {
          console.error("Error navigating to page:", error);
        }
      };

        const handleOpenPageKeyTerm = async (keytermId) => {
        try {
          const response = await axios.get(`http://localhost:8080/api/keyterm/${keytermId}`);
          const page = response.data.page || 1;
          setURL("");
          setTimeout(() => {
            setURL(baseURL+'#page='+page);
          }, 0);
          console.log(`Navigated to page ${page}`);
        } catch (error) {
          console.error("Error navigating to page:", error);
        }
      };

          return (
      <div className="app-container">
        <div className="app-left-section">
        {wait && !error ? (
         <PartialLoadingImageComponent />
        ) : error ? (
        <PartialErrorComponent />
       ) : (
      <div>
          <div className="app-tab-buttons">
            <button
              className={`app-tab-button ${activeTab === "flashcards" ? "active" : ""}`}
              onClick={() => setActiveTab("flashcards")}
            >
              Flashcards
            </button>
            <button
              className={`app-tab-button ${activeTab === "keyterms" ? "active" : ""}`}
              onClick={() => setActiveTab("keyterms")}
            >
              Keyterms
            </button>
          </div>
  
          <div className="app-search-section">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="app-search-input"
            />
          </div>
          <div className="app-content">
          {activeTab === "flashcards" &&(

          <div class="button-container">
          <button class="generate-button"
          onClick={() => {
            handleClickGenerateFlashcards();
          }}
          >
          <AutoAwesomeIcon />
          AI Flashcards (For File)
          </button>
          <button class="create-button"
          onClick={() => {
            handleCreateNew();
          }}
          >
          <Add/> New Flashcard
          </button>
          </div>
          )}
          <Dialog open={showFCModal} onClose={handleFCClose}>
            <DialogContent>
                      {/* All Pages Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isAllPages}
              onChange={(e) => setIsAllPages(e.target.checked)}
            />
          }
          label="All Pages"
        />

        {/* Start and End Page Fields */}
        {!isAllPages && (
          <>
            <TextField
              fullWidth
              type="number"
              label="Start Page"
              value={startPage}
              onChange={handleStartPageChange}
              margin="normal"
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              fullWidth
              type="number"
              label="End Page"
              value={endPage}
              onChange={handleEndPageChange}
              margin="normal"
              InputProps={{ inputProps: { min: startPage } }}
            />
            </>)}
              {/* Complexity Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Complexity</InputLabel>
                <Select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
              {/* Length Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Length</InputLabel>
                <Select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                >
                  <MenuItem value="Short">Short</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Long">Long</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              {/* Actions */}
              <Button onClick={handleFCClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={activeTab === "flashcards"?handleGenerateFlashcards:handleGenerateKeyterms} color="primary" variant="contained">
                Generate
              </Button>
            </DialogActions>
          </Dialog>

            {activeTab === "flashcards" && !wait  &&

              flashcards.map((flashcard) => (
                <Flashcard
                  key={flashcard.id}
                  flashcard={flashcard}
                  onSave={handleSaveFlashcard}
                  onDelete={handleDeleteFlashcard}
                  handleSaveNewItem = {handleSaveNewItem}
                  isEditingParent = {flashcard.flashcardQ == ""}
                  handleCancelNewItem = {handleCancelNewItem}
                  handleOpenPageFlashcard={handleOpenPageFlashcard}                
                  />
              ))
              }
            {activeTab === "keyterms" &&(
            <div class="button-container">
            <button class="generate-button"
            onClick={() => {
                handleClickGenerateKeyterms();
            }}
            >
            <AutoAwesomeIcon />
            Generate AI Key Term
            </button>
            <button class="create-button"
            onClick={() => {
                handleCreateNew();
            }}
            >
            <Add/>    
            New Keyterm
            </button>
            </div>
                )}
            {activeTab === "keyterms" && !wait && (
              <div>
              {keyterms.map((keyterm) => (
                <div key={keyterm.id} className="app-keyterm">
                  <p>
                    {editingId != null && editingId === keyterm.id ? (
                      <>
                        <textarea
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="flashcard-input"
                        />
                        :
                        <textarea
                          value={editedDef}
                          onChange={(e) => setEditedDef(e.target.value)}
                          className="flashcard-input"
                        />
                      </>
                    ) : (
                      <>
                        <strong>{keyterm.keytermText}:</strong> 
                        <div className="keyterm-text">
                        {keyterm.keytermDef}
                        </div>
                      </>
                    )}
                  </p>
                  <div className="flashcard-actions">
                  {editingId === keyterm.id ? (
                    <>
                      <SaveIcon
                        onClick={keyterm.isNew ? handleSaveNewItem : () => handleSaveKeyTerm(keyterm.id, editedDef, editedText)}
                        className="flashcard-action-icon save"
                      />
                      <button onClick={handleCancelNewItem}>Cancel</button>
                    </>
                  ) : (
                    <EditIcon
                      onClick={() => onEditKeyTerm(keyterm.id, keyterm.keytermDef, keyterm.keytermText)}
                      className="flashcard-action-icon edit"
                    />
                  )}
                  {!keyterm.isNew && (
                    <DeleteIcon
                      onClick={() => onDeleteKeyTerm(keyterm.id)}
                      className="flashcard-action-icon delete"
                    />
                  )}
                  {keyterm.type===1 && (
                    <LaunchIcon
                      onClick={() => handleOpenPageKeyTerm(keyterm.id)}
                      className="flashcard-action-icon edit"
                    />
                  )}
                </div>
                </div>
              ))}
            </div>
            )}
          </div>
          </div>
        )}
        </div>
        <div className="app-right-section">
          <iframe
            id = "pdf-iframe"
            src={`${URL}`}
            className="app-pdf-viewer"
            title="PDF Viewer"
          ></iframe>       
        </div>
      </div>
    );
  };
  
  export default FileStudy;
