import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { AccessTime, CalendarToday } from '@mui/icons-material'; // Import icons
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import '../CSS/calenderPopUp.css'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Calender() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]); // Initialize events as an array
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [createEventDialog, setCreateEventDialog] = useState(false);
  const [errors, setErrors] = useState({ title: false, description: false });
  const [requiredDiv, setRequiredDiv] = useState(false);
  const [requiredDivEdit, setRequiredDivEdit] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const  initializeUser = () => {
    const token = Cookies.get('token');
      console.log('Retrieved Token:', token);
      if(token){
        try {
          console.log('Decoding token... from calender');
          const decoded =  jwtDecode(token);
          setUserId(decoded.id); // Adjust this based on the token structure
          console.log('Decoded Token:', decoded);
        } catch (error) {
          navigate('/auth/login');     
        }

      }
      else{
        navigate('/auth/login'); 
      }
              

    };
    initializeUser();
  }, []);

  // Fetch events from API
  useEffect(() => {
  const fetchInitialEvents = async () => {
    try {
      console.log("from calendar: "+userId);
      if (!userId){
        return ;
      }
      const response = await axios.get(`http://localhost:8080/api/user/events/${userId}`);
      const fetchedEvents = response.data.map((event) => ({
        id: event.eventId,
        title: event.eventTitle,
        start: event.eventStart,
        end: event.eventEnd || null,
        extendedProps: { description: event.eventDescription || '' },
      }));
      console.log(fetchedEvents)
      setEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events.');
    }
  };
     fetchInitialEvents(); 
  },[userId]); 

  // Delete an event
  const  handleDelete =  async () => {
    await axios.delete('http://localhost:8080/api/event/'+selectedEvent.id);
    setEvents((prevEvents) => prevEvents.filter((event) =>String(event.id) !== String(selectedEvent.id)));
    setSelectedEvent(null); // Close the dialog
    console.log(events)
  };

  //EDIT
  const handleEdit = () => {
    setIsEditing(true);
    setEditedEvent({ ...selectedEvent }); // Set the selected event for editing
  };
  
  const handleSaveEdit = async () => {
    const newErrors = {
      title: !editedEvent.title,
      description: !editedEvent.description,
      date: editedEvent.start < editedEvent.end ? true :false
    };
    setErrors(newErrors);
    if (newErrors.title || newErrors.description || !newErrors.date ) {
      setRequiredDivEdit(true);
      return;
    }
    await axios.put('http://localhost:8080/api/event/'+editedEvent.id, 
      {
      "eventTitle": editedEvent.title,
      "eventStart": new Date(editedEvent.start).toISOString(),
      "eventEnd": new Date(editedEvent.end).toISOString(),
      "eventDescription": editedEvent.description,
        "user_": {
            "connect": {
              "userId": userId
            }
        }
    });
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        String(event.id) === String(editedEvent.id) ? { ...editedEvent } : event
      )
    );
    setIsEditing(false); // Exit editing mode
    setSelectedEvent(null); // Close the dialog
    closePopup();
  };
  
  const closePopup = () => {
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const handleDateSelect = (selectInfo) => {
    setNewEvent({
      title: '',
      description:'',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
    setCreateEventDialog(true);
  };
  
  
  // Handle creating a new event
  const handleCreateEvent = async () => {
    const newErrors = {
      title: !newEvent.title,
      description: !newEvent.description,
      date: newEvent.start < newEvent.end ? true :false
    };
    setErrors(newErrors);
    if (newErrors.title || newErrors.description || !newErrors.date ) {
      setRequiredDiv(true);
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/event', {
        eventTitle: newEvent.title,
        eventStart: new Date(newEvent.start).toISOString(),
        eventEnd: new Date(newEvent.end).toISOString(),
        eventDescription: newEvent.description,
        user_: {
          connect: {
            userId: userId,
          },
        },
      });
      setEvents([...events, { id: response.data.eventId, ...newEvent }]);
      setCreateEventDialog(false);
      setRequiredDiv(false); // Hide the error message on success
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  

  const handleEventClick = (clickInfo) => {
    console.log(clickInfo.event.title)
    console.log(clickInfo.event.startStr)
    console.log(clickInfo)
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end : clickInfo.event.endStr,
      description: clickInfo.event.extendedProps.description || 'No description provided',
    });
    console.log(selectedEvent)
  };

  function formatToDateTimeLocal(dateString) {
    if (!dateString) return ''; // Handle empty values
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Get "yyyy-MM-ddTHH:mm"
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`; // Return formatted date (YYYY-MM-DD)
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 2); // Subtract 2 hours
    const hours = String(date.getHours()).padStart(2, '0'); // Adjusted hours
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes
    return `${hours}:${minutes}`; // Return formatted time (HH:MM)
  };
    
  return (
    <div className="demo-app">
      <div className="demo-app-main">
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="dayGridMonth"
            editable
            selectable
            selectMirror
            dayMaxEvents
            weekends={weekendsVisible}
            events={events} // Use the updated events state
            select={handleDateSelect}
            eventClick={handleEventClick}
          />
        )}
        <Dialog open={!!selectedEvent} onClose={closePopup}>
          <DialogContent >
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  label="Title"
                  value={editedEvent.title || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                  margin="normal"
                />
                {requiredDivEdit && errors.title && (
                <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>
                  Title is required
                </div>
                )}
                <TextField
                  fullWidth
                  label="Description"
                  value={editedEvent.description || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                  margin="normal"
                />
                {requiredDivEdit && errors.description && (
                 <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>
                  Description is required
                </div>
                )}
                <TextField
                  fullWidth
                  label="Start Date"
                  type="datetime-local"
                  value={formatToDateTimeLocal(editedEvent.start) || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, start: e.target.value })}
                  margin="normal"
                />
                 <TextField
                  fullWidth
                  label="End Date"
                  type="datetime-local"
                  value={formatToDateTimeLocal(editedEvent.end) || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, end: e.target.value })}
                  margin="normal"
                />
                {requiredDivEdit && !errors.date && (
                <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>
                  invalid 
                </div>
                )}
              </>
            ) : (
            <>
              <Typography variant="h6">{selectedEvent?.title}</Typography>
              <Typography variant="body2">{selectedEvent?.description}</Typography>
              <div className="space20"></div>
              <Typography variant="body1">
                <CalendarToday style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {formatDate(selectedEvent?.start)} {/* Display the formatted date */}
                <AccessTime style={{ verticalAlign: 'middle', marginLeft: '8px', marginRight: '4px' }} />
                {formatTime(selectedEvent?.start)} {/* Display the formatted time */}
              </Typography>
              <Typography variant="body1">
                <CalendarToday style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {formatDate(selectedEvent?.end)} {/* Display the formatted date */}
                <AccessTime style={{ verticalAlign: 'middle', marginLeft: '8px', marginRight: '4px' }} />
                {formatTime(selectedEvent?.end)} {/* Display the formatted time */}
                </Typography>
            </>
            )}
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button onClick={closePopup} color="#000000">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} color="primary">
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleEdit} color="primary">
                  Edit
                </Button>
                <Button onClick={handleDelete} color="error">
                  Delete
                </Button>
                <Button onClick={closePopup} color="#000000">
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
        <Dialog open={createEventDialog} onClose={() => setCreateEventDialog(false)}>
          <DialogContent>
           <TextField
             fullWidth
             label="Title"
             value={newEvent.title}
             onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
             margin="normal"
            />
            {requiredDiv && errors.title && (
              <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>
                Title is required
              </div>
            )}
            <TextField
              fullWidth
              label="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              margin="normal"
            />
            {requiredDiv && errors.description && (
              <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>
                Description is required
              </div>
            )}
            <TextField
              fullWidth
              label="Start Date"
              type="datetime-local"
              value={formatToDateTimeLocal(newEvent.start) || ''}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="End Date"
              type="datetime-local"
              value={formatToDateTimeLocal(newEvent.end) || ''}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              margin="normal"
            />
            {requiredDiv && !errors.date && (
              <div style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>
                invalid 
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateEventDialog(false)} color="#000000">
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} color="primary">
              Save
            </Button>

          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
