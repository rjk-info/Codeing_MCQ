export const baseQuizData = [
  {
    question: "Which language is primarily used for web development?",
    options: [
      { id: 1, text: "Python", isCorrect: false },
      { id: 2, text: "JavaScript", isCorrect: true },
      { id: 3, text: "C++", isCorrect: false },
      { id: 4, text: "Java", isCorrect: false },
    ],
  },
  {
    question: "What does CSS stand for?",
    options: [
      { id: 1, text: "Computer Style Sheets", isCorrect: false },
      { id: 2, text: "Creative Style Sheets", isCorrect: false },
      { id: 3, text: "Cascading Style Sheets", isCorrect: true },
      { id: 4, text: "Colorful Style Sheets", isCorrect: false },
    ],
  },
  {
    question: "Which of the following is a JavaScript framework?",
    options: [
      { id: 1, text: "Django", isCorrect: false },
      { id: 2, text: "React", isCorrect: true },
      { id: 3, text: "Laravel", isCorrect: false },
      { id: 4, text: "Flask", isCorrect: false },
    ],
  },
  {
    question: "What symbol is used to denote an ID selector in CSS?",
    options: [
      { id: 1, text: ".", isCorrect: false },
      { id: 2, text: "#", isCorrect: true },
      { id: 3, text: "*", isCorrect: false },
      { id: 4, text: "&", isCorrect: false },
    ],
  },
  {
    question: "Which company developed the Java programming language?",
    options: [
      { id: 1, text: "Microsoft", isCorrect: false },
      { id: 2, text: "Sun Microsystems", isCorrect: true },
      { id: 3, text: "Apple", isCorrect: false },
      { id: 4, text: "Google", isCorrect: false },
    ],
  },
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: [
      { id: 1, text: "var x = 10;", isCorrect: true },
      { id: 2, text: "variable x = 10;", isCorrect: false },
      { id: 3, text: "x = 10;", isCorrect: false },
      { id: 4, text: "int x = 10;", isCorrect: false },
    ],
  },
  {
    question: "Which of these is not a JavaScript data type?",
    options: [
      { id: 1, text: "String", isCorrect: false },
      { id: 2, text: "Boolean", isCorrect: false },
      { id: 3, text: "Float", isCorrect: true },
      { id: 4, text: "Number", isCorrect: false },
    ],
  },
  {
    question: "What does the 'DOM' stand for in web development?",
    options: [
      { id: 1, text: "Document Object Model", isCorrect: true },
      { id: 2, text: "Data Object Management", isCorrect: false },
      { id: 3, text: "Document Oriented Markup", isCorrect: false },
      { id: 4, text: "Dynamic Object Manipulation", isCorrect: false },
    ],
  },
  {
    question: "Which method is used to add an element to the end of an array in JavaScript?",
    options: [
      { id: 1, text: "push()", isCorrect: true },
      { id: 2, text: "append()", isCorrect: false },
      { id: 3, text: "add()", isCorrect: false },
      { id: 4, text: "insert()", isCorrect: false },
    ],
  },
  {
    question: "What is the output of typeof null in JavaScript?",
    options: [
      { id: 1, text: "null", isCorrect: false },
      { id: 2, text: "undefined", isCorrect: false },
      { id: 3, text: "object", isCorrect: true },
      { id: 4, text: "number", isCorrect: false },
    ],
  },
];

// Language-specific questions
export const languageSpecificQuestions = {
  javascript: [
    {
      question: "What is a closure in JavaScript?",
      options: [
        { id: 1, text: "A function that has access to variables in its outer scope", isCorrect: true },
        { id: 2, text: "A way to close browser windows", isCorrect: false },
        { id: 3, text: "A method to end loops", isCorrect: false },
        { id: 4, text: "A type of JavaScript error", isCorrect: false },
      ],
    },
    {
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: [
        { id: 1, text: "'==' checks value, '===' checks value and type", isCorrect: true },
        { id: 2, text: "'==' is deprecated, '===' is the new standard", isCorrect: false },
        { id: 3, text: "There is no difference", isCorrect: false },
        { id: 4, text: "'===' is slower than '=='", isCorrect: false },
      ],
    },
  ],
  python: [
    {
      question: "What is a list comprehension in Python?",
      options: [
        { id: 1, text: "A way to create lists based on existing lists", isCorrect: true },
        { id: 2, text: "A method to sort lists", isCorrect: false },
        { id: 3, text: "A way to merge lists", isCorrect: false },
        { id: 4, text: "A type of Python error", isCorrect: false },
      ],
    },
    {
      question: "What is the difference between a list and a tuple in Python?",
      options: [
        { id: 1, text: "Lists are mutable, tuples are immutable", isCorrect: true },
        { id: 2, text: "Lists are faster than tuples", isCorrect: false },
        { id: 3, text: "Tuples can only contain numbers", isCorrect: false },
        { id: 4, text: "There is no difference", isCorrect: false },
      ],
    },
  ],
  java: [
    {
      question: "What is the difference between an interface and an abstract class in Java?",
      options: [
        { id: 1, text: "Interfaces can only have abstract methods, abstract classes can have concrete methods", isCorrect: true },
        { id: 2, text: "There is no difference", isCorrect: false },
        { id: 3, text: "Abstract classes are faster", isCorrect: false },
        { id: 4, text: "Interfaces can have constructors", isCorrect: false },
      ],
    },
    {
      question: "What is the purpose of the 'final' keyword in Java?",
      options: [
        { id: 1, text: "To prevent inheritance, method overriding, or variable reassignment", isCorrect: true },
        { id: 2, text: "To mark the end of a program", isCorrect: false },
        { id: 3, text: "To indicate the last element in a loop", isCorrect: false },
        { id: 4, text: "To improve performance", isCorrect: false },
      ],
    },
  ],
};

// Generate shuffled quiz questions
export const generateQuizQuestions = (num, language = 'javascript') => {
  if (num <= 0 || num > 50) return []; // Error handling
  
  // Get language-specific questions if available
  const langQuestions = languageSpecificQuestions[language] || [];
  
  // Combine base questions with language-specific questions
  const allQuestions = [...baseQuizData, ...langQuestions];
  
  // Shuffle all questions
  const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
  
  // Take the requested number of questions
  return shuffledQuestions.slice(0, num).map((question, index) => {
    // Shuffle options for each question
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    return {
      ...question,
      question: `${question.question} (Question ${index + 1})`,
      options: shuffledOptions,
    };
  });
};
