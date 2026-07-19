const QUESTIONS = [
  // --- WEB DEVELOPMENT ---
  {
    category: "webdev",
    difficulty: "easy",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink and Text Markup Language",
      "Home Tool Markup Language"
    ],
    correctIndex: 0,
    explanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language for documents designed to be displayed in a web browser."
  },
  {
    category: "webdev",
    difficulty: "easy",
    question: "Which CSS property is used to change the text color of an element?",
    options: [
      "text-color",
      "fgcolor",
      "color",
      "font-color"
    ],
    correctIndex: 2,
    explanation: "The 'color' property in CSS is used to set the color of the text content of an element."
  },
  {
    category: "webdev",
    difficulty: "medium",
    question: "Which of the following is NOT a JavaScript data type?",
    options: [
      "Undefined",
      "Boolean",
      "Float",
      "Symbol"
    ],
    correctIndex: 2,
    explanation: "JavaScript does not have a specific 'Float' data type. Numbers (both integers and floating-point values) are stored under the 'Number' data type."
  },
  {
    category: "webdev",
    difficulty: "medium",
    question: "What is the purpose of the 'defer' attribute in a script tag?",
    options: [
      "It stops script execution indefinitely.",
      "It runs the script asynchronously while the HTML parses.",
      "It executes the script after the HTML document has been fully parsed.",
      "It lazy-loads the script only when triggered by an event."
    ],
    correctIndex: 2,
    explanation: "The 'defer' attribute specifies that the script is executed after the document has been parsed, preserving script execution order."
  },
  {
    category: "webdev",
    difficulty: "hard",
    question: "What is the primary difference between Map and WeakMap in JavaScript?",
    options: [
      "Map can only store strings, whereas WeakMap can store any type.",
      "WeakMap key references are held weakly, allowing garbage collection if no other references exist.",
      "Map is asynchronous, whereas WeakMap is synchronous.",
      "WeakMap is faster and has a larger storage size than Map."
    ],
    correctIndex: 1,
    explanation: "Keys of a WeakMap must be objects (or unique symbols) and are held weakly. If a key object is garbage collected, its entry in WeakMap is also removed, preventing memory leaks."
  },
  {
    category: "webdev",
    difficulty: "hard",
    question: "Which HTTP status code represents 'Payload Too Large'?",
    options: [
      "413",
      "415",
      "429",
      "418"
    ],
    correctIndex: 0,
    explanation: "The HTTP 413 Payload Too Large response status code indicates that the request entity is larger than limits defined by server."
  },

  // --- SCIENCE & TECH ---
  {
    category: "science",
    difficulty: "easy",
    question: "What is the chemical symbol for water?",
    options: [
      "H2O",
      "O2",
      "CO2",
      "HO2"
    ],
    correctIndex: 0,
    explanation: "Water consists of two Hydrogen atoms and one Oxygen atom, represented chemically as H2O."
  },
  {
    category: "science",
    difficulty: "easy",
    question: "Which planet is known as the Red Planet?",
    options: [
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn"
    ],
    correctIndex: 1,
    explanation: "Mars is known as the Red Planet due to iron oxide (rust) on its surface, which gives it a reddish appearance."
  },
  {
    category: "science",
    difficulty: "medium",
    question: "What is the approximate speed of light in a vacuum?",
    options: [
      "150,000 km/s",
      "300,000 km/s",
      "500,000 km/s",
      "1,000,000 km/s"
    ],
    correctIndex: 1,
    explanation: "The speed of light in a vacuum is approximately 299,792 kilometers per second (commonly rounded to 300,000 km/s)."
  },
  {
    category: "science",
    difficulty: "medium",
    question: "Which gas makes up the majority of Earth's atmosphere?",
    options: [
      "Oxygen",
      "Carbon Dioxide",
      "Nitrogen",
      "Hydrogen"
    ],
    correctIndex: 2,
    explanation: "Nitrogen makes up about 78% of the Earth's atmosphere, followed by Oxygen at roughly 21%."
  },
  {
    category: "science",
    difficulty: "hard",
    question: "What particle is the mediator of the electromagnetic force in quantum physics?",
    options: [
      "Gluon",
      "Photon",
      "W Boson",
      "Graviton"
    ],
    correctIndex: 1,
    explanation: "In quantum field theory, the photon is the gauge boson that mediates the electromagnetic force."
  },

  // --- HISTORY ---
  {
    category: "history",
    difficulty: "easy",
    question: "Who was the first President of the United States?",
    options: [
      "Thomas Jefferson",
      "George Washington",
      "Abraham Lincoln",
      "John Adams"
    ],
    correctIndex: 1,
    explanation: "George Washington served as the first President of the United States from 1789 to 1797."
  },
  {
    category: "history",
    difficulty: "easy",
    question: "In which year did World War II end?",
    options: [
      "1918",
      "1939",
      "1945",
      "1950"
    ],
    correctIndex: 2,
    explanation: "World War II officially ended on September 2, 1945, after the formal signing of surrender documents by Japan."
  },
  {
    category: "history",
    difficulty: "medium",
    question: "Who was the first Emperor of the Roman Empire?",
    options: [
      "Julius Caesar",
      "Augustus Caesar",
      "Nero",
      "Marcus Aurelius"
    ],
    correctIndex: 1,
    explanation: "Octavian, later known as Augustus Caesar, became the first Emperor of Rome in 27 BC."
  },
  {
    category: "history",
    difficulty: "medium",
    question: "The Magna Carta was signed by which King of England?",
    options: [
      "King John",
      "King Henry VIII",
      "King Richard I",
      "King Edward I"
    ],
    correctIndex: 0,
    explanation: "King John signed the Magna Carta at Runnymede in June 1215 to limit royal power and protect rebel barons' rights."
  },
  {
    category: "history",
    difficulty: "hard",
    question: "Who was the first female Prime Minister of a country in modern history?",
    options: [
      "Margaret Thatcher",
      "Sirimavo Bandaranaike",
      "Indira Gandhi",
      "Golda Meir"
    ],
    correctIndex: 1,
    explanation: "Sirimavo Bandaranaike became the Prime Minister of Ceylon (now Sri Lanka) in 1960, making her the world's first female prime minister."
  },

  // --- GEOGRAPHY ---
  {
    category: "geography",
    difficulty: "easy",
    question: "What is the capital of France?",
    options: [
      "Rome",
      "Berlin",
      "Paris",
      "Madrid"
    ],
    correctIndex: 2,
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    category: "geography",
    difficulty: "easy",
    question: "Which is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    correctIndex: 3,
    explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions."
  },
  {
    category: "geography",
    difficulty: "medium",
    question: "Which river is the longest in the world?",
    options: [
      "Amazon River",
      "Nile River",
      "Yangtze River",
      "Mississippi River"
    ],
    correctIndex: 1,
    explanation: "The Nile River is traditionally considered the longest river in the world, stretching 6,650 kilometers (4,132 miles)."
  },
  {
    category: "geography",
    difficulty: "medium",
    question: "What is the capital city of Australia?",
    options: [
      "Sydney",
      "Melbourne",
      "Canberra",
      "Brisbane"
    ],
    correctIndex: 2,
    explanation: "Canberra was selected as the capital in 1908 as a compromise between rivals Sydney and Melbourne."
  },
  {
    category: "geography",
    difficulty: "hard",
    question: "Which of these desert areas is located in South America?",
    options: [
      "Gobi",
      "Kalahari",
      "Atacama",
      "Mojave"
    ],
    correctIndex: 2,
    explanation: "The Atacama Desert is a cool, arid plateau in South America, stretching west of the Andes Mountains."
  },

  // --- GENERAL KNOWLEDGE ---
  {
    category: "general",
    difficulty: "easy",
    question: "How many days are there in a standard year?",
    options: [
      "360",
      "364",
      "365",
      "366"
    ],
    correctIndex: 2,
    explanation: "A standard year has 365 days. A leap year has 366 days."
  },
  {
    category: "general",
    difficulty: "easy",
    question: "What color do you get when you mix blue and yellow?",
    options: [
      "Green",
      "Purple",
      "Orange",
      "Brown"
    ],
    correctIndex: 0,
    explanation: "Mixing blue and yellow (subtractive primary colors) creates green."
  },
  {
    category: "general",
    difficulty: "medium",
    question: "Which instrument is used to measure atmospheric pressure?",
    options: [
      "Thermometer",
      "Barometer",
      "Anemometer",
      "Hygrometer"
    ],
    correctIndex: 1,
    explanation: "A barometer is a scientific instrument used to measure atmospheric pressure, often for weather forecasting."
  },
  {
    category: "general",
    difficulty: "medium",
    question: "How many bones are there in an adult human body?",
    options: [
      "186",
      "206",
      "216",
      "256"
    ],
    correctIndex: 1,
    explanation: "An adult human skeletal system consists of 206 bones, though babies are born with around 270 bones."
  },
  {
    category: "general",
    difficulty: "hard",
    question: "What is the official currency of Switzerland?",
    options: [
      "Euro",
      "Swiss Franc",
      "Swiss Krone",
      "Swiss Pound"
    ],
    correctIndex: 1,
    explanation: "The currency of Switzerland (and Liechtenstein) is the Swiss Franc (CHF)."
  },

  // --- POP CULTURE ---
  {
    category: "popculture",
    difficulty: "easy",
    question: "Which fictional wizard has a lightning bolt scar on his forehead?",
    options: [
      "Gandalf",
      "Harry Potter",
      "Dumbledore",
      "Merlin"
    ],
    correctIndex: 1,
    explanation: "Harry Potter received his lightning bolt scar from Lord Voldemort when he was an infant."
  },
  {
    category: "popculture",
    difficulty: "easy",
    question: "Who sang the hit song 'Thriller'?",
    options: [
      "Michael Jackson",
      "Prince",
      "Madonna",
      "Elton John"
    ],
    correctIndex: 0,
    explanation: "Michael Jackson released 'Thriller' in 1982, and it became one of the best-selling albums of all time."
  },
  {
    category: "popculture",
    difficulty: "medium",
    question: "Which actor played the character of Iron Man / Tony Stark in the MCU?",
    options: [
      "Chris Evans",
      "Robert Downey Jr.",
      "Chris Hemsworth",
      "Mark Ruffalo"
    ],
    correctIndex: 1,
    explanation: "Robert Downey Jr. portrayed Iron Man starting from the 2008 film 'Iron Man' until 'Avengers: Endgame' in 2019."
  },
  {
    category: "popculture",
    difficulty: "medium",
    question: "What is the name of the fictional continent in 'Game of Thrones'?",
    options: [
      "Narnia",
      "Middle-earth",
      "Westeros",
      "Tamriel"
    ],
    correctIndex: 2,
    explanation: "Most of the story in 'Game of Thrones' and the book series 'A Song of Ice and Fire' takes place on the continent of Westeros."
  },
  {
    category: "popculture",
    difficulty: "hard",
    question: "Which artist won the Grammy Award for Album of the Year in 2024?",
    options: [
      "SZA",
      "Taylor Swift",
      "Olivia Rodrigo",
      "Billie Eilish"
    ],
    correctIndex: 1,
    explanation: "Taylor Swift won Album of the Year for 'Midnights' at the 66th Annual Grammy Awards in 2024, setting a record for the most wins in that category (4)."
  }
];