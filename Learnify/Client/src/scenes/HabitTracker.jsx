import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { LinearScale } from "chart.js";

const HabitTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState(["Drink Water", "Exercise", "Read a Book"]);
  const [completed, setCompleted] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [completedDates, setCompletedDates] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const handleHabitClick = async (habitId) => {
    const year = 2025;
    const month = 1; // January
    const apiUrl = `http://localhost:8080/api/trackHabit/monthlyTracker/${habitId}?year=${year}&month=${month}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Extract completed dates
      const completedDays = data
        .filter((entry) => entry.completeStatus === 1)
        .map((entry) => new Date(entry.trackDate).toDateString());

      setCompletedDates(completedDays);
      setSelectedHabit(habitId);
    } catch (error) {
      console.error("Error fetching habit data:", error);
    }
  };

  const daysInMonth = new Date(2025, 1, 0).getDate(); // Days in January 2025
  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(2025, 0, i).toDateString(); // January is month 0
      const isCompleted = completedDates.includes(currentDate);

      days.push(
        <motion.div
          key={i}
          className={`day ${isCompleted ? "completed" : ""}`}
          whileHover={{ scale: 1.1 }}
        >
          {i}
        </motion.div>
      );
    }
    return days;
  };
  const fetchHabitData = async (habitId) => {
    try {
      const response = await fetch(
        `http://${LOCALHOST}:8080/api/trackHabit/monthlyTracker/${habitId}?year=2025&month=1`
      );
      const data = await response.json();

      // Transform API response into markedDates format
      const dates= {};
      data.forEach((item) => {
        const date = item.trackDate.split("T")[0]; // Get YYYY-MM-DD
        dates[date] = {
          startingDay: true,
          endingDay: true,
          color: item.completeStatus === 1 ? "#1fd655" : "#e0e0e0",
          textColor: item.completeStatus === 1 ? "white" : "#757575",
        };
      });

      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching habit data:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const toggleCompletion = (habit) => {
    const dateKey = selectedDate.toDateString();
    setCompleted((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [habit]: !prev[dateKey]?.[habit],
      },
    }));
  };

  const addHabit = () => {
    // add a new habit name and description and reminder

    const newHabit = prompt("Enter a new habit:");
    const newHabitDescription = prompt("Enter a description for the habit:");
    const newHabitReminder = prompt("Enter a reminder time for the habit (HH:MM):");
    if (newHabit) {
      setHabits((prev) => [...prev, newHabit]);
    }
  };

  return (
    <Container className="mt-5" style={{ width: "100%"}}>
      <Row>
        <Col md={6} className="mb-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center">Habit Tracker</h2>
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </motion.div>
        </Col>

        <Col md={6}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <Card.Body>
                <Card.Title>Habits for {selectedDate.toDateString()}</Card.Title>
                <ul className="list-group list-group-flush">
                  {habits.map((habit) => (
                    <li
                      key={habit}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {habit}
                      <Button
                        variant={completed[selectedDate.toDateString()]?.[habit] ? "success" : "outline-secondary"}
                        onClick={() => toggleCompletion(habit)}
                      >
                        {completed[selectedDate.toDateString()]?.[habit] ? "Done" : "Mark Done"}
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button variant="primary" className="mt-3" onClick={addHabit}>
                  Add Habit
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
      <div className="habit-calendar">
      <div className="habit-list">
        {/* Example habit buttons */}
        <button onClick={() => handleHabitClick(18)}>Habit 18</button>
        <button onClick={() => handleHabitClick(24)}>Habit 24</button>
      </div>

      <div className="calendar-grid">{renderCalendar()}</div>

      <style jsx>{`
        .habit-calendar {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .habit-list button {
          margin: 5px;
          padding: 10px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .habit-list button:hover {
          background: #0056b3;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin-top: 20px;
        }
        .day {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .day.completed {
          background: green;
          color: white;
        }
      `}</style>
    </div>
    </Container>
  );
};

export default HabitTracker;
