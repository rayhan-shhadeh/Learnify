import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import Animated from "react-native-reanimated";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

const UserProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [keytermsCount, setKeytermsCount] = useState(0);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [exploreTopicsCount, setExploreTopicsCount] = useState(0);
  const [habitsDoneTodayCount, setHabitsDoneTodayCount] = useState(0);
  const [habitsCount, setHabitsCount] = useState(0);
  const [habitsDoneCount, setHabitsDoneCount] = useState(0);
  const [habitsMissedCount, setHabitsMissedCount] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "http://192.168.68.61:8080/api/profile/statistics/1"
        );
        setData(response.data.userStatistics);
        setFlashcardsCount(response.data.flashcardsCount);
        setKeytermsCount(response.data.keytermsCount);
        setQuizzesCount(response.data.quizzesCount);
        setExploreTopicsCount(response.data.exploreTopicsCount);
        setHabitsDoneTodayCount(response.data.habitsDoneTodayCount);
        setHabitsCount(response.data.habitsCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005f99" />
      </View>
    );
  }

  // Pie chart data
  const pieData = [
    {
      name: "Flashcards",
      value: data.falshcardsCount,
      color: "#4caf50",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
    {
      name: "Keyterms",
      value: data.keytermsCount,
      color: "#ff9800",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
    {
      name: "Quizzes",
      value: data.quizzesCount,
      color: "#f44336",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
    {
      name: "Explore Topics",
      value: data.exploreTopicsCount,
      color: "#2196f3",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
  ];

  // Line chart data
  const lineChartData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"],
    datasets: [
      {
        data: [2, 4, 6, 3, 5, data.habitsDoneTodayCount],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Blue color
        strokeWidth: 2,
      },
    ],
  };

  // Bar chart data
  const barChartData = {
    labels: ["Habits Done", "Total Habits"],
    datasets: [
      {
        data: [data.habitsDoneTodayCount, data.habitsCount],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>User Statistics</Text>

      {/* Pie Chart */}
      <Text style={styles.chartTitle}>Task Distribution</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* Bar Chart */}
      <Text style={styles.chartTitle}>Habit Completion</Text>
      <BarChart
        data={barChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=""
      />

      {/* Line Chart */}
      <Text style={styles.chartTitle}>Habits Done Over Time</Text>
      <LineChart
        data={lineChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#blue",
  backgroundGradientTo: "#005f99",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005f99",
    marginVertical: 10,
    textAlign: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#005f99",
  },
  chart: {
    marginVertical: 10,
  },
});

export default UserProfile;
