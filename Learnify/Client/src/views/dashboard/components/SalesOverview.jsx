import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import API from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
const SalesOverview = () => {
  const [month, setMonth] = useState('');
  const [year] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [dataCounts, setDataCounts] = useState([]);
  const [userId, setUserId] = useState(null);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  useEffect(() => {
    const initializeUser = () => {
const token = Cookies.get('token');
      // const token = localStorage.getItem('authToken');
      console.log('Retrieved Token:', token);

      if (token) {
        try {
          console.log('Decoding token...');
          const decoded = jwtDecode(token);
          setUserId(decoded.userId); // Adjust this based on the token structure
          console.log('Decoded Token:', decoded);
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      } else {
        console.error('No token found');
      }
    };
    initializeUser();
  }, []); // Only run once on component mount

  useEffect(() => {
    const fetchHabitData = async () => {
      const token = Cookies.get('token');
      if (!userId || !token) {
        console.error('User ID or token is missing');
        return;
      }

      try {
        const response = await API.post(
          `trackHabit/allHabit/${userId}`,
          { month, year },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data) {
          console.error('No data found');
          return;
        }

        const habits = response.data; // Ensure the response is correctly parsed
        const habitNames = habits.map((habit) => habit.habit);
        const habitCounts = habits.map((habit) => habit.count);

        setCategories(habitNames);
        setDataCounts(habitCounts);
      } catch (error) {
        console.error('Error fetching habit data:', error);
      }
    };

    if (month) fetchHabitData(); // Fetch data only if month is selected
  }, [month, year, userId]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: true },
      height: 370,
    },
    colors: [primary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: [4],
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
    },
    yaxis: {
      title: { text: 'Habit Count' },
      tickAmount: 5,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart = [{ name: 'Habit Count', data: dataCounts }];

  return (
    <DashboardCard
      title="Habit Tracking"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
        >
          <MenuItem value={10}>October 2024</MenuItem>
          <MenuItem value={11}>November 2024</MenuItem>
          <MenuItem value={12}>December 2024</MenuItem>
        </Select>
      }
    >
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height="370px"
      />
    </DashboardCard>
  );
};

export default SalesOverview;
