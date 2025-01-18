import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const HabitTrackerCalendar = () => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        const response = await fetch(
          "http://192.168.68.61:8080/api/trackHabit/monthlyTracker/3?year=2025&month=1"
        );
        const data = await response.json();

        // Transform API response into markedDates format
        const dates: { [key: string]: any } = {};
        data.forEach((item: { trackDate: string; completeStatus: number }) => {
          const date = item.trackDate.split("T")[0]; // Get YYYY-MM-DD
          dates[date] = {
            startingDay: true,
            endingDay: true,
            color: item.completeStatus === 1 ? "#4caf50" : "#e0e0e0",
            textColor: item.completeStatus === 1 ? "white" : "#757575",
          };
        });

        setMarkedDates(dates);
      } catch (error) {
        console.error("Error fetching habit data:", error);
      }
    };

    fetchHabitData();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        markingType={"period"}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#f5f5f5",
          textSectionTitleColor: "#2e7d32",
          dayTextColor: "#000000",
          textDisabledColor: "#d9e1e8",
          arrowColor: "#2e7d32",
          todayTextColor: "#ff5722",
          textDayFontWeight: "500",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "700",
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
          radius: 10,
          padding: -15,
          margin: -8,
          selectedDayBackgroundColor: "#2e7d32",
          selectedDayTextColor: "#ffffff",
          textDayStyle: { margin: 5 },
          textDayFontSize: 10,
        }}
        style={{
          borderRadius: 50,
          padding: -50,
          margin: -8,
          transform: [{ scale: 1.5 }],
        }} // Zoom out the calendar}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  customDay: {
    borderRadius: 10, // Keep circles well-rounded
    padding: 5, // Add inner padding to separate circles
    margin: 2, // Add outer margin to prevent touching
  },
});

export default HabitTrackerCalendar;
