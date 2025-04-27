// Real programming questions for each language
const languageQuestions = {
  javascript: [
    "What is the output of console.log(typeof null)?",
    "Which method is used to add an element to the end of an array?",
    "What is the correct way to declare a variable in JavaScript?",
    "What is a closure in JavaScript?",
    "What is the difference between let and const?",
    "What is the event loop in JavaScript?",
    "What is the difference between == and ===?",
    "What is a promise in JavaScript?",
    "What is the difference between map and forEach?",
    "What is the purpose of 'use strict'?",
    "What is the difference between null and undefined?",
    "What is the prototype chain in JavaScript?",
    "What is the difference between function declaration and function expression?",
    "What is the purpose of the 'this' keyword?",
    "What is the difference between call and apply?",
    "What is the difference between var and let?",
    "What is the purpose of the bind method?",
    "What is the difference between slice and splice?",
    "What is the purpose of the spread operator?",
    "What is the difference between async and defer?",
    "What is the purpose of the fetch API?",
    "What is the difference between localStorage and sessionStorage?",
    "What is the purpose of the reduce method?",
    "What is the difference between arrow functions and regular functions?",
    "What is the purpose of the Symbol type?",
    "What is the difference between Object.freeze and Object.seal?",
    "What is the purpose of the Proxy object?",
    "What is the difference between setInterval and setTimeout?",
    "What is the purpose of the WeakMap and WeakSet?",
    "What is the difference between import and require?"
  ],
  python: [
    "What is the difference between a list and a tuple?",
    "What is a list comprehension?",
    "What is the purpose of the 'self' parameter?",
    "What is the difference between is and ==?",
    "What is a decorator in Python?",
    "What is the purpose of the with statement?",
    "What is the difference between range and xrange?",
    "What is a generator in Python?",
    "What is the purpose of the __init__ method?",
    "What is the difference between append and extend?",
    "What is the purpose of the *args and **kwargs?",
    "What is the difference between a method and a function?",
    "What is the purpose of the @property decorator?",
    "What is the difference between a class and an object?",
    "What is the purpose of the super() function?",
    "What is the difference between a module and a package?",
    "What is the purpose of the __str__ method?",
    "What is the difference between a shallow copy and a deep copy?",
    "What is the purpose of the @staticmethod decorator?",
    "What is the difference between a dictionary and a set?",
    "What is the purpose of the @classmethod decorator?",
    "What is the difference between a list and a set?",
    "What is the purpose of the __repr__ method?",
    "What is the difference between a tuple and a namedtuple?",
    "What is the purpose of the @abstractmethod decorator?",
    "What is the difference between a function and a lambda?",
    "What is the purpose of the __call__ method?",
    "What is the difference between a class method and a static method?",
    "What is the purpose of the @property decorator?",
    "What is the difference between a list and a deque?"
  ],
  java: [
    "What is the difference between an abstract class and an interface?",
    "What is the purpose of the final keyword?",
    "What is the difference between HashMap and HashTable?",
    "What is a constructor in Java?",
    "What is the difference between equals() and ==?",
    "What is the purpose of the static keyword?",
    "What is the difference between ArrayList and LinkedList?",
    "What is a package in Java?",
    "What is the difference between checked and unchecked exceptions?",
    "What is the purpose of the this keyword?",
    "What is the difference between method overloading and overriding?",
    "What is a thread in Java?",
    "What is the difference between String, StringBuilder, and StringBuffer?",
    "What is the purpose of the synchronized keyword?",
    "What is the difference between a class and an object?",
    "What is the purpose of the super keyword?",
    "What is the difference between a method and a function?",
    "What is the purpose of the volatile keyword?",
    "What is the difference between a local variable and an instance variable?",
    "What is the purpose of the instanceof operator?",
    "What is the difference between a stack and a heap?",
    "What is the purpose of the transient keyword?",
    "What is the difference between a constructor and a method?",
    "What is the purpose of the break statement?",
    "What is the difference between a class and an interface?",
    "What is the purpose of the continue statement?",
    "What is the difference between a variable and a constant?",
    "What is the purpose of the return statement?",
    "What is the difference between a parameter and an argument?",
    "What is the purpose of the throw statement?"
  ],
  csharp: [
    "What is the difference between value types and reference types?",
    "What is the purpose of the using statement?",
    "What is the difference between var and dynamic?",
    "What is a delegate in C#?",
    "What is the difference between string and String?",
    "What is the purpose of the async/await keywords?",
    "What is the difference between IEnumerable and IQueryable?",
    "What is a property in C#?",
    "What is the difference between struct and class?",
    "What is the purpose of the yield keyword?",
    "What is the difference between readonly and const?",
    "What is a lambda expression in C#?",
    "What is the difference between virtual and abstract?",
    "What is the purpose of the out keyword?",
    "What is the difference between ref and out?",
    "What is the purpose of the params keyword?",
    "What is the difference between sealed and abstract?",
    "What is the purpose of the lock statement?",
    "What is the difference between interface and abstract class?",
    "What is the purpose of the is operator?",
    "What is the difference between throw and throw ex?",
    "What is the purpose of the as operator?",
    "What is the difference between private and protected?",
    "What is the purpose of the checked keyword?",
    "What is the difference between public and internal?",
    "What is the purpose of the unchecked keyword?",
    "What is the difference between static and instance methods?",
    "What is the purpose of the fixed statement?",
    "What is the difference between sealed and override?",
    "What is the purpose of the stackalloc keyword?"
  ],
  ruby: [
    "What is the difference between a symbol and a string?",
    "What is the purpose of the attr_accessor?",
    "What is the difference between include and extend?",
    "What is a block in Ruby?",
    "What is the difference between proc and lambda?",
    "What is the purpose of the yield keyword?",
    "What is the difference between private and protected?",
    "What is a module in Ruby?",
    "What is the difference between map and collect?",
    "What is the purpose of the super keyword?",
    "What is the difference between nil and false?",
    "What is a singleton method in Ruby?",
    "What is the difference between each and each_with_index?",
    "What is the purpose of the self keyword?",
    "What is the difference between a class and a module?",
    "What is the purpose of the freeze method?",
    "What is the difference between a method and a function?",
    "What is the purpose of the singleton_class?",
    "What is the difference between a hash and an array?",
    "What is the purpose of the method_missing?",
    "What is the difference between a constant and a variable?",
    "What is the purpose of the instance_eval?",
    "What is the difference between a local and an instance variable?",
    "What is the purpose of the define_method?",
    "What is the difference between a class variable and an instance variable?",
    "What is the purpose of the send method?",
    "What is the difference between a private and a public method?",
    "What is the purpose of the respond_to?",
    "What is the difference between a class method and an instance method?",
    "What is the purpose of the singleton_methods?"
  ],
  php: [
    "What is the difference between include and require?",
    "What is the purpose of the namespace keyword?",
    "What is the difference between == and ===?",
    "What is a trait in PHP?",
    "What is the difference between public and private?",
    "What is the purpose of the use keyword?",
    "What is the difference between array and array()?",
    "What is a closure in PHP?",
    "What is the difference between isset and empty?",
    "What is the purpose of the static keyword?",
    "What is the difference between echo and print?",
    "What is a magic method in PHP?",
    "What is the difference between GET and POST?",
    "What is the purpose of the final keyword?",
    "What is the difference between a class and an interface?",
    "What is the purpose of the abstract keyword?",
    "What is the difference between a method and a function?",
    "What is the purpose of the const keyword?",
    "What is the difference between a variable and a constant?",
    "What is the purpose of the self keyword?",
    "What is the difference between a string and a string?",
    "What is the purpose of the parent keyword?",
    "What is the difference between a parameter and an argument?",
    "What is the purpose of the return statement?",
    "What is the difference between a local and a global variable?",
    "What is the purpose of the break statement?",
    "What is the difference between a class and an object?",
    "What is the purpose of the continue statement?",
    "What is the difference between a property and a method?",
    "What is the purpose of the throw statement?"
  ],
  swift: [
    "What is the difference between let and var?",
    "What is the purpose of the guard statement?",
    "What is the difference between struct and class?",
    "What is a protocol in Swift?",
    "What is the difference between weak and unowned?",
    "What is the purpose of the defer statement?",
    "What is the difference between optional and non-optional?",
    "What is a closure in Swift?",
    "What is the difference between value types and reference types?",
    "What is the purpose of the mutating keyword?",
    "What is the difference between static and class?",
    "What is a property observer in Swift?",
    "What is the difference between final and override?",
    "What is the purpose of the lazy keyword?",
    "What is the difference between private and fileprivate?",
    "What is the purpose of the typealias keyword?",
    "What is the difference between a method and a function?",
    "What is the purpose of the subscript keyword?",
    "What is the difference between a protocol and a class?",
    "What is the purpose of the associatedtype keyword?",
    "What is the difference between a tuple and a struct?",
    "What is the purpose of the where clause?",
    "What is the difference between a set and an array?",
    "What is the purpose of the throws keyword?",
    "What is the difference between a dictionary and a set?",
    "What is the purpose of the rethrows keyword?",
    "What is the difference between a string and a character?",
    "What is the purpose of the inout keyword?",
    "What is the difference between a range and a closed range?",
    "What is the purpose of the Any type?"
  ],
  kotlin: [
    "What is the difference between val and var?",
    "What is the purpose of the when expression?",
    "What is the difference between data class and regular class?",
    "What is a companion object in Kotlin?",
    "What is the difference between nullable and non-nullable?",
    "What is the purpose of the lateinit keyword?",
    "What is the difference between object and companion object?",
    "What is a property in Kotlin?",
    "What is the difference between const and val?",
    "What is the purpose of the by keyword?",
    "What is the difference between sealed class and enum?",
    "What is a coroutine in Kotlin?",
    "What is the difference between interface and abstract class?",
    "What is the purpose of the init block?",
    "What is the difference between private and internal?",
    "What is the purpose of the data class?",
    "What is the difference between a function and a method?",
    "What is the purpose of the inline keyword?",
    "What is the difference between a class and an object?",
    "What is the purpose of the suspend keyword?",
    "What is the difference between a property and a field?",
    "What is the purpose of the reified keyword?",
    "What is the difference between a string and a char?",
    "What is the purpose of the operator keyword?",
    "What is the difference between a list and a set?",
    "What is the purpose of the infix keyword?",
    "What is the difference between a map and a set?",
    "What is the purpose of the tailrec keyword?",
    "What is the difference between a range and a progression?",
    "What is the purpose of the crossinline keyword?"
  ],
  go: [
    "What is the difference between a slice and an array?",
    "What is the purpose of the defer statement?",
    "What is the difference between a pointer and a value?",
    "What is a goroutine in Go?",
    "What is the difference between a channel and a mutex?",
    "What is the purpose of the select statement?",
    "What is the difference between a struct and a class?",
    "What is an interface in Go?",
    "What is the difference between a method and a function?",
    "What is the purpose of the go keyword?",
    "What is the difference between a map and a struct?",
    "What is a closure in Go?",
    "What is the difference between a channel and a mutex?",
    "What is the purpose of the range keyword?",
    "What is the difference between a pointer and a reference?",
    "What is the purpose of the make function?",
    "What is the difference between a slice and a map?",
    "What is the purpose of the new function?",
    "What is the difference between a method and a function?",
    "What is the purpose of the panic function?",
    "What is the difference between a struct and an interface?",
    "What is the purpose of the recover function?",
    "What is the difference between a channel and a mutex?",
    "What is the purpose of the close function?",
    "What is the difference between a pointer and a value?",
    "What is the purpose of the len function?",
    "What is the difference between a slice and a map?",
    "What is the purpose of the cap function?",
    "What is the difference between a struct and a class?",
    "What is the purpose of the append function?"
  ],
  rust: [
    "What is the difference between & and &mut?",
    "What is the purpose of the impl keyword?",
    "What is the difference between Option and Result?",
    "What is a trait in Rust?",
    "What is the difference between move and copy?",
    "What is the purpose of the match expression?",
    "What is the difference between a struct and an enum?",
    "What is a lifetime in Rust?",
    "What is the difference between Box and Rc?",
    "What is the purpose of the where clause?",
    "What is the difference between a trait and an interface?",
    "What is a macro in Rust?",
    "What is the difference between a method and a function?",
    "What is the purpose of the derive attribute?",
    "What is the difference between a reference and a pointer?",
    "What is the purpose of the unsafe keyword?",
    "What is the difference between a struct and a tuple?",
    "What is the purpose of the type keyword?",
    "What is the difference between a trait and a type?",
    "What is the purpose of the as keyword?",
    "What is the difference between a method and a function?",
    "What is the purpose of the use keyword?",
    "What is the difference between a struct and a class?",
    "What is the purpose of the mod keyword?",
    "What is the difference between a trait and a struct?",
    "What is the purpose of the pub keyword?",
    "What is the difference between a reference and a value?",
    "What is the purpose of the mut keyword?",
    "What is the difference between a trait and an enum?",
    "What is the purpose of the static keyword?"
  ]
};

