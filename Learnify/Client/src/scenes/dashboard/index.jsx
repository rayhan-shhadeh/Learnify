import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
  CardContent,
  CardActions,
  LinearProgress,
  Card,
  CardHeader,
} from "@mui/material";
import {
  Header,
  StatBox,
  LineChart,
  ProgressCircle,
  BarChart,
} from "../../components";
import {
  DownloadOutlined,
  Email,
  PersonAdd,
  PointOfSale,
  Traffic,
  NordicWalkingRounded,
  RunCircleSharp,
  AddCardRounded,
  CardMembershipOutlined,
  Quiz,
  DrawRounded,
  FolderOpenRounded,
  HistoryEduOutlined,
  HistoryRounded,
  HistorySharp,
  ManageHistoryRounded
} from "@mui/icons-material";

import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import React, {useEffect} from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import API  from '../../api/axios';
import { styled } from "@mui/system";

// Styled components for gradient cards
const GradientCard = styled(Card)(({ gradientColors }) => ({
  background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
  color: "#fff",
  marginBottom: "16px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
}));

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const [groupsCreated, setGroupsCreated] = React.useState("");
  const [falshcardsCount, setFalshcardsCount] = React.useState("");
  const [keytermsCount, setKeytermsCount] = React.useState("");
  const [quizzesCount, setQuizzesCount] = React.useState("");
  const [exploreTopicsCount, setExploreTopicsCount] = React.useState("");
  const [habitsDoneTodayCount, setHabitsDoneTodayCount] = React.useState("");
  const [habitsCount, setHabitsCount] = React.useState("");
  const [lastQuiz, setLastQuiz] = React.useState({});
  const [quizData, setQuizData] = React.useState([]);
const [data, setData] = React.useState([]);
useEffect(() => {
  const getUserStatistics = async () => {
    try {
      //const token = Cookies.get('token');
      const response = await API.get('profile/statistics/1');
      console.log("response: ",response);
setData(response.data.userStatistics);
console.log("data: ",data);
      } catch (error) {
        console.error(error);
        }
        
  }
  const getQuizHistory = async () => {
    const quizzes = await API.get(`quiz/history/1`);
    if (quizzes.status === 200) {
      const data = quizzes.data;
      if (data.quizzes && Array.isArray(data.quizzes)) {
        const mappedQuizzes = data.quizzes.map((quiz) => ({
          id: quiz.quizId,
          title: quiz.quizTitle,
          description: quiz.quizDescription,
          color: ["#f7cbca", "#85c4e4"], // You can customize colors dynamically if needed
          successRate: quiz.score,
        }));
        setQuizData(mappedQuizzes);
        setLastQuiz(mappedQuizzes[0]);
        console.log("mappedQuizzes: ",mappedQuizzes);
      }
    }
  };
  

  getUserStatistics();
  getQuizHistory();
}
, [groupsCreated, falshcardsCount, keytermsCount, quizzesCount, exploreTopicsCount, habitsDoneTodayCount, habitsCount, lastQuiz, quizData, data]);
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="Wlecome back Rayhana!" subtitle="Welcome to your dashboard" />
        {!isXsDevices && (
          <Box display="flex" alignItems="left"  marginLeft={5}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "transparent",
                color: "#ccc",
                fontSize: isMdDevices ? "14px" : "10px",
                // p: "10px 20px",
                mt: "18px",
                transition: ".3s ease",
                // ":hover": {
                //   bgcolor: colors.greenAccent[200],
                // },
                justifyContent: "flex-start",
                marginBottom: "40px",

              }}
              startIcon={
                <DotLottieReact
                  src="../../src/assets/animation/fire.json"
                  loop
                  autoplay
                  width={50}
                  height={50}
                  style={{ margin: "auto" }}
                />
              }
            >
              7 days of streak!
            </Button>
          </Box>
        )}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Statistic Items */}
        <Box
          gridColumn="span 3"
          bgcolor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            color={colors.gray[100]}>
            <DotLottieReact
              src="https://lottie.host/3ded2b6e-7456-4b4a-b421-38593a0c1d05/kyBibXVR6V.json"
              background="transparent"
              speed="1"
              loop
              autoplay
              style={{ width: "50%", height: "50%" }}
            />
            <Typography  fontWeight="bold" variant="h5" color={colors.greenAccent[500]}>Groups Created: {data.groupsCreated}</Typography>
              
            </Box>
        

        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.falshcardsCount}
            subtitle="falshcards Count"
            progress={data.falshcardsCount/10}
            increase={(data.falshcardsCount / 100 * 100).toFixed(2) + "%"}
            icon={
              <FolderOpenRounded
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.keytermsCount}
            subtitle="Key terms Generated"
            progress={data.keytermsCount}
            increase={data.keytermsCount}
            icon={
              <DrawRounded
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.quizzesCount}
            subtitle="Quizzes"
            progress={data.quizzesCount}
            increase={(data.quizzesCount / 3 * 100).toFixed(2) + "%"}
            icon={
              <Quiz
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ---------------- Row 2 ---------------- */}

        {/* Line Chart */}
        <Box
          gridColumn={
            isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
          }
          gridRow="span 2"
          bgcolor={colors.primary[400]}
        >
          <Box
            mt="25px"
            px="30px"
            display="flex"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.gray[100]}
              >
                Habits tracking
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {data.habitsCount}
              </Typography>
            </Box>
            <IconButton>
              <RunCircleSharp
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
              />
            </IconButton>
          </Box>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>


