const questions = [
    {
        question: "Which language is used for styling web pages?",
        answers: [
            { text: "HTML", correct: false },
            { text: "CSS", correct: true },
            { text: "Java", correct: false },
            { text: "Python", correct: false }
        ]
    },
    {
        question: "Which language is used for web development?",
        answers: [
            { text: "JavaScript", correct: true },
            { text: "C", correct: false },
            { text: "Python", correct: false },
            { text: "Java", correct: false }
        ]
    },
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "High Text Machine Language", correct: false },
            { text: "Hyper Tool Multi Language", correct: false },
            { text: "None", correct: false }
        ]
    },
    {
        question: "Which company developed Java?",
        answers: [
            { text: "Microsoft", correct: false },
            { text: "Sun Microsystems", correct: true },
            { text: "Google", correct: false },
            { text: "Apple", correct: false }
        ]
    },
    {
        question: "Which tag is used for images in HTML?",
        answers: [
            { text: "<img>", correct: true },
            { text: "<image>", correct: false },
            { text: "<picture>", correct: false },
            { text: "<src>", correct: false }
        ]
    },
    {
        question: "Which language is used to add interactivity to web pages?",
        answers: [
            { text: "HTML", correct: false },
            { text: "CSS", correct: false },
            { text: "JavaScript", correct: true },
            { text: "Python", correct: false }
        ]
    },
    {
        question: "Which method is used to display a message box in JavaScript?",
        answers: [
            { text: "alert()", correct: true },
            { text: "print()", correct: false },
            { text: "display()", correct: false },
            { text: "prompt()", correct: false }
        ]
    },
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        answers: [
            { text: "let", correct: true },
            { text: "int", correct: false },
            { text: "float", correct: false },
            { text: "define", correct: false }
        ]
    },
    {
        question: "Which company developed JavaScript?",
        answers: [
            { text: "Netscape", correct: true },
            { text: "Microsoft", correct: false },
            { text: "Oracle", correct: false },
            { text: "Google", correct: false }
        ]
    },
    {
        question: "Which symbol is used for single-line comments in JavaScript?",
        answers: [
            { text: "//", correct: true },
            { text: "/* */", correct: false },
            { text: "#", correct: false },
            { text: "--", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML =
        (currentQuestionIndex + 1) + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("btn");

        if (answer.correct) {
            button.dataset.correct = "true";
        }

        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("wrong");
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `Quiz Completed!<br><br>Your Score: ${score} / ${questions.length}`;
    nextButton.innerHTML = "Restart";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();