// Helper function to generate questions for a language
function generateQuestionsForLanguage(language, totalQuestions) {
  const questions = [];
  const difficulties = ['easy', 'medium', 'hard'];
  const baseQuestions = languageQuestions[language] || [];
  
  // Language-specific options for common question types
  const languageOptions = {
    javascript: {
      "What is the output of console.log(typeof null)?": [
        { text: "null", isCorrect: false },
        { text: "undefined", isCorrect: false },
        { text: "object", isCorrect: true },
        { text: "boolean", isCorrect: false }
      ],
      "Which method is used to add an element to the end of an array?": [
        { text: "push()", isCorrect: true },
        { text: "pop()", isCorrect: false },
        { text: "shift()", isCorrect: false },
        { text: "unshift()", isCorrect: false }
      ],
      "What is the correct way to declare a variable in JavaScript?": [
        { text: "var x = 10;", isCorrect: false },
        { text: "let x = 10;", isCorrect: true },
        { text: "variable x = 10;", isCorrect: false },
        { text: "x = 10;", isCorrect: false }
      ],
      "What is a closure in JavaScript?": [
        { text: "A function having access to its outer scope", isCorrect: true },
        { text: "A function with no parameters", isCorrect: false },
        { text: "A function that returns a value", isCorrect: false },
        { text: "A function that calls itself", isCorrect: false }
      ],
      "What is the difference between let and const?": [
        { text: "let allows reassignment, const does not", isCorrect: true },
        { text: "const allows reassignment, let does not", isCorrect: false },
        { text: "Both allow reassignment", isCorrect: false },
        { text: "Neither allow reassignment", isCorrect: false }
      ],
      "What is the event loop in JavaScript?": [
        { text: "A mechanism to handle asynchronous callbacks", isCorrect: true },
        { text: "A loop that runs forever", isCorrect: false },
        { text: "A function that executes immediately", isCorrect: false },
        { text: "A method to iterate over arrays", isCorrect: false }
      ]
    },
    python: {
      "What is the correct way to create a function in Python?": [
        { text: "function myFunc():", isCorrect: false },
        { text: "def myFunc():", isCorrect: true },
        { text: "func myFunc():", isCorrect: false },
        { text: "create myFunc():", isCorrect: false }
      ],
      "Which operator is used for floor division in Python?": [
        { text: "/", isCorrect: false },
        { text: "//", isCorrect: true },
        { text: "%", isCorrect: false },
        { text: "|", isCorrect: false }
      ],
      "What is the difference between a list and a set?": [
        { text: "List is ordered, set is unordered", isCorrect: true },
        { text: "List is immutable, set is mutable", isCorrect: false },
        { text: "List stores unique elements, set allows duplicates", isCorrect: false },
        { text: "List is a type of set", isCorrect: false }
      ],
      "What is the purpose of the __init__ method?": [
        { text: "To initialize an object's attributes", isCorrect: true },
        { text: "To delete an object", isCorrect: false },
        { text: "To define a class method", isCorrect: false },
        { text: "To create a module", isCorrect: false }
      ]
    },
    java: {
      "What is the difference between an abstract class and an interface?": [
        { text: "Abstract class can have method implementations, interface cannot", isCorrect: true },
        { text: "Interface can have method implementations, abstract class cannot", isCorrect: false },
        { text: "Both are the same", isCorrect: false },
        { text: "Neither can have method implementations", isCorrect: false }
      ],
      "What is the purpose of the final keyword?": [
        { text: "To prevent inheritance", isCorrect: true },
        { text: "To allow inheritance", isCorrect: false },
        { text: "To declare a constant variable", isCorrect: false },
        { text: "To define a method", isCorrect: false }
      ],
      "What is the difference between HashMap and HashTable?": [
        { text: "HashMap is unsynchronized, HashTable is synchronized", isCorrect: true },
        { text: "HashMap is synchronized, HashTable is unsynchronized", isCorrect: false },
        { text: "Both are synchronized", isCorrect: false },
        { text: "Both are unsynchronized", isCorrect: false }
      ],
      "What is a constructor in Java?": [
        { text: "A special method to initialize objects", isCorrect: true },
        { text: "A method to destroy objects", isCorrect: false },
        { text: "A variable", isCorrect: false },
        { text: "A class", isCorrect: false }
      ],
      "What is the purpose of the synchronized keyword?": [
        { text: "To control access to a method or block by multiple threads", isCorrect: true },
        { text: "To allow multiple threads to access a method simultaneously", isCorrect: false },
        { text: "To define a constant variable", isCorrect: false },
        { text: "To declare a static method", isCorrect: false }
      ],
      "What is the purpose of the continue statement?": [
        { text: "To skip the current iteration and continue with the next", isCorrect: true },
        { text: "To exit the loop immediately", isCorrect: false },
        { text: "To restart the loop from the beginning", isCorrect: false },
        { text: "To pause the loop execution", isCorrect: false }
      ]
    }
  };
  
  // Generate 1000 questions for each language
  for (let i = 1; i <= totalQuestions; i++) {
    // Randomly assign difficulty
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    // Get a real question or generate a fallback
    let questionText;
    if (baseQuestions.length > 0) {
      questionText = baseQuestions[i % baseQuestions.length];
    } else {
      questionText = `What is a key feature of ${language} programming?`;
    }
    
    // Generate a unique question
    const question = {
      id: i,
      question: questionText,
      options: [],
      difficulty
    };
    
    // Check if we have language-specific options for this question
    if (languageOptions[language] && languageOptions[language][questionText]) {
      question.options = languageOptions[language][questionText].map((opt, idx) => ({
        id: idx + 1,
        text: opt.text,
        isCorrect: opt.isCorrect
      }));
    } else {
      // Use generic options if no language-specific options are available
      question.options = [
        { id: 1, text: "Dynamic typing", isCorrect: Math.random() < 0.25 },
        { id: 2, text: "Static typing", isCorrect: Math.random() < 0.25 },
        { id: 3, text: "Interpreted execution", isCorrect: Math.random() < 0.25 },
        { id: 4, text: "Compiled execution", isCorrect: Math.random() < 0.25 }
      ];
      
      // Ensure exactly one option is correct
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        const randomIndex = Math.floor(Math.random() * 4);
        question.options.forEach((opt, idx) => {
          opt.isCorrect = idx === randomIndex;
        });
      }
    }
    
    questions.push(question);
  }
  
  return questions;
}

const quizQuestions = {
  javascript: generateQuestionsForLanguage('javascript', 1000),
  python: generateQuestionsForLanguage('python', 1000),
  java: generateQuestionsForLanguage('java', 1000),
  csharp: generateQuestionsForLanguage('csharp', 1000),
  ruby: generateQuestionsForLanguage('ruby', 1000),
  php: generateQuestionsForLanguage('php', 1000),
  swift: generateQuestionsForLanguage('swift', 1000),
  kotlin: generateQuestionsForLanguage('kotlin', 1000),
  go: generateQuestionsForLanguage('go', 1000),
  rust: generateQuestionsForLanguage('rust', 1000)
};

export const getQuestionsForLanguage = (language, difficulty, count) => {
  // Ensure count is between 1 and 50
  const validCount = Math.min(Math.max(1, count), 50);
  
  // Get all questions for the selected language
  const allQuestions = quizQuestions[language] || [];
  
  // Filter questions by difficulty if specified
  const filteredQuestions = difficulty 
    ? allQuestions.filter(q => q.difficulty === difficulty)
    : allQuestions;
  
  // Shuffle all questions
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  
  // Return the requested number of questions
  return shuffled.slice(0, validCount);
};

export default quizQuestions; 