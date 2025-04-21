import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
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
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

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
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isAnswered, showScore]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (!showSettings && !showScore) {
      setTimeLeft(60);
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

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://quizapi.io/api/v1/questions", {
        params: {
          category: quizSettings.language,
          limit: quizSettings.numberOfQuestions,
          difficulty: quizSettings.difficulty,
        },
        headers: {
          "X-RapidAPI-Key": "38193c3e75mshf11ad3508735799p1f18e2jsn83d47d06541b",
          "X-RapidAPI-Host": "quizapi.io"
        },
      });

      const formattedQuestions = response.data.map((q, index) => {
        const options = Object.entries(q.answers)
          .filter(([key, value]) => value !== null)
          .map(([key, text], i) => ({
            id: i + 1,
            text,
            isCorrect: q.correct_answers[`${key}_correct`] === "true"
          }));

        return {
          id: index + 1,
          question: q.question,
          options,
        };
      });

      setQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions from RapidAPI. Try again later.");
      setShowSettings(true);
    }
    setIsLoading(false);
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
    setTimeLeft(60);
    setTimerActive(false);
    setTimerExpired(false);
  };

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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <LuggageIcon />
            <h1>Code Quiz</h1>
          </div>
        </div>
      </header>

      <main className="app-main">
        {showSettings ? (
          <div className="start-screen">
            <h2>Welcome to Code Quiz!</h2>
            <p>Test your programming knowledge with our interactive quiz.</p>
            <div className="quiz-settings">
              <div className="setting-item">
                <label htmlFor="numberOfQuestions">Number of Questions:</label>
                <select
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  value={quizSettings.numberOfQuestions}
                  onChange={handleSettingsChange}
                  className="language-select"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>
              <div className="setting-item">
                <label htmlFor="language">Programming Language:</label>
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
                </select>
              </div>
              <div className="setting-item">
                <label htmlFor="difficulty">Difficulty Level:</label>
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
              Start Quiz
            </button>
          </div>
        ) : showScore ? (
          <div className="score-section">
            <h2>Quiz Complete!</h2>
            <p>
              You scored {score} out of {questions.length}
            </p>
            <button onClick={handleRestart} className="restart-button">
              Restart Quiz
            </button>
          </div>
        ) : isLoading ? (
          <div className="loading">Loading questions...</div>
        ) : questions.length > 0 ? (
          <div className="quiz-section">
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
              <span className="question-counter">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="timer-container">
              <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
                Time: {formatTime(timeLeft)}
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
                  Time's up! The correct answer was: {questions[currentQuestionIndex].options.find(opt => opt.isCorrect).text}
                </div>
              )}
            </div>

            <div className="navigation-buttons">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="nav-button prev-button"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="nav-button next-button"
                disabled={!isAnswered}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className="error-message">
            <h2>Error Loading Questions</h2>
            <p>Please try again with different settings.</p>
            <button onClick={() => setShowSettings(true)} className="restart-button">
              Back to Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
