import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import { baseQuizData, generateQuizQuestions } from "./quizData";

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

  const languageTagMap = {
    javascript: "javascript",
    python: "python",
    java: "java",
    csharp: "csharp",
    ruby: "ruby",
  };

  const difficultyMap = {
    all: "",
    easy: "easy",
    medium: "medium",
    hard: "hard",
  };

  const categoryMap = {
    all: "",
    algorithms: "algorithms",
    data_structures: "data_structures",
    databases: "databases",
  };

  const questionTypeMap = {
    all: "",
    multiple: "multiple",
    true_false: "boolean",
  };

  const apiKey = process.env.REACT_APP_QUIZ_API_KEY;
  if (!apiKey) {
    console.error("API key is missing. Please check your .env file.");
  }

  const buildApiUrl = () => {
    const tag = languageTagMap[filters.language];
    if (!tag) {
      throw new Error("Selected language is not supported by the API");
    }
    if (!apiKey) {
      throw new Error("API key is missing");
    }
    
    // Base URL with required parameters
    let url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&tags=${tag}&limit=${numQuestions}`;

    // Add optional parameters only if they're not set to "all"
    if (filters.difficulty !== "all") {
      url += `&difficulty=${difficultyMap[filters.difficulty]}`;
    }
    if (filters.category !== "all") {
      url += `&category=${categoryMap[filters.category]}`;
    }
    if (filters.questionType !== "all") {
      url += `&question_type=${questionTypeMap[filters.questionType]}`;
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

  const filterDuplicates = (questions) => {
    const seen = new Set();
    return questions.filter((q) => {
      const key = q.question;
      if (seen.has(key)) {
        return false;
      } else {
        seen.add(key);
        return true;
      }
    });
  };

  const fetchQuestionsFromApi = async () => {
    try {
      const url = buildApiUrl();
      console.log("Fetching from API URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your .env file.");
        } else if (response.status === 429) {
          throw new Error("API rate limit exceeded. Please try again later.");
        } else {
          throw new Error(`API request failed with status ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No questions found for ${filters.language}. Try a different language or category.`);
      }
      
      const uniqueQuestionsMap = new Map();
      data.forEach((item) => {
        if (!uniqueQuestionsMap.has(item.question)) {
          uniqueQuestionsMap.set(item.question, item);
        }
      });
      const uniqueQuestions = Array.from(uniqueQuestionsMap.values());

      const mappedQuestions = uniqueQuestions.map((item) => {
        const options = [];
        for (const key in item.answers) {
          if (item.answers[key]) {
            options.push({
              id: options.length + 1,
              text: item.answers[key],
              isCorrect: item.correct_answers[key.replace("answer_", "correct_")] === "true",
            });
          }
        }
        return {
          question: item.question,
          options: shuffleArray(options),
        };
      });

      return filterDuplicates(mappedQuestions);
    } catch (error) {
      console.error("API Error:", error);
      setErrorMessage(error.message);
      throw error;
    }
  };

  const getLocalQuestions = () => {
    console.log("Using local questions as fallback");
    // Filter local questions by language if possible
    const localQuestions = generateQuizQuestions(numQuestions, filters.language);
    return filterDuplicates(localQuestions);
  };

  const fetchQuestions = async () => {
    try {
      console.log("Attempting to fetch questions from API...");
      const apiQuestions = await fetchQuestionsFromApi();
      console.log(`Successfully fetched ${apiQuestions.length} questions from API`);
      
      if (apiQuestions.length === 0) {
        console.log("No questions returned from API, using local questions");
        setEmptyState(true);
        return getLocalQuestions();
      }
      
      setEmptyState(false);
      return apiQuestions;
    } catch (error) {
      console.error("Error fetching from API, using local questions:", error);
      setEmptyState(true);
      return getLocalQuestions();
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setIsLoading(true);
    setErrorMessage("");
    
    // Directly call fetchQuestions instead of using debounced version
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
        setErrorMessage("Error fetching questions. Please try again.");
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
              <label htmlFor="categorySelect">Select Category:</label>
              <select
                id="categorySelect"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                aria-label="Select category"
                className="category-dropdown"
                disabled={isLoading}
              >
                <option value="all">All</option>
                <option value="algorithms">Algorithms</option>
                <option value="data_structures">Data Structures</option>
                <option value="databases">Databases</option>
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