{/* Quick Actions Section */}
<Box
  gridColumn={isXlDevices ? "span 4" : "span 3"}
  gridRow="span 2"
  bgcolor={colors.primary[400]}
  overflow="auto"
>
  <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
    <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
      Quick Actions
    </Typography>
  </Box>

  <Box display="flex" justifyContent="space-around" p="20px" backgroundColor={colors.primary[500]} borderRadius={10} marginTop={2} marginBottom={2}> 
    {/* Quick Action: New Flashcards */}
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="80px" height="80px">
        <DotLottieReact
          src="../../src/assets/animation/files.json"
          background="transparent"
          speed="1"
          style={{ width: "100%", height: "100%" }}
          loop
          autoplay
        />
      </Box>
      <Typography color={colors.gray[100]} fontWeight="600">
        New Flashcards
      </Typography>
    </Box>

    {/* Quick Action: New Quiz */}
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="80px" height="80px">
        <DotLottieReact
          src="../../src/assets/animation/quiz2.json"
          background="transparent"
          speed="1"
          style={{ width: "100%", height: "100%" }}
          loop
          autoplay
        />
      </Box>
      <Typography color={colors.gray[100]} fontWeight="600">
        New Quiz
      </Typography>
    </Box>

    {/* Quick Action: Practice */}
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="80px" height="80px">
        <DotLottieReact
           src="../../src/assets/animation/practice.json"
          background="transparent"
          speed="1"
          style={{ width: "100%", height: "100%" }}
          loop
          autoplay
        />
      </Box>
      <Typography color={colors.gray[100]} fontWeight="600">
        Practice
      </Typography>
    </Box>

    {/* Quick Action: Explore */}
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="80px" height="80px">
        <DotLottieReact
          src="../../src/assets/animation/explore.json"
          background="transparent"
          speed="1"
          style={{ width: "100%", height: "100%" }}
          loop
          autoplay
        ></DotLottieReact>
      </Box>
      <Typography color={colors.gray[100]} fontWeight="600">
        Explore
      </Typography>
    </Box>
  </Box>
</Box>

{/* ----------------History QUIZ---------------- */}
    <Box 
        gridColumn={isXlDevices ? "span 7" : "span 6"}
        gridRow="span 10"
        bgcolor={colors.primary[400]}
        overflow="auto"
      >
        <ManageHistoryRounded color="1ce7ac" fontSize="large" />
      <Typography variant="h4" gutterBottom >
        
        Quiz History
      </Typography>
      {quizData.length === 0 ? (
        <Typography variant="body1">No quizzes found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {quizData.map((quiz) => (
            <Grid item xs={12} md={6} lg={4} key={quiz.id}>
              <GradientCard gradientColors={quiz.color}>
                <CardContent>
                  <Typography  component="div"
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600">
                    {quiz.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {quiz.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }} color="#333">
                    Success Rate: {quiz.successRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={quiz.successRate}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </GradientCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
      </Box>
    </Box> 
  );
}

export default Dashboard;
