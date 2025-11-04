import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../Components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import API from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
const SalesOverview = () => {
  const [month, setMonth] = useState();
  const [year] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [dataCounts, setDataCounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
      setMonth(event.target.value);
  };

  useEffect(() => {
    const initializeUser = () => {
      const token = Cookies.get('token');
      console.log('Retrieved Token:', token);
      if (token) {
        try {
          console.log('Decoding token... from dashboard');
          const decoded = jwtDecode(token);
          setUserId(decoded.id);      
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
      if (!userId) {
        console.error('User ID is missing');
        return;
      }
      if (!token) {
        console.error('token is missing');
        navigate('auth/login');
      }
      try {
        const response = await API.post(
          `http://localhost:8080/api/trackHabit/allHabit/${userId}`,
          {"month":month , "year":year},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.data) {
          console.error('No data found');
          return;
        }
        const habits = response.data;
        const habitNames = habits.map((habit) => habit.habit);
        const habitCounts = habits.map((habit) => habit.count);
        setCategories(habitNames);
        setDataCounts(habitCounts);
      } catch (error) {
        console.error('Error fetching habit data:', error);
      }
    };
    if (month && year) fetchHabitData(); // Fetch data only if both month and year are selected
  }, [userId, month, year]);  


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
        borderRadius: [9],
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
    },
    yaxis: {
      title: { text: 'Habit Completions' },
        min: 0, // Always start from 0
        max: 30, // Fixed maximum value
        tickAmount: 6, // Number of ticks (e.g., 0, 5, 10, 15, 20, 25, 30)
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart = [{ name: 'Habit Completions', data: dataCounts }];

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
