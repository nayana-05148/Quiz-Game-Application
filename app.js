document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let gameState = {
    selectedCategory: 'all',
    selectedDifficulty: 'any',
    questionsList: [],
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 15,
    maxTime: 15,
    timerInterval: null,
    lifelines: {
      fiftyFifty: { used: false },
      extraTime: { used: false },
      audiencePoll: { used: false }
    },
    userAnswers: [], // { question, selectedIndex, correctIndex, timeTaken, isCorrect }
    tempCustomQuizQuestions: [],
    customQuizzes: [],
    highScores: [],
    theme: 'dark',
    questionStartTime: 0
  };

  // ==========================================================================
  // DOM ELEMENT SELECTORS
  // ==========================================================================
  const screens = {
    menu: document.getElementById('screen-menu'),
    game: document.getElementById('screen-game'),
    gameOver: document.getElementById('screen-game-over'),
    leaderboard: document.getElementById('screen-leaderboard'),
    creator: document.getElementById('screen-creator')
  };

  // Header Elements
  const btnTheme = document.getElementById('btn-theme');
  const btnMute = document.getElementById('btn-mute');

  // Menu Screen Elements
  const categoriesContainer = document.getElementById('categories-container');
  const diffButtons = document.querySelectorAll('.diff-btn');
  const btnStart = document.getElementById('btn-start');
  const btnShowLeaderboard = document.getElementById('btn-show-leaderboard');
  const btnShowCreator = document.getElementById('btn-show-creator');

  // Game Screen Elements
  const gameCurrentCategory = document.getElementById('game-current-category');
  const gameProgressText = document.getElementById('game-progress-text');
  const gameCurrentScore = document.getElementById('game-current-score');
  const gameProgressDots = document.getElementById('game-progress-dots');
  const timerCountdown = document.getElementById('timer-countdown');
  const timerProgressCircle = document.getElementById('timer-progress-circle');
  const gameQuestionText = document.getElementById('game-question-text');
  const gameOptionsGrid = document.getElementById('game-options-grid');
  
  // Lifeline Buttons
  const btnLifeline5050 = document.getElementById('btn-lifeline-5050');
  const btnLifelineTime = document.getElementById('btn-lifeline-time');
  const btnLifelinePoll = document.getElementById('btn-lifeline-poll');
  const btnNextQuestion = document.getElementById('btn-next-question');

  // Audience Poll Modal Elements
  const audiencePollModal = document.getElementById('audience-poll-modal');
  const pollBarsContainer = document.getElementById('poll-bars-container');
  const btnClosePoll = document.getElementById('btn-close-poll');

  // Game Over Elements
  const confettiCanvas = document.getElementById('confetti-canvas');
  const resultTitle = document.getElementById('result-title');
  const resultSubtitle = document.getElementById('result-subtitle');
  const statFinalScore = document.getElementById('stat-final-score');
  const statAccuracy = document.getElementById('stat-accuracy');
  const statLifelines = document.getElementById('stat-lifelines');
  const statSpeed = document.getElementById('stat-speed');
  const highScoreForm = document.getElementById('high-score-form');
  const playerNameInput = document.getElementById('player-name-input');
  const btnSubmitScore = document.getElementById('btn-submit-score');
  const btnPlayAgain = document.getElementById('btn-play-again');
  const btnViewReview = document.getElementById('btn-view-review');
  const btnResultMenu = document.getElementById('btn-result-menu');
  const reviewSection = document.getElementById('review-section');
  const reviewList = document.getElementById('review-list');

  // Leaderboard Elements
  const leaderboardTabs = document.getElementById('leaderboard-tabs');
  const leaderboardTbody = document.getElementById('leaderboard-tbody');
  const leaderboardEmpty = document.getElementById('leaderboard-empty');
  const btnClearScores = document.getElementById('btn-clear-scores');
  const btnLeaderboardBack = document.getElementById('btn-leaderboard-back');

  // Creator Elements
  const quizTitleInput = document.getElementById('quiz-title');
  const quizCategorySelect = document.getElementById('quiz-category');
  const quizDifficultySelect = document.getElementById('quiz-difficulty');
  const creatorQuestionsCount = document.getElementById('creator-questions-count');
  const creatorQuestionsList = document.getElementById('creator-questions-list');
  const questionPromptInput = document.getElementById('question-prompt');
  const optionInputs = [
    document.getElementById('opt-0'),
    document.getElementById('opt-1'),
    document.getElementById('opt-2'),
    document.getElementById('opt-3')
  ];
  const correctOptSelect = document.getElementById('correct-opt-select');
  const questionExplanationInput = document.getElementById('question-explanation');
  const btnAddQuestion = document.getElementById('btn-add-question');
  const btnSaveQuiz = document.getElementById('btn-save-quiz');
  const btnCreatorBack = document.getElementById('btn-creator-back');

  // ==========================================================================
  // INITIALIZATION & THEMING & SOUND STATE
  // ==========================================================================
  const initApp = () => {
    // Theme Initializer
    const savedTheme = localStorage.getItem('quiz_theme') || 'dark';
    setTheme(savedTheme);

    // Mute Initializer
    if (SoundEffects.isMuted()) {
      document.body.classList.add('sound-muted');
    }

    // Load High Scores and Custom Quizzes from localStorage
    loadHighScores();
    loadCustomQuizzes();
    renderCategoryGrid();
  };

  const setTheme = (theme) => {
    gameState.theme = theme;
    localStorage.setItem('quiz_theme', theme);
    if (theme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

  btnTheme.addEventListener('click', () => {
    SoundEffects.playClick();
    setTheme(gameState.theme === 'dark' ? 'light' : 'dark');
  });

  btnMute.addEventListener('click', () => {
    const isMuted = SoundEffects.toggleMute();
    if (isMuted) {
      document.body.classList.add('sound-muted');
    } else {
      document.body.classList.remove('sound-muted');
    }
    // Simple synth tick to let the user hear sound has unmuted
    if (!isMuted) {
      SoundEffects.playClick();
    }
  });

  // ==========================================================================
  // SCREEN NAVIGATION
  // ==========================================================================
  const navigateTo = (screenName) => {
    Object.values(screens).forEach(screen => {
      screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
  };

  // ==========================================================================
  // CATEGORIES & DIFFICULTY CONTROLS
  // ==========================================================================
  const renderCategoryGrid = () => {
    // Basic static categories + Custom Quizzes
    const standardCategoriesHTML = `
      <button class="category-btn active" data-category="all">
        <span class="cat-icon">🌐</span>
        <span class="cat-name">All Topics</span>
      </button>
      <button class="category-btn" data-category="general">
        <span class="cat-icon">🧠</span>
        <span class="cat-name">General Knowledge</span>
      </button>
      <button class="category-btn" data-category="science">
        <span class="cat-icon">🔬</span>
        <span class="cat-name">Science & Tech</span>
      </button>
      <button class="category-btn" data-category="history">
        <span class="cat-icon">📜</span>
        <span class="cat-name">History</span>
      </button>
      <button class="category-btn" data-category="geography">
        <span class="cat-icon">🗺️</span>
        <span class="cat-name">Geography</span>
      </button>
      <button class="category-btn" data-category="popculture">
        <span class="cat-icon">🎬</span>
        <span class="cat-name">Pop Culture</span>
      </button>
      <button class="category-btn" data-category="webdev">
        <span class="cat-icon">💻</span>
        <span class="cat-name">Web Dev</span>
      </button>
    `;

    let customCategoriesHTML = '';
    if (gameState.customQuizzes.length > 0) {
      customCategoriesHTML = '<div class="custom-quizzes-divider" style="grid-column: 1 / -1; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-top: 10px; border-top: 1px solid var(--glass-border); padding-top: 10px;">Custom Quizzes</div>';
      gameState.customQuizzes.forEach((quiz, index) => {
        customCategoriesHTML += `
          <button class="category-btn custom-quiz-btn" data-category="custom-${index}" data-custom-index="${index}">
            <span class="cat-icon">🎮</span>
            <span class="cat-name" title="${quiz.title}">${quiz.title}</span>
          </button>
        `;
      });
    }

    categoriesContainer.innerHTML = standardCategoriesHTML + customCategoriesHTML;

    // Attach click events to dynamically rendered categories
    const catButtons = categoriesContainer.querySelectorAll('.category-btn');
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        SoundEffects.playClick();
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.selectedCategory = btn.getAttribute('data-category');
      });
    });
  };

  diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      SoundEffects.playClick();
      diffButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.selectedDifficulty = btn.getAttribute('data-difficulty');
    });
  });

  // ==========================================================================
  // GAMEPLAY PROCESS LOGIC
  // ==========================================================================
  const startQuiz = () => {
    // 1. Gather questions
    let pool = [];

    if (gameState.selectedCategory.startsWith('custom-')) {
      const idx = parseInt(gameState.selectedCategory.split('-')[1]);
      const customQuiz = gameState.customQuizzes[idx];
      pool = customQuiz.questions;
      gameState.selectedDifficulty = customQuiz.difficulty;
      gameCurrentCategory.textContent = `Custom: ${customQuiz.title}`;
    } else {
      pool = QUESTIONS;
      // Filter by Category
      if (gameState.selectedCategory !== 'all') {
        pool = pool.filter(q => q.category === gameState.selectedCategory);
      }
      // Filter by Difficulty
      if (gameState.selectedDifficulty !== 'any') {
        pool = pool.filter(q => q.difficulty === gameState.selectedDifficulty);
      }

      const catNames = {
        all: "All Topics",
        general: "General Knowledge",
        science: "Science & Tech",
        history: "History",
        geography: "Geography",
        popculture: "Pop Culture",
        webdev: "Web Dev"
      };
      gameCurrentCategory.textContent = catNames[gameState.selectedCategory];
    }

    if (pool.length === 0) {
      alert("No questions found matching your category/difficulty settings! Try selecting 'All Topics' or 'Any' difficulty.");
      return;
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    
    // Choose up to 10 questions
    gameState.questionsList = shuffled.slice(0, 10);
    
    // Reset Game State Variables
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.userAnswers = [];
    
    gameState.lifelines.fiftyFifty.used = false;
    gameState.lifelines.extraTime.used = false;
    gameState.lifelines.audiencePoll.used = false;

    // Reset Lifeline Buttons State
    resetLifelineButtons();

    // Render Progress Dot indicators
    renderProgressDots();

    // Navigate to gameplay
    navigateTo('game');

    // Load first question
    loadQuestion(0);
  };

  const resetLifelineButtons = () => {
    [btnLifeline5050, btnLifelineTime, btnLifelinePoll].forEach(btn => {
      btn.classList.remove('used');
      btn.disabled = false;
    });
  };

  const renderProgressDots = () => {
    gameProgressDots.innerHTML = '';
    gameState.questionsList.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (idx === 0) dot.classList.add('active');
      gameProgressDots.appendChild(dot);
    });
  };

  const updateProgressDots = () => {
    const dots = gameProgressDots.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active');
      if (idx === gameState.currentQuestionIndex) {
        dot.classList.add('active');
      }
      
      // Paint completed answers
      if (idx < gameState.userAnswers.length) {
        const ans = gameState.userAnswers[idx];
        if (ans.isCorrect) {
          dot.classList.add('correct');
        } else {
          dot.classList.add('incorrect');
        }
      }
    });
  };

  const loadQuestion = (index) => {
    const question = gameState.questionsList[index];
    
    // Update Stats Display
    gameProgressText.textContent = `${index + 1} / ${gameState.questionsList.length}`;
    gameCurrentScore.textContent = String(gameState.score).padStart(4, '0');
    updateProgressDots();

    // Populate text
    gameQuestionText.textContent = question.question;
    
    // Build options list
    gameOptionsGrid.innerHTML = '';
    question.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('data-index', idx);
      
      // Let's create Option label structure (e.g. Option A, B, C, D)
      const optLabel = String.fromCharCode(65 + idx); // A, B, C, D
      btn.innerHTML = `
        <span><strong>${optLabel}:</strong> ${escapeHTML(opt)}</span>
        <span class="opt-feedback-icon"></span>
      `;
      
      btn.addEventListener('click', () => selectOption(idx));
      gameOptionsGrid.appendChild(btn);
    });

    // Handle button disabling
    btnNextQuestion.disabled = true;
    btnNextQuestion.classList.add('disabled-btn');

    // Handle timer resets
    gameState.timeLeft = 15;
    gameState.maxTime = 15;
    startTimer();
  };

  // Helper to escape HTML and prevent XSS in custom quizzes
  const escapeHTML = (text) => {
    const p = document.createElement('p');
    p.textContent = text;
    return p.innerHTML;
  };

  // ==========================================================================
  // TIMER CONTROLLER
  // ==========================================================================
  const startTimer = () => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    
    // Record start time to compute speed
    gameState.questionStartTime = Date.now();

    updateTimerUI();

    gameState.timerInterval = setInterval(() => {
      gameState.timeLeft--;
      updateTimerUI();

      if (gameState.timeLeft <= 5 && gameState.timeLeft > 0) {
        SoundEffects.playTimerTick();
      }

      if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timerInterval);
        handleTimeout();
      }
    }, 1000);
  };

  const updateTimerUI = () => {
    timerCountdown.textContent = gameState.timeLeft;
    
    // Stroke calculation: circle perimeter is 2 * PI * 34 = 213.6
    const perimeter = 213.6;
    const progressFraction = Math.max(0, gameState.timeLeft) / gameState.maxTime;
    const offset = perimeter * (1 - progressFraction);
    timerProgressCircle.style.strokeDashoffset = offset;

    // Timer classes based on time warning
    timerProgressCircle.classList.remove('warning', 'danger');
    if (gameState.timeLeft <= 5) {
      timerProgressCircle.classList.add('danger');
    } else if (gameState.timeLeft <= 10) {
      timerProgressCircle.classList.add('warning');
    }
  };

  // ==========================================================================
  // gameplay INTERACTIONS & SCORE CALCULATION
  // ==========================================================================
  const selectOption = (selectedIndex) => {
    clearInterval(gameState.timerInterval);
    
    const question = gameState.questionsList[gameState.currentQuestionIndex];
    const correctIndex = question.correctIndex;
    const timeTaken = ((Date.now() - gameState.questionStartTime) / 1000).toFixed(1);
    const isCorrect = (selectedIndex === correctIndex);

    // Disable all options immediately
    const optionButtons = gameOptionsGrid.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);

    // Highlight correct & selected buttons
    const clickedBtn = optionButtons[selectedIndex];
    const correctBtn = optionButtons[correctIndex];

    if (isCorrect) {
      SoundEffects.playCorrect();
      clickedBtn.classList.add('correct-reveal');
      clickedBtn.querySelector('.opt-feedback-icon').innerHTML = '✅';

      // Base score calculation
      let points = 100;
      if (question.difficulty === 'medium') points = 200;
      if (question.difficulty === 'hard') points = 300;

      // Speed bonus multipliers
      let speedBonus = 0;
      if (timeTaken <= 5) {
        speedBonus = Math.round(points * 0.5); // 50% bonus
      } else if (timeTaken <= 10) {
        speedBonus = Math.round(points * 0.25); // 25% bonus
      }

      gameState.score += (points + speedBonus);
    } else {
      SoundEffects.playWrong();
      clickedBtn.classList.add('incorrect-reveal');
      clickedBtn.querySelector('.opt-feedback-icon').innerHTML = '❌';
      
      correctBtn.classList.add('correct-reveal');
      correctBtn.querySelector('.opt-feedback-icon').innerHTML = '✅';
    }

    // Save answer data
    gameState.userAnswers.push({
      question: question.question,
      options: question.options,
      selectedIndex: selectedIndex,
      correctIndex: correctIndex,
      timeTaken: parseFloat(timeTaken),
      isCorrect: isCorrect,
      explanation: question.explanation
    });

    enableNextQuestionButton();
  };

  const handleTimeout = () => {
    const question = gameState.questionsList[gameState.currentQuestionIndex];
    const correctIndex = question.correctIndex;

    // Sound alert
    SoundEffects.playWrong();

    // Disable options
    const optionButtons = gameOptionsGrid.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
      btn.disabled = true;
      const idx = parseInt(btn.getAttribute('data-index'));
      if (idx === correctIndex) {
        btn.classList.add('correct-reveal');
        btn.querySelector('.opt-feedback-icon').innerHTML = '⏰';
      }
    });

    gameState.userAnswers.push({
      question: question.question,
      options: question.options,
      selectedIndex: -1, // -1 indicating timeout
      correctIndex: correctIndex,
      timeTaken: 15.0,
      isCorrect: false,
      explanation: question.explanation
    });

    enableNextQuestionButton();
  };

  const enableNextQuestionButton = () => {
    btnNextQuestion.disabled = false;
    btnNextQuestion.classList.remove('disabled-btn');
  };

  btnNextQuestion.addEventListener('click', () => {
    SoundEffects.playClick();
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex < gameState.questionsList.length) {
      loadQuestion(gameState.currentQuestionIndex);
    } else {
      endQuiz();
    }
  });

  // ==========================================================================
  // LIFELINES IMPLEMENTATION
  // ==========================================================================
  btnLifeline5050.addEventListener('click', () => {
    if (gameState.lifelines.fiftyFifty.used) return;
    
    SoundEffects.playLifeline();
    gameState.lifelines.fiftyFifty.used = true;
    btnLifeline5050.classList.add('used');
    btnLifeline5050.disabled = true;

    const question = gameState.questionsList[gameState.currentQuestionIndex];
    const correctIndex = question.correctIndex;
    const optionButtons = gameOptionsGrid.querySelectorAll('.option-btn');

    // Find all incorrect option indices
    let incorrectIndices = [];
    optionButtons.forEach((_, idx) => {
      if (idx !== correctIndex) incorrectIndices.push(idx);
    });

    // Shuffle incorrect indices and pick 2 to eliminate
    incorrectIndices.sort(() => Math.random() - 0.5);
    const toEliminate = incorrectIndices.slice(0, 2);

    toEliminate.forEach(idx => {
      const btn = optionButtons[idx];
      btn.style.opacity = '0.15';
      btn.disabled = true;
    });
  });

  btnLifelineTime.addEventListener('click', () => {
    if (gameState.lifelines.extraTime.used) return;

    SoundEffects.playLifeline();
    gameState.lifelines.extraTime.used = true;
    btnLifelineTime.classList.add('used');
    btnLifelineTime.disabled = true;

    // Add 10 seconds to remaining time
    gameState.timeLeft += 10;
    gameState.maxTime += 10; // increase max scale to balance UI
    updateTimerUI();
  });

  btnLifelinePoll.addEventListener('click', () => {
    if (gameState.lifelines.audiencePoll.used) return;

    SoundEffects.playLifeline();
    gameState.lifelines.audiencePoll.used = true;
    btnLifelinePoll.classList.add('used');
    btnLifelinePoll.disabled = true;

    const question = gameState.questionsList[gameState.currentQuestionIndex];
    const correctIndex = question.correctIndex;
    const optionsCount = question.options.length;

    // Generate simulated votes
    let votes = Array(optionsCount).fill(0);
    let remainingPercentage = 100;

    // Smart vote weight distribution based on difficulty
    let correctWeight = 65; // Easy default
    if (question.difficulty === 'medium') correctWeight = 50;
    if (question.difficulty === 'hard') correctWeight = 38;

    // Guarantee the correct answer gets higher voting weight
    votes[correctIndex] = Math.floor(Math.random() * 15) + correctWeight;
    remainingPercentage -= votes[correctIndex];

    // Distribute remaining percentages among wrong options
    let wrongIndices = [];
    for (let i = 0; i < optionsCount; i++) {
      if (i !== correctIndex) wrongIndices.push(i);
    }

    wrongIndices.forEach((idx, listIndex) => {
      if (listIndex === wrongIndices.length - 1) {
        votes[idx] = remainingPercentage;
      } else {
        const val = Math.floor(Math.random() * (remainingPercentage - 5));
        votes[idx] = val;
        remainingPercentage -= val;
      }
    });

    // Populate Audience Poll modal bars
    pollBarsContainer.innerHTML = '';
    question.options.forEach((opt, idx) => {
      const optLetter = String.fromCharCode(65 + idx);
      const row = document.createElement('div');
      row.className = 'poll-option-row';
      row.innerHTML = `
        <div class="poll-label-row">
          <span>Option ${optLetter}</span>
          <span>${votes[idx]}%</span>
        </div>
        <div class="poll-bar-outer">
          <div class="poll-bar-inner" style="width: 0%"></div>
        </div>
      `;
      pollBarsContainer.appendChild(row);
      
      // Delay slightly to trigger visual transition
      setTimeout(() => {
        row.querySelector('.poll-bar-inner').style.width = `${votes[idx]}%`;
      }, 50);
    });

    // Display modal overlay
    audiencePollModal.classList.remove('hidden');
  });

  btnClosePoll.addEventListener('click', () => {
    SoundEffects.playClick();
    audiencePollModal.classList.add('hidden');
  });

  // ==========================================================================
  // GAME END & HIGH SCORES
  // ==========================================================================
  const endQuiz = () => {
    navigateTo('gameOver');

    // Compute stats
    const totalQuestions = gameState.questionsList.length;
    const correctCount = gameState.userAnswers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    
    let lifelinesCount = 0;
    if (gameState.lifelines.fiftyFifty.used) lifelinesCount++;
    if (gameState.lifelines.extraTime.used) lifelinesCount++;
    if (gameState.lifelines.audiencePoll.used) lifelinesCount++;

    const totalTimeTaken = gameState.userAnswers.reduce((sum, current) => sum + current.timeTaken, 0);
    const avgSpeed = (totalQuestions > 0 ? (totalTimeTaken / totalQuestions) : 0).toFixed(1);

    // Apply values to UI
    statFinalScore.textContent = gameState.score;
    statAccuracy.textContent = `${accuracy}%`;
    statLifelines.textContent = `${lifelinesCount} / 3`;
    statSpeed.textContent = `${avgSpeed}s`;

    // High score review toggle reset
    reviewSection.classList.add('hidden');
    btnViewReview.textContent = "Review Answers";

    // Win vs Loss Headers
    if (accuracy >= 80) {
      resultTitle.textContent = "Outstanding Victory! 🏆";
      resultSubtitle.textContent = "You're a certified trivia champion.";
      SoundEffects.playVictory();
      // Explode confetti particles
      setTimeout(() => {
        Confetti.start(confettiCanvas, 150);
      }, 300);
    } else if (accuracy >= 50) {
      resultTitle.textContent = "Quiz Completed!";
      resultSubtitle.textContent = "Good job, you passed the challenge!";
      SoundEffects.playVictory();
    } else {
      resultTitle.textContent = "Better Luck Next Time!";
      resultSubtitle.textContent = "Study up and try again to improve your score.";
      SoundEffects.playGameOver();
    }

    // High score validation check
    const categoryKey = gameState.selectedCategory;
    if (checkIfHighScore(gameState.score, categoryKey)) {
      highScoreForm.classList.remove('hidden');
      playerNameInput.value = '';
      playerNameInput.focus();
    } else {
      highScoreForm.classList.add('hidden');
    }
  };

  const checkIfHighScore = (score, category) => {
    if (score <= 0) return false;
    const list = gameState.highScores.filter(s => s.category === category);
    if (list.length < 5) return true;
    
    // Sort scores descending
    list.sort((a, b) => b.score - a.score);
    return score > list[list.length - 1].score;
  };

  btnSubmitScore.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (!name) {
      alert("Please enter your name to save the high score!");
      return;
    }

    SoundEffects.playClick();
    saveHighScore(name, gameState.score, gameState.selectedCategory, gameState.selectedDifficulty);
    highScoreForm.classList.add('hidden');
    showLeaderboard(gameState.selectedCategory);
  });

  const saveHighScore = (name, score, category, difficulty) => {
    const newRecord = {
      name: name,
      score: score,
      category: category,
      difficulty: difficulty,
      accuracy: statAccuracy.textContent,
      date: new Date().toLocaleDateString()
    };

    gameState.highScores.push(newRecord);
    localStorage.setItem('quiz_high_scores', JSON.stringify(gameState.highScores));
  };

  const loadHighScores = () => {
    const scores = localStorage.getItem('quiz_high_scores');
    gameState.highScores = scores ? JSON.parse(scores) : [];
  };

  // Play Again/Reset Action Handler
  btnPlayAgain.addEventListener('click', () => {
    SoundEffects.playClick();
    startQuiz();
  });

  btnResultMenu.addEventListener('click', () => {
    SoundEffects.playClick();
    navigateTo('menu');
  });

  // Review List render toggle
  btnViewReview.addEventListener('click', () => {
    SoundEffects.playClick();
    if (reviewSection.classList.contains('hidden')) {
      renderReviewList();
      reviewSection.classList.remove('hidden');
      btnViewReview.textContent = "Hide Review";
      
      // Scroll to review section smoothly
      reviewSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      reviewSection.classList.add('hidden');
      btnViewReview.textContent = "Review Answers";
    }
  });

  const renderReviewList = () => {
    reviewList.innerHTML = '';
    gameState.userAnswers.forEach((ans, idx) => {
      const card = document.createElement('div');
      card.className = 'review-item';
      
      const badgeClass = ans.isCorrect ? 'correct' : 'incorrect';
      const badgeText = ans.isCorrect ? 'Correct' : ans.selectedIndex === -1 ? 'Time Out' : 'Incorrect';

      let optionsHTML = '';
      ans.options.forEach((opt, oIdx) => {
        let optClass = 'review-opt';
        if (oIdx === ans.correctIndex) optClass += ' correct-choice';
        if (oIdx === ans.selectedIndex && !ans.isCorrect) optClass += ' user-choice';
        
        const letter = String.fromCharCode(65 + oIdx);
        optionsHTML += `<div class="${optClass}">${letter}: ${escapeHTML(opt)}</div>`;
      });

      let explanationHTML = '';
      if (ans.explanation) {
        explanationHTML = `<div class="review-explanation">${escapeHTML(ans.explanation)}</div>`;
      }

      card.innerHTML = `
        <div class="review-item-header">
          <h4>Q${idx + 1}: ${escapeHTML(ans.question)}</h4>
          <span class="review-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="review-grid">
          ${optionsHTML}
        </div>
        ${explanationHTML}
      `;
      reviewList.appendChild(card);
    });
  };

  // ==========================================================================
  // LEADERBOARDS SCREEN MANAGEMENT
  // ==========================================================================
  const showLeaderboard = (categoryFilter = 'all') => {
    navigateTo('leaderboard');
    
    // Set active tab
    const tabs = leaderboardTabs.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-category') === categoryFilter) {
        tab.classList.add('active');
      }
    });

    renderLeaderboardRows(categoryFilter);
  };

  const renderLeaderboardRows = (categoryFilter) => {
    leaderboardTbody.innerHTML = '';

    // Filter scores list
    let filtered = [...gameState.highScores];
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }

    // Sort descending score
    filtered.sort((a, b) => b.score - a.score);

    if (filtered.length === 0) {
      leaderboardEmpty.classList.remove('hidden');
    } else {
      leaderboardEmpty.classList.add('hidden');
      
      const catNames = {
        all: "All Topics",
        general: "General Knowledge",
        science: "Science & Tech",
        history: "History",
        geography: "Geography",
        popculture: "Pop Culture",
        webdev: "Web Dev"
      };

      filtered.forEach((record, index) => {
        const row = document.createElement('tr');
        
        // Resolve custom category title name
        let catLabel = catNames[record.category] || record.category;
        if (record.category.startsWith('custom-')) {
          const quizIdx = parseInt(record.category.split('-')[1]);
          const quizObj = gameState.customQuizzes[quizIdx];
          catLabel = quizObj ? `Custom: ${quizObj.title}` : "Custom Quiz";
        }

        row.innerHTML = `
          <td><span class="rank-pill">${index + 1}</span></td>
          <td><strong>${escapeHTML(record.name)}</strong></td>
          <td><span class="badge">${catLabel}</span></td>
          <td class="text-center" style="text-transform: capitalize;">${record.difficulty || 'Any'}</td>
          <td class="text-right accent-text"><strong>${record.score}</strong></td>
          <td class="text-right">${record.accuracy || '100%'}</td>
        `;
        leaderboardTbody.appendChild(row);
      });
    }
  };

  // Add click listeners to tabs
  const tabs = leaderboardTabs.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      SoundEffects.playClick();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderLeaderboardRows(tab.getAttribute('data-category'));
    });
  });

  btnShowLeaderboard.addEventListener('click', () => {
    SoundEffects.playClick();
    showLeaderboard('all');
  });

  btnLeaderboardBack.addEventListener('click', () => {
    SoundEffects.playClick();
    navigateTo('menu');
  });

  btnClearScores.addEventListener('click', () => {
    if (confirm("Are you sure you want to permanently delete all registered high scores?")) {
      SoundEffects.playClick();
      gameState.highScores = [];
      localStorage.removeItem('quiz_high_scores');
      renderLeaderboardRows('all');
    }
  });

  // ==========================================================================
  // CUSTOM QUIZ BUILDER MANAGEMENT
  // ==========================================================================
  const loadCustomQuizzes = () => {
    const saved = localStorage.getItem('quiz_custom_quizzes');
    gameState.customQuizzes = saved ? JSON.parse(saved) : [];
  };

  btnShowCreator.addEventListener('click', () => {
    SoundEffects.playClick();
    
    // Reset Form Input states
    quizTitleInput.value = '';
    quizCategorySelect.selectedIndex = 0;
    quizDifficultySelect.selectedIndex = 0;
    gameState.tempCustomQuizQuestions = [];
    
    renderCreatorQuestionsList();
    resetQuestionInputForm();

    navigateTo('creator');
  });

  const resetQuestionInputForm = () => {
    questionPromptInput.value = '';
    optionInputs.forEach(input => input.value = '');
    correctOptSelect.selectedIndex = 0;
    questionExplanationInput.value = '';
  };

  const renderCreatorQuestionsList = () => {
    creatorQuestionsCount.textContent = gameState.tempCustomQuizQuestions.length;
    creatorQuestionsList.innerHTML = '';

    if (gameState.tempCustomQuizQuestions.length === 0) {
      creatorQuestionsList.innerHTML = '<p class="empty-questions-msg">No questions added yet. Add at least 3 questions to save your quiz.</p>';
      return;
    }

    gameState.tempCustomQuizQuestions.forEach((q, idx) => {
      const row = document.createElement('div');
      row.className = 'creator-question-row';
      row.innerHTML = `
        <span>Q${idx + 1}: ${escapeHTML(q.question)}</span>
        <button class="btn-delete-question" title="Delete question">&times;</button>
      `;
      row.querySelector('.btn-delete-question').addEventListener('click', () => {
        SoundEffects.playClick();
        gameState.tempCustomQuizQuestions.splice(idx, 1);
        renderCreatorQuestionsList();
      });
      creatorQuestionsList.appendChild(row);
    });
  };

  // Add question to builder buffer
  btnAddQuestion.addEventListener('click', () => {
    const questionText = questionPromptInput.value.trim();
    const opts = optionInputs.map(input => input.value.trim());
    const correctIndex = parseInt(correctOptSelect.value);
    const explanation = questionExplanationInput.value.trim();

    if (!questionText) {
      alert("Please enter the question prompt!");
      return;
    }

    const unfilledOpt = opts.some(opt => !opt);
    if (unfilledOpt) {
      alert("Please fill in all 4 options!");
      return;
    }

    SoundEffects.playClick();

    const newQuestion = {
      category: quizCategorySelect.value,
      difficulty: quizDifficultySelect.value,
      question: questionText,
      options: opts,
      correctIndex: correctIndex,
      explanation: explanation
    };

    gameState.tempCustomQuizQuestions.push(newQuestion);
    renderCreatorQuestionsList();
    resetQuestionInputForm();
  });

  // Save the custom quiz to local storage
  btnSaveQuiz.addEventListener('click', () => {
    const quizTitle = quizTitleInput.value.trim();
    if (!quizTitle) {
      alert("Please enter a title for your custom quiz!");
      return;
    }

    if (gameState.tempCustomQuizQuestions.length < 3) {
      alert("A quiz must have at least 3 questions before saving!");
      return;
    }

    SoundEffects.playClick();

    const newQuiz = {
      title: quizTitle,
      category: quizCategorySelect.value,
      difficulty: quizDifficultySelect.value,
      questions: gameState.tempCustomQuizQuestions
    };

    gameState.customQuizzes.push(newQuiz);
    localStorage.setItem('quiz_custom_quizzes', JSON.stringify(gameState.customQuizzes));

    renderCategoryGrid();
    navigateTo('menu');
  });

  btnCreatorBack.addEventListener('click', () => {
    SoundEffects.playClick();
    navigateTo('menu');
  });

  // Start Button Event
  btnStart.addEventListener('click', () => {
    SoundEffects.playClick();
    startQuiz();
  });

  // Clean-up functions
  window.addEventListener('beforeunload', () => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  });

  // Run the initializer
  initApp();
});