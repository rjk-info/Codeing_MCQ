import React, { useState, useEffect } from "react";
import "./App.css";
import { getQuestionsForLanguage } from "./quizQuestions";
import Auth from "./components/Auth";
import Analytics from "./components/Analytics";
import { quizAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizSettings, setQuizSettings] = useState({
    numberOfQuestions: 5,
    language: "javascript",
    difficulty: "medium"
  });
  const [showSettings, setShowSettings] = useState(true);
  // Timer states
  const [timeLeft, setTimeLeft] = useState(20); // Changed from 60 to 20 seconds
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  // Add isAdmin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Check if user is admin when they log in
  useEffect(() => {
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowSettings(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0 && !isAnswered && !showScore) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      setTimerExpired(true);
      setIsAnswered(true);
      setTimerActive(false);
      clearInterval(interval);
      
      // Automatically move to next question after a short delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
          setIsAnswered(false);
          setTimeLeft(20);
          setTimerActive(true);
          setTimerExpired(false);
        } else {
          setShowScore(true);
        }
      }, 1000); // 1 second delay to show the "Time's up" message
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isAnswered, showScore, currentQuestionIndex, questions.length]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (!showSettings && !showScore) {
      setTimeLeft(20); // Changed from 60 to 20 seconds
      setTimerActive(true);
      setTimerExpired(false);
    }
  }, [currentQuestionIndex, showSettings, showScore]);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setQuizSettings(prev => ({
      ...prev,
      [name]: name === 'numberOfQuestions' ? parseInt(value, 10) : value
    }));
  };

  const startQuiz = () => {
    setShowSettings(false);
    loadQuestions();
  };

  const loadQuestions = () => {
    setIsLoading(true);
    try {
      const selectedQuestions = getQuestionsForLanguage(
        quizSettings.language,
        quizSettings.difficulty,
        quizSettings.numberOfQuestions
      );

      if (selectedQuestions.length === 0) {
        throw new Error("No questions available for the selected settings");
      }

      if (selectedQuestions.length < quizSettings.numberOfQuestions) {
        console.warn(`Only ${selectedQuestions.length} questions available for ${quizSettings.language} at ${quizSettings.difficulty} difficulty`);
      }

      setQuestions(selectedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowScore(false);
      setScore(0);
    } catch (error) {
      console.error("Error loading questions:", error.message);
      alert("Failed to load questions. Please try different settings.");
      setShowSettings(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerClick = (optionId) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);
    setTimerActive(false);
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionObj = currentQuestion.options.find(
      (opt) => opt.id === optionId
    );
    if (selectedOptionObj.isCorrect) {
      setScore(score + 1);
    }
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
  };

  const handleSkip = () => {
    setSkippedQuestions(prev => new Set([...prev, currentQuestionIndex]));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowSettings(true);
    setTimeLeft(20); // Changed from 60 to 20 seconds
    setTimerActive(false);
    setTimerExpired(false);
  };

  // Save quiz result when quiz is completed
  useEffect(() => {
    const saveResult = async () => {
      if (showScore && user && questions.length > 0) {
        try {
          await quizAPI.submitAnswer({
            language: quizSettings.language,
            score: score,
            totalQuestions: questions.length
          });
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      }
    };

    saveResult();
  }, [showScore, user, score, questions.length, quizSettings.language]);

  const LuggageIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 6.5H17V3.5C17 2.95 16.55 2.5 16 2.5H8C7.45 2.5 7 2.95 7 3.5V6.5H5C3.9 6.5 3 7.4 3 8.5V19.5C3 20.6 3.9 21.5 5 21.5H19C20.1 21.5 21 20.6 21 19.5V8.5C21 7.4 20.1 6.5 19 6.5ZM9 3.5H15V6.5H9V3.5ZM19 19.5H5V8.5H19V19.5Z"
        fill="currentColor"
      />
      <path
        d="M12 17.5C13.66 17.5 15 16.16 15 14.5C15 12.84 13.66 11.5 12 11.5C10.34 11.5 9 12.84 9 14.5C9 16.16 10.34 17.5 12 17.5Z"
        fill="currentColor"
      />
    </svg>
  );

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>🚀 Coding Quiz 💻</h1>
          </div>
          <div className="user-info">
            <span>Welcome, {user.username} 👋</span>
            {isAdmin && (
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)} 
                className="analytics-button"
              >
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'} 📊
              </button>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout 🚪
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {!user ? (
          <Auth onAuth={handleAuth} />
        ) : showAnalytics ? (
          <Analytics />
        ) : showSettings ? (
          <div className="start-screen">
            <h2>Welcome to Code Quiz! 🎯</h2>
            <p>Test your programming knowledge with our interactive quiz. Choose your settings below:</p>
            <div className="quiz-settings">
              <div className="setting-item">
                <label htmlFor="numberOfQuestions">📝 Number of Questions:</label>
                <input
                  type="number"
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  value={quizSettings.numberOfQuestions}
                  onChange={handleSettingsChange}
                  min="1"
                  max="50"
                  className="number-input"
                  placeholder="Enter number of questions (1-50)"
                />
              </div>
              <div className="setting-item">
                <label htmlFor="language">💻 Programming Language:</label>
                <select
                  id="language"
                  name="language"
                  value={quizSettings.language}
                  onChange={handleSettingsChange}
                  className="language-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="ruby">Ruby</option>
                  <option value="php">PHP</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>
              <div className="setting-item">
                <label htmlFor="difficulty">🎯 Difficulty Level:</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={quizSettings.difficulty}
                  onChange={handleSettingsChange}
                  className="language-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <button onClick={startQuiz} className="start-button">
              Start Quiz 🚀
            </button>
          </div>
        ) : showScore ? (
          <div className="score-section">
            <h2>Quiz Complete! 🎉</h2>
            <p>
              You scored {score} out of {questions.length} questions correctly! 🏆
            </p>
            <button onClick={handleRestart} className="restart-button">
              Try Again 🔄
            </button>
          </div>
        ) : isLoading ? (
          <div className="loading">Loading questions... ⏳</div>
        ) : questions.length > 0 ? (
          <div className="quiz-section">
            <div className="quiz-layout">
              <div className="quiz-content">
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                  <span className="question-counter">
                    Question {currentQuestionIndex + 1} of {questions.length} 📊
                  </span>
                </div>

                <div className="timer-container">
                  <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
                    ⏱️ Time: {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="question-container">
                  <h2 className="question-text">
                    {questions[currentQuestionIndex].question}
                  </h2>
                  <div className="answer-section">
                    {questions[currentQuestionIndex].options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerClick(option.id)}
                        className={`answer-button ${
                          selectedOption === option.id
                            ? option.isCorrect
                              ? "correct"
                              : "incorrect"
                            : ""
                        } ${isAnswered ? "disabled" : ""}`}
                        disabled={isAnswered}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                  {timerExpired && (
                    <div className="timer-expired-message">
                      ⚠️ Time's up! The correct answer was: {questions[currentQuestionIndex].options.find(opt => opt.isCorrect).text}
                    </div>
                  )}
                </div>

                <div className="navigation-buttons">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="nav-button prev-button"
                  >
                    ⬅️ Previous
                  </button>
                  <button
                    onClick={handleSkip}
                    className="nav-button skip-button"
                    disabled={isAnswered}
                  >
                    ⏭️ Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="nav-button next-button"
                    disabled={!isAnswered}
                  >
                    {currentQuestionIndex === questions.length - 1 ? "✅ Finish" : "Next ➡️"}
                  </button>
                  <button
                    onClick={() => setShowScore(true)}
                    className="nav-button submit-button"
                    disabled={!isAnswered}
                  >
                    📊 Submit
                  </button>
                  <button
                    onClick={handleRestart}
                    className="nav-button restart-button"
                  >
                    🔄 Restart
                  </button>
                </div>
              </div>
              <div className="question-dashboard">
                <h3>Question Dashboard 📋</h3>
                <div className="dashboard-grid">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setSelectedOption(null);
                        setIsAnswered(answeredQuestions.has(index));
                      }}
                      className={`dashboard-item ${
                        currentQuestionIndex === index ? 'active' : ''
                      } ${answeredQuestions.has(index) ? 'answered' : ''} ${
                        skippedQuestions.has(index) ? 'skipped' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="error-message">
            <h2>❌ Error Loading Questions</h2>
            <p>Please try again with different settings.</p>
            <button onClick={() => setShowSettings(true)} className="restart-button">
              Back to Settings 🔙
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
