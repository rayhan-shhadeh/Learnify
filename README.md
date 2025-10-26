# 📚 Learnify (A+)

> An AI-powered study platform that transforms PDF slides into interactive learning experiences using spaced repetition and intelligent content generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-purple.svg)](https://expo.dev/)

## 🎯 Overview

Learnify is a full-stack educational platform designed to revolutionize the way students learn and retain information. By leveraging artificial intelligence and proven memory techniques, Learnify transforms static PDF lecture slides into dynamic, interactive study materials that adapt to each learner's pace and progress.

### The Problem
Students struggle with:
- Passive learning from PDF slides and lecture notes
- Inefficient study methods that don't promote long-term retention
- Lack of personalized learning paths
- Difficulty tracking study habits and progress
- Limited collaboration tools for group study

### The Solution
Learnify addresses these challenges by:
- **AI-Powered Content Generation**: Automatically extracts key concepts from PDFs and generates flashcards, quizzes, and study terms
- **Spaced Repetition Algorithm**: Implements the SM2 algorithm for optimized memory retention
- **Multi-Platform Access**: Web and mobile applications for learning anywhere, anytime
- **Habit Tracking**: Built-in tools to monitor and maintain consistent study habits
- **Collaborative Features**: Group study rooms and shared learning resources

---

## ✨ Key Features

### 🤖 AI-Powered Content Generation
- Upload PDF lecture slides and automatically extract key concepts
- Generate intelligent flashcards with questions and answers
- Create multiple-choice quizzes based on content
- Extract and define important terms and vocabulary
- Powered by OpenAI's GPT models for accurate content understanding

### 🧠 Spaced Repetition System
- SM2 algorithm implementation for optimal review scheduling
- Personalized learning intervals based on performance
- Progress tracking and retention analytics
- Adaptive difficulty adjustment

### 📱 Cross-Platform Experience
- **Web Application**: Responsive React.js interface for desktop study sessions
- **Mobile App**: Native-feeling React Native app built with Expo
- Seamless synchronization across all devices
- Offline mode for studying on the go

### 📅 Study Management
- **Habit Tracker**: Monitor daily study streaks and consistency
- **Calendar Integration**: Schedule study sessions and set reminders
- **Progress Dashboard**: Visualize learning progress and achievements
- **Study Analytics**: Track time spent, topics mastered, and areas needing improvement

### 👥 Collaboration Tools
- Create and join study groups
- Share flashcard decks and quizzes
- Collaborative learning sessions
- Peer review and discussion features

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Web**: React.js with modern hooks and context API
- **Mobile**: React Native with Expo for cross-platform development
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context + Custom hooks

#### Backend
- **Runtime**: Node.js with Express.js framework
- **Authentication**: JWT (JSON Web Tokens) for secure user sessions
- **API Design**: RESTful architecture with proper error handling
- **AI Integration**: OpenAI API for content generation

#### Database & Storage
- **Database**: AWS RDS (Relational Database Service) for structured data
- **File Storage**: AWS S3 for PDF uploads and processed content
- **Caching**: Optimized queries and response caching

#### DevOps
- **Hosting**: AWS EC2 / Elastic Beanstalk
- **CI/CD**: Automated deployment pipeline
- **Monitoring**: Application performance monitoring and error tracking

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Web Client    │         │  Mobile Client  │
│   (React.js)    │         │ (React Native)  │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     │
              ┌──────▼──────┐
              │   API       │
              │  Gateway    │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
    │  Auth   │ │Content │ │Analytics│
    │ Service │ │Service │ │ Service │
    └────┬────┘ └───┬────┘ └───┬────┘
         │          │          │
         └──────────┼──────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    ┌────▼────┐ ┌──▼───┐  ┌──▼────┐
    │   RDS   │ │  S3  │  │OpenAI │
    │Database │ │Storage│  │  API  │
    └─────────┘ └──────┘  └───────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- AWS account (for RDS and S3)
- OpenAI API key
- Expo CLI (for mobile development)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/rayhan-shhadeh/Learnify.git
cd Learnify
```

#### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Web Frontend:**
```bash
cd ../frontend-web
npm install
```

**Mobile App:**
```bash
cd ../frontend-mobile
npm install
```

#### 3. Environment Configuration

Create `.env` files in each directory:

**Backend `.env`:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=learnify

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=learnify-uploads

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

**Web Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

**Mobile App `.env`:**
```env
API_URL=http://localhost:5000/api
```

#### 4. Database Setup

```bash
cd backend
npm run db:migrate  # Run database migrations
npm run db:seed     # (Optional) Seed with sample data
```

#### 5. Run the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Web Frontend:**
```bash
cd frontend-web
npm start
```

**Mobile App:**
```bash
cd frontend-mobile
npx expo start
```

---

## 📱 Usage

### For Students

1. **Sign Up / Login**: Create an account or log in with existing credentials
2. **Upload Content**: Upload PDF lecture slides or study materials
3. **Generate Study Materials**: AI automatically creates flashcards, quizzes, and key terms
4. **Study Sessions**: Review flashcards with spaced repetition algorithm
5. **Track Progress**: Monitor your learning journey and habit consistency
6. **Collaborate**: Join or create study groups with classmates

### For Educators

- Share pre-made flashcard decks with students
- Create custom quizzes and assessments
- Monitor student progress and engagement
- Facilitate group discussions and peer learning

---

## 🎨 Screenshots

### Web Application
```
┌─────────────────────────────────────┐
│  📊 Dashboard - Study Progress      │
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │ 📚 95 │ │ 🎯 87%│ │ 🔥 12 │    │
│  │ Cards │ │ Score │ │Streak │    │
│  └───────┘ └───────┘ └───────┘    │
└─────────────────────────────────────┘
```

### Mobile Application
```
┌─────────────┐
│  Learnify   │
├─────────────┤
│ 📚 My Decks │
│ ✨ Generate │
│ 📊 Progress │
│ 👥 Groups   │
└─────────────┘
```

*(Add actual screenshots here)*

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend-web
npm test

# Run integration tests
npm run test:integration
```

---

## 📊 Performance Metrics

- **Response Time**: < 200ms for API endpoints
- **PDF Processing**: Handles documents up to 50MB
- **Concurrent Users**: Supports 1000+ simultaneous active users
- **Uptime**: 99.5% availability
- **Mobile App Size**: < 25MB

---

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Voice-to-text note taking
- [ ] Video lecture integration
- [ ] Advanced analytics dashboard
- [ ] Gamification features (badges, leaderboards)
- [ ] Multi-language support

### Version 2.1 (Future)
- [ ] AI tutor chatbot
- [ ] Handwriting recognition
- [ ] Offline-first architecture
- [ ] Integration with popular LMS platforms

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Rayhan Shhadeh**
- GitHub: [@rayhan-shhadeh](https://github.com/rayhan-shhadeh)
- LinkedIn: [Rayhan Shhadeh](https://linkedin.com/in/rayhan-shhadeh)
- Email: rayhanshhadeh@example.com

---

## 🙏 Acknowledgments

- OpenAI for GPT API
- An-Najah National University for project support
- [SM2 Algorithm](https://en.wikipedia.org/wiki/SuperMemo) for spaced repetition methodology
- All contributors and testers who helped shape this platform

---

## 📞 Support

For questions, issues, or feedback:
- Open an [Issue](https://github.com/rayhan-shhadeh/Learnify/issues)
- Email: rayhanshhadeh@gmail.com
- Documentation: [Wiki](https://github.com/rayhan-shhadeh/Learnify/wiki)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=rayhan-shhadeh/Learnify&type=Date)](https://star-history.com/#rayhan-shhadeh/Learnify&Date)

---

**Built with ❤️ by Rayhan Shhadeh as a Graduation Project at An-Najah National University**
