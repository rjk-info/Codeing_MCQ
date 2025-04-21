import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function App() {
  const [filters, setFilters] = useState({
    language: "javascript",
    difficulty: "all",
    category: "all",
    questionType: "all",
  });
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyState, setEmptyState] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language is English

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Map programming languages to Trivia API categories
  const categoryMap = {
    javascript: 18, // Science: Computers
    python: 18,    // Science: Computers
    java: 18,      // Science: Computers
    csharp: 18,    // Science: Computers
    ruby: 18,      // Science: Computers
    php: 18,       // Science: Computers
    swift: 18,     // Science: Computers
    kotlin: 18,    // Science: Computers
    go: 18,        // Science: Computers
    rust: 18,      // Science: Computers
  };

  const difficultyMap = {
    all: "",
    easy: "easy",
    medium: "medium",
    hard: "hard",
  };

  const buildApiUrl = () => {
    const categoryId = categoryMap[filters.language];
    if (!categoryId) {
      throw new Error("Selected language is not supported");
    }
    
    // Base URL with required parameters
    let url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${categoryId}`;

    // Add difficulty if selected
    if (filters.difficulty !== "all") {
      url += `&difficulty=${difficultyMap[filters.difficulty]}`;
    }
    
    // Add type if selected
    if (filters.questionType !== "all") {
      url += `&type=${filters.questionType === "multiple" ? "multiple" : "boolean"}`;
    }
    
    console.log("API URL:", url);
    return url;
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const fetchQuestionsFromApi = async () => {
    try {
      const url = buildApiUrl();
      console.log("Fetching from API URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.response_code !== 0) {
        throw new Error(`API Error: ${data.response_code}`);
      }
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`No questions found for ${filters.language}. Try a different language or category.`);
      }

      const mappedQuestions = data.results.map((item, index) => {
        const options = [
          { id: 1, text: decodeHtml(item.correct_answer), isCorrect: true },
          ...item.incorrect_answers.map((answer, i) => ({
            id: i + 2,
            text: decodeHtml(answer),
            isCorrect: false
          }))
        ];

        return {
          question: decodeHtml(item.question),
          options: shuffleArray(options),
        };
      });

      return mappedQuestions;
    } catch (error) {
      console.error("API Error:", error);
      setErrorMessage(error.message);
      throw error;
    }
  };

  const fetchQuestions = async () => {
    try {
      console.log("Attempting to fetch questions from API...");
      const apiQuestions = await fetchQuestionsFromApi();
      console.log(`Successfully fetched ${apiQuestions.length} questions from API`);
      
      if (apiQuestions.length === 0) {
        setEmptyState(true);
        throw new Error(`No questions found for ${filters.language}. Try a different language or category.`);
      }
      
      setEmptyState(false);
      return apiQuestions;
    } catch (error) {
      console.error("Error fetching from API:", error);
      setEmptyState(true);
      throw error;
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setIsLoading(true);
    setErrorMessage("");
    
    fetchQuestions()
      .then(questions => {
        if (questions.length === 0) {
          setErrorMessage("No questions found for current filters.");
          setQuizQuestions([]);
          setQuizStarted(false);
          return;
        }
        setQuizQuestions(shuffleArray(questions));
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setFeedback("");
        setCorrectCount(0);
        setIsOptionSelected(false);
      })
      .catch(error => {
        console.error("Error in handleStartQuiz:", error);
        setErrorMessage(error.message);
        setQuizStarted(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOptionClick = useCallback(
    (option) => {
      if (isOptionSelected) return;
      setIsOptionSelected(true);
      setSelectedOption(option.id);
      setFeedback(option.isCorrect ? "Correct! 🎉" : "Wrong! ❌");
      if (option.isCorrect) setCorrectCount((prev) => prev + 1);
    },
    [isOptionSelected]
  );

  const resetQuestionState = useCallback(() => {
    setSelectedOption(null);
    setFeedback("");
    setIsOptionSelected(false);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetQuestionState();
    }
  }, [currentQuestionIndex, quizQuestions.length, resetQuestionState]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      resetQuestionState();
    }
  }, [currentQuestionIndex, resetQuestionState]);

  const resetQuiz = useCallback(() => {
    setQuizStarted(false);
    setErrorMessage("");
    setEmptyState(false);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Luggage icon SVG
  const LuggageIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="24" 
      height="24"
      fill="currentColor"
      className="luggage-icon"
    >
      <path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1zM9 3h6v3H9V3zm8 14H7V7h10v10z"/>
      <path d="M12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  );

  return (
    <div className="quiz-container" role="main">
      <header className="quiz-header">
        <div className="logo-container">
          <LuggageIcon />
          <h1>Code Quiz</h1>
        </div>
        <div className="language-selector">
          <label htmlFor="language">Language: </label>
          <select 
            id="language" 
            value={language} 
            onChange={handleLanguageChange}
            aria-label="Select interface language"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </header>

      {!quizStarted ? (
        <div className="start-screen">
          <h2>Welcome to Code Quiz</h2>
          <p>Test your programming knowledge with our interactive quiz!</p>
          
          {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}
          {emptyState && <div className="empty-state">No questions found for current filters.</div>}
          
          <div className="quiz-settings">
            <div className="input-group">
              <label htmlFor="numQuestions">Number of Questions (1-50):</label>
              <input
                type="number"
                id="numQuestions"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => {
                  const value = Math.min(50, Math.max(1, Number(e.target.value) || 1));
                  setNumQuestions(value);
                }}
                aria-label="Number of questions"
                disabled={isLoading}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="languageSelect">Select Programming Language:</label>
              <select
                id="languageSelect"
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                aria-label="Select programming language"
                className="language-dropdown"
                disabled={isLoading}
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
            
            <div className="input-group">
              <label htmlFor="difficultySelect">Select Difficulty:</label>
              <select
                id="difficultySelect"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                aria-label="Select difficulty"
                className="difficulty-dropdown"
                disabled={isLoading}
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="input-group">
              <label htmlFor="questionTypeSelect">Select Question Type:</label>
              <select
                id="questionTypeSelect"
                value={filters.questionType}
                onChange={(e) => handleFilterChange("questionType", e.target.value)}
                aria-label="Select question type"
                className="questiontype-dropdown"
                disabled={isLoading}
              >
                <option value="all">All</option>
                <option value="multiple">Multiple Choice</option>
                <option value="true_false">True / False</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleStartQuiz}
            className="start-btn"
            aria-label="Start quiz"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Start Quiz"}
          </button>
        </div>
      ) : (
        <div className="quiz-content">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
            <div className="question-counter">
              Question <span className="current">{currentQuestionIndex + 1}</span> of <span className="total">{quizQuestions.length}</span>
            </div>
          </div>

          <div className="quiz-question-container">
            <h2 className="quiz-question" tabIndex="0">
              {currentQuestion?.question}
            </h2>

            <ul className="quiz-options" role="list">
              {currentQuestion?.options.map((option) => (
                <li
                  key={option.id}
                  className={`quiz-option
                    ${selectedOption === option.id ?
                      (option.isCorrect ? "correct" : "wrong") : ""}
                    ${isOptionSelected ? "disabled" : ""}`}
                  onClick={() => handleOptionClick(option)}
                  onKeyDown={(e) => e.key === "Enter" && handleOptionClick(option)}
                  role="button"
                  tabIndex="0"
                  aria-pressed={selectedOption === option.id}
                  aria-disabled={isOptionSelected}
                >
                  {option.text}
                </li>
              ))}
            </ul>

            {feedback && (
              <div className={`quiz-feedback ${feedback.includes("🎉") ? "correct" : "wrong"}`} role="alert">
                {feedback}
              </div>
            )}
          </div>

          <div className="navigation-buttons">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              aria-label="Previous question"
              className="nav-btn prev-btn"
            >
              ← Previous
            </button>
            <button
              onClick={resetQuiz}
              className="reset-btn"
              aria-label="Restart quiz"
            >
              Restart
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex + 1 >= quizQuestions.length}
              aria-label="Next question"
              className="nav-btn next-btn"
            >
              Next →
            </button>
          </div>

          {currentQuestionIndex + 1 === quizQuestions.length && isOptionSelected && (
            <div className="quiz-result" role="status">
              <h3>Quiz Completed! 🏆</h3>
              <p>Your Score: <strong>{correctCount}/{quizQuestions.length}</strong></p>
              <button
                onClick={resetQuiz}
                className="reset-btn"
                aria-label="Try quiz again"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
