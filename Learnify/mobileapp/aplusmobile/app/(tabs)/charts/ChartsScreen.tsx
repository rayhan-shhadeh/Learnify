import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const ChartScreen: React.FC = () => {
  // Dummy Data
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color
        strokeWidth: 2,
      },
    ],
    legend: ["Sales Over Time"],
  };

  const barData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        data: [25, 40, 35, 50],
      },
    ],
  };

  const pieData = [
    {
      name: "JavaScript",
      population: 215,
      color: "#FF5733",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Python",
      population: 130,
      color: "#C70039",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Java",
      population: 80,
      color: "#900C3F",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "C++",
      population: 60,
      color: "#581845",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const progressData = {
    data: [0.4, 0.6, 0.8],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Creative & Animated Charts</Text>
      </View>

      <Animatable.View
        animation="fadeInUp"
        delay={300}
        style={styles.chartContainer}
      >
        <Text style={styles.chartTitle}>Line Chart</Text>
        <LineChart
          data={lineData}
          width={width - 30}
          height={220}
          chartConfig={{
            backgroundColor: "#f1f1f1",
            backgroundGradientFrom: "#ff7e5f",
            backgroundGradientTo: "#feb47b",
            decimalPlaces: 2,

            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
              paddingRight: 15,
              marginRight: 15,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
        />
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        delay={600}
        style={styles.chartContainer}
      >
        <Text style={styles.chartTitle}>Bar Chart</Text>
        <BarChart
          data={barData}
          width={width - 30}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          chartConfig={{
            backgroundColor: "#f1f1f1",
            backgroundGradientFrom: "#4c669f",
            backgroundGradientTo: "#3b5998",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
        />
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        delay={900}
        style={styles.chartContainer}
      >
        <Text style={styles.chartTitle}>Pie Chart</Text>
        <PieChart
          data={pieData}
          width={width - 30}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          chartConfig={{
            backgroundColor: "#f1f1f1",
            backgroundGradientFrom: "#ff7e5f",
            backgroundGradientTo: "#feb47b",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
              paddingRight: 15,
              marginRight: 15,
            },
          }}
        />
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        delay={1200}
        style={styles.chartContainer}
      >
        <Text style={styles.chartTitle}>Progress Chart</Text>
        <ProgressChart
          data={progressData}
          width={width - 30}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundColor: "#f1f1f1",
            backgroundGradientFrom: "#4c669f",
            backgroundGradientTo: "#3b5998",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
              paddingRight: 15,
              marginRight: 20,
            },
          }}
        />
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  chartContainer: {
    marginBottom: 30,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});

export default ChartScreen;
