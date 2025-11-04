import { useEffect, useState } from 'react';
import React from 'react';
import { Add as AddIcon  } from '@mui/icons-material';
import { Dialog, DialogContent, DialogActions, Button,TextField, DialogContentText} from '@mui/material';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'
import axios from 'axios';
import "../../CSS/course.css";
import CourseCard from'../../../src/Components/coursesComponents/CourseCard'

export default function Courses() {
    const [loading, setLoading] = useState(true);    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState();
    const [createCourseDialog, setCreateCourseDialog] = useState(false);
    const [fetchedCourses, setFetchedCourses] = useState([]);
    const [errors, setErrors] = useState({});
    const [requiredDiv, setRequiredDiv] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null); // Course being viewed/edited
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

// Initialize user and set userId
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
    if (!userId) {
      return;
    }
    const fetchUserCourses = async () => {
      try {
        console.log("Fetching courses for user: " + userId);
        const response = await axios.get(`http://localhost:8080/api/user/courses/${userId}`);
        if (!response.data || response.data.length === 0) {
            console.log("No events found for this user.");
            setCourses([]); // Ensure events state is cleared
            setFetchedCourses([]);
            setLoading(false); // Set loading to false'
            return;
        }
        const fetchedCourses = response.data.map((course) => ({
          id: course.courseId,
          title: course.courseName,
          description: course.courseDescription || '',
          tag: course.courseTag || '',
        }));
        console.log(fetchedCourses);
        setCourses(fetchedCourses);
        setFetchedCourses(fetchedCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchUserCourses();
  }, [userId]); // Runs only when userId changes
  
    //handle popup for add and handle click add icon
    const closePopup = () => {
      setCreateCourseDialog(false);
      setRequiredDiv(false);
      setNewCourse({ title: "", description: "" });
      setShowEditModal(false);
    };
    const handleClickPlus = () => {
      setCreateCourseDialog(true);
      setRequiredDiv(false);
    };

     // Function to update the state
    const updateParentCourseState = (course, isEdit) => {
        setSelectedCourse(course);
        if (isEdit) {
            setShowEditModal(true);
        } else {
            setShowDeleteModal(true);
        }
    };

    // Delete a course
    const handleDelete = async () => {
        if (selectedCourse) {
            try {
                await axios.delete(`http://localhost:8080/api/course/${selectedCourse.id}`);
                setCourses((prevCourses) =>
                    prevCourses.filter((course) => course.id !== selectedCourse.id)
                );
                setFetchedCourses(courses);
                handleCloseModal(); // Close the modal after deletion
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    //handl Edit Course
    const handleEditCourse = async () => {
        setRequiredDiv(false);
        const newErrors = {
          title: !selectedCourse.title,
          description: !selectedCourse.description,
        };
        setErrors(newErrors);
        if (newErrors.title || newErrors.description) {
          setRequiredDiv(true);
          return;
        }
        try {
          const response = await axios.put(`http://localhost:8080/api/course/${selectedCourse.id}`, {
          "courseName": selectedCourse.title,
          "courseDescription": selectedCourse.description,
          "courseTag": selectedCourse.tag,
          "user_": {
            "connect": {
              "userId": userId
            }
          }
        });
        setCourses((prevCourses) =>
            prevCourses.map((course) =>
              String(course.id) === String(selectedCourse.id) ? { ...selectedCourse } : course
            )
        );
        setFetchedCourses(courses);
          closePopup();
        } catch (error) {
          console.error("Error adding course:", error);
        }
      };

    handleEditCourse
    //handle craete new course 
    const handleAddCourse = async () => {
        setRequiredDiv(false);
        const newErrors = {
          title: !newCourse.title,
          description: !newCourse.description,
        };
        setErrors(newErrors);
        if (newErrors.title || newErrors.description) {
          setRequiredDiv(true);
          return;
        }
        try {
          const response = await axios.post('http://localhost:8080/api/course', {
          "courseName": newCourse.title,
          "courseDescription": newCourse.description,
          "courseTag": newCourse.tag,
          "user_": {
            "connect": {
              "userId": userId
            }
          }
        });
          console.log("hi");
          setCourses([
            ...courses,
            { id: response.data.CourseId, title:newCourse.title, description:newCourse.description, tag: newCourse.tag},
          ]);
          setFetchedCourses(courses);
          closePopup();
        } catch (error) {
          console.error("Error adding course:", error);
        }
      };

    //filter
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
      };
  
      const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setShowDropdown(false);
        if (filter) {
          // Create a regex for case-insensitive matching
          const regex = new RegExp(filter, "i");
          // Filter courses based on the regex match
          const filteredCourses = courses.filter((course) =>
            regex.test(course.tag) // Check if the course tag matches the regex
          );
      
          setCourses(filteredCourses);
        } else {
          // If no filter, reset to show all courses
          setCourses(fetchedCourses);
        }
      };

    // Clear the selected filter
    const handleClearFilter = () => {
        setSelectedFilter(""); // Reset filter
        setCourses(fetchedCourses);
    };

    // Show modal with selected course
    const handleShowModal = () => {
        setShowModal(true);
    };

     // Close the modal
     const handleCloseModal = () => {
        setShowDeleteModal(false);
        setSelectedCourse(null);
    };
  
    const handleSearch = () => {
      if (searchQuery) {
        // Create a regex for case-insensitive matching
          const regex = new RegExp(searchQuery, "i");
        // Filter courses based on the regex match
          const filteredCourses = courses.filter((course) =>
            regex.test(course.tag) || regex.test(course.title) || regex.test(course.description)||
          course.tag.replace(/\s+/g, "").toLowerCase().includes(searchQuery.toLowerCase())||
          course.title.toLowerCase().replace(/\s+/g, "").includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
          setCourses(filteredCourses);
      } else {
          // If no filter, reset to show all courses
          setCourses(fetchedCourses);
      }
    };

    const handleInputChange =(e) =>{
      const value = e.target.value;
      setSearchQuery(value);
      if (!value) {
        setCourses(fetchedCourses);
      }    
    };

    const handleOpenCourseClick = (courseId,title) => {
      navigate(`/files`, { state: { courseId,title} });
    };
  
    return (
      <div>
          <div >
            <div >
              <div class="my-courses-title">
                <h1 class="my-courses-title inline-block-title-icon ">My Courses</h1>
                <button className="add-course-card inline-block-title-icon" onClick={handleClickPlus}>
                  <AddIcon />
                </button>
              </div>
              <div className='action-bar'>
                <div className="search-bar-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleInputChange}        
                  />
                  <button className="search-button"  onClick={() => handleSearch()}>
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
                <select
  className="filter-dropdown"
  value={selectedFilter || "Filter"} // Default to "Filter" if no filter is selected
  onChange={(e) => handleFilterSelect(e.target.value)}
>
  <option value="Filter" disabled>
    <FilterAltIcon style={{ color: "black", marginRight: "5px" }} />
    Tag
  </option>
  {[...new Set(courses.map((course) => course.tag))].map((tag, index) => (
    <option key={index} value={tag}>
      {tag}
    </option>
  ))}
</select>

{selectedFilter && (
  <button className="selected-filter-button" onClick={handleClearFilter}>
    <CloseIcon style={{ fontSize: "16px", marginRight: "5px" }} />
    {selectedFilter}
  </button>
)}

              </div>
            </div>
            <div className="courses-grid">
               {courses.map((course) => (
               <CourseCard
               key={course.id}
               title={course.title}
               description={course.description}
               tag = {course.tag}
               courseId={course.id}
               handleDelete = {handleDelete}
               onUpdateParent={updateParentCourseState}
               onOpenCourse={handleOpenCourseClick}
            />
      ))}
    </div>
          </div>
        <Dialog
          open={createCourseDialog}
          onClose={() => setCreateCourseDialog(false)}
        >
          <DialogContent>
            <TextField
              fullWidth
              label="Course Title"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
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
            <TextField
              fullWidth
              label="Course Description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              margin="normal"
            />
            {requiredDiv && errors.description && (
              <div
                style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}
              >
                Description is required
              </div>
            )}
            <TextField
              fullWidth
              label="Course Tag"
              value={newCourse.tag}
              onChange={(e) =>
                setNewCourse({ ...newCourse, tag: e.target.value })
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
          <Button onClick={closePopup} color="#000000">
              Cancel
            </Button>
            <Button onClick={handleAddCourse} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
          {/* Confirmation Modal */}
          <Dialog
                open={showDeleteModal}
                onClose={handleCloseModal}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to delete the course ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        <Dialog
          open={showEditModal && !!selectedCourse}
          onClose={() => setCreateCourseDialog(false)}
        >
          <DialogContent>
            <TextField
              fullWidth
              label="Course Title"
              value={selectedCourse?.title || ''}
              onChange={(e) =>
                setSelectedCourse({ ...selectedCourse, title: e.target.value })
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
            <TextField
              fullWidth
              label="Course Description"
              value={selectedCourse?.description|| ''}
              onChange={(e) =>
                setSelectedCourse({ ...selectedCourse, description: e.target.value })
              }
              margin="normal"
            />
            {requiredDiv && errors.description && (
              <div
                style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}
              >
                Description is required
              </div>
            )}
            <TextField
              fullWidth
              label="Course Tag"
              value={selectedCourse?.tag || ''}
              onChange={(e) =>
                setSelectedCourse({ ...selectedCourse, tag: e.target.value })
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closePopup} color="#000000">
              Cancel
            </Button>
            <Button onClick={handleEditCourse} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
