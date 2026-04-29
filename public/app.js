import { roadmapData, checklistData, glossaryData, formsData, beginnerSteps } from './data.js';

// Data for Flashcards and Quiz
const electionData = {
    flashcards: [
        { front: "Who conducts elections in India?", back: "The Election Commission of India (ECI)." },
        { front: "What is the electoral system for Lok Sabha?", back: "The 'First-Past-the-Post' (simple majority) system." },
        { front: "What is 'NOTA'?", back: "None of the Above — a voting option for voters to disapprove all candidates." },
        { front: "What is the Model Code of Conduct?", back: "A set of guidelines for political parties to ensure fair campaigning." },
        { front: "What is VVPAT?", back: "Voter Verifiable Paper Audit Trail — used with EVMs for verification." },
        { front: "Minimum age for voting?", back: "18 years." }
    ],
    quiz: [
        {
            question: "Which body supervises the entire electoral process in India?",
            options: ["Parliament", "Supreme Court", "Election Commission of India", "The President"],
            answer: 2
        },
        {
            question: "What is the maximum number of candidates an EVM can support?",
            options: ["16", "32", "64", "128"],
            answer: 2
        },
        {
            question: "Which machine is used for casting votes in India?",
            options: ["IBM", "EVM", "VVPAT", "ATM"],
            answer: 1
        },
        {
            question: "The Election Commission was established in which year?",
            options: ["1947", "1950", "1952", "1960"],
            answer: 1
        },
        {
            question: "What is the term of the Lok Sabha?",
            options: ["4 years", "5 years", "6 years", "Permanent"],
            answer: 1
        },
        {
            question: "What does VVPAT stand for?",
            options: ["Voter Verified Paper Audit Trail", "Voter Validated Paper Account Trail", "Voter Verification Paper Audit Tool", "Voter Verifiable Paper Audit Trail"],
            answer: 3
        },
        {
            question: "Who appoints the Chief Election Commissioner of India?",
            options: ["The Prime Minister", "The Chief Justice", "The President", "The Parliament"],
            answer: 2
        },
        {
            question: "What is the minimum age to contest in Lok Sabha elections?",
            options: ["18 years", "21 years", "25 years", "30 years"],
            answer: 2
        },
        {
            question: "The 'Model Code of Conduct' comes into force from which date?",
            options: ["Date of Polling", "Date of Nominations", "Date of Election Announcement", "Date of Results"],
            answer: 2
        },
        {
            question: "Which article of the Constitution provides for an Election Commission?",
            options: ["Article 324", "Article 356", "Article 370", "Article 280"],
            answer: 0
        }
    ]
};

// --- Global askAI Function ---
window.askAI = function(question) {
    // Switch to home view
    switchView('home');
    
    // Fill the input
    const input = document.getElementById('user-input');
    input.value = question;
    
    // Smooth scroll to chat
    document.querySelector('.chat-card').scrollIntoView({ behavior: 'smooth' });
    
    // Trigger send
    document.getElementById('send-btn').click();
};

// --- AI Chat Logic ---
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function getLocalAIResponse(text) {
    const query = text.toLowerCase();
    
    // Greetings
    if (query.match(/^(hi|hello|hey|namaste)/)) {
        return "Namaste! How can I help you learn about Indian elections today? You can ask me about registration, EVMs, or any specific forms!";
    }
    
    // Forms
    for (const form of formsData) {
        if (query.includes(form.title.toLowerCase()) || query.includes(form.id.toLowerCase())) {
            return `**${form.title}** is used for: ${form.purpose} It is meant for ${form.who}. You will need: ${form.proof}`;
        }
    }
    
    // Glossary
    for (const item of glossaryData) {
        if (query.includes(item.term.toLowerCase()) || query.includes(item.term.replace(/\s+/g, '').toLowerCase())) {
            return `**${item.term}**: ${item.definition}`;
        }
    }
    
    // Roadmap / Checklist keywords
    if (query.includes('register') || query.includes('how to vote')) {
        return "To register, you need to fill out Form 6 on the NVSP portal. You must be 18+ and an Indian citizen. Check out the 'Forms & Docs' section!";
    }
    if (query.includes('result') || query.includes('counting')) {
        return "After voting, EVMs are secured. On counting day, votes are tallied and the candidate with the highest votes in a constituency wins.";
    }
    if (query.includes('ink')) {
        return "Indelible ink is applied to the left forefinger of voters to prevent multiple voting. It's a proud mark of participation!";
    }
    
    return null; // No local match found
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    const typingMsg = addMessage('...', 'system');

    // 1. Try local data matching first (Offline mode support)
    const localResponse = getLocalAIResponse(text);
    if (localResponse) {
        setTimeout(() => {
            typingMsg.remove();
            const msgObj = addMessage(localResponse, 'system');
            const badge = document.createElement('span');
            badge.className = 'demo-badge';
            badge.textContent = 'Instant Guide';
            msgObj.appendChild(badge);
        }, 400); // Small delay for realism
        return;
    }

    // 2. Fallback to server API for complex questions
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        
        typingMsg.remove();
        if (data.response) {
            const msgObj = addMessage(data.response, 'system');
            if (data.isDemo) {
                const badge = document.createElement('span');
                badge.className = 'demo-badge';
                badge.textContent = 'Demo Mode';
                msgObj.appendChild(badge);
            }
        } else {
            addMessage('Error: ' + (data.error || 'Something went wrong'), 'system');
        }
    } catch (err) {
        typingMsg.remove();
        addMessage('Error connecting to the AI Assistant. But dont worry, I am still able to answer basic questions about forms, terms, and the election process! Try asking "What is an EVM?"', 'system');
    }
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// --- Suggestion Chips Logic ---
document.getElementById('chat-suggestions').addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-chip')) {
        const question = e.target.textContent.replace(/^[^\s]+\s/, ''); // Remove emoji
        userInput.value = `Tell me more about ${question}`;
        sendMessage();
    }
});

// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeButton(currentTheme);

themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton(currentTheme);
});

function updateThemeButton(theme) {
    themeToggleBtn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

// --- TTS Logic ---
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Text-to-Speech is not supported in this browser.");
    }
}

document.getElementById('tts-chat-btn').addEventListener('click', () => {
    const messages = document.querySelectorAll('.message');
    if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1].textContent;
        speakText(lastMsg);
    }
});

document.getElementById('tts-flashcard-btn').addEventListener('click', () => {
    const card = electionData.flashcards[currentCardIndex];
    const flashcardElement = document.querySelector('.flashcard');
    if (flashcardElement && flashcardElement.classList.contains('flipped')) {
        speakText(card.back);
    } else {
        speakText(card.front);
    }
});

// --- Navigation Logic ---
const views = {
    home: document.getElementById('view-home'),
    roadmap: document.getElementById('view-roadmap'),
    checklist: document.getElementById('view-checklist'),
    glossary: document.getElementById('view-glossary'),
    forms: document.getElementById('view-forms'),
    help: document.getElementById('view-help'),
    quiz: document.getElementById('view-quiz')
};

const navLinks = {
    home: document.getElementById('nav-home'),
    roadmap: document.getElementById('nav-roadmap'),
    checklist: document.getElementById('nav-checklist'),
    glossary: document.getElementById('nav-glossary'),
    forms: document.getElementById('nav-forms'),
    help: document.getElementById('nav-help'),
    quiz: document.getElementById('nav-quiz')
};

function switchView(viewName) {
    Object.values(views).forEach(v => { v.classList.remove('active'); v.classList.add('hidden'); });
    Object.values(navLinks).forEach(l => l.classList.remove('active'));

    views[viewName].classList.remove('hidden');
    views[viewName].classList.add('active');
    if (navLinks[viewName]) navLinks[viewName].classList.add('active');
    
    // Close mobile sidebar on navigation
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
}

Object.keys(navLinks).forEach(key => {
    navLinks[key].addEventListener('click', (e) => {
        e.preventDefault();
        switchView(key);
    });
});

document.getElementById('go-to-quiz-btn').addEventListener('click', () => switchView('quiz'));
document.getElementById('dash-checklist-btn').addEventListener('click', () => switchView('checklist'));

// --- Mobile Menu Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// --- Flashcards Logic ---
const singleFlashcardContainer = document.getElementById('single-flashcard-container');
const cardCounter = document.getElementById('card-counter');
let currentCardIndex = 0;

function renderFlashcard() {
    singleFlashcardContainer.innerHTML = '';
    const card = electionData.flashcards[currentCardIndex];
    
    const div = document.createElement('div');
    div.className = 'flashcard';
    div.innerHTML = `
        <div class="flashcard-inner">
            <div class="flashcard-front"><h3>${card.front}</h3></div>
            <div class="flashcard-back"><p>${card.back}</p></div>
        </div>
    `;
    div.addEventListener('click', () => div.classList.toggle('flipped'));
    singleFlashcardContainer.appendChild(div);
    
    cardCounter.textContent = `${currentCardIndex + 1}/${electionData.flashcards.length}`;
}

document.getElementById('prev-card').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex - 1 + electionData.flashcards.length) % electionData.flashcards.length;
    renderFlashcard();
});

document.getElementById('next-card').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex + 1) % electionData.flashcards.length;
    renderFlashcard();
});

// --- Roadmap Rendering ---
function renderRoadmap() {
    const container = document.getElementById('roadmap-container');
    container.innerHTML = '';
    
    roadmapData.forEach(step => {
        const isHighlight = step.id >= 11;
        const html = `
            <div class="timeline-item" data-step="${step.id}">
                <div class="timeline-marker ${isHighlight ? 'highlight-marker' : ''}">${step.icon}</div>
                <div class="timeline-content glass-card ${isHighlight ? 'highlight-card' : ''}">
                    <h3>${step.id}. ${step.title}</h3>
                    <p>${step.description}</p>
                    <button class="outline-btn ask-ai-btn" onclick="askAI('Tell me more about ${step.title} in Indian elections.')" aria-label="Ask AI about ${step.title}">
                        Ask Election Edu 🤖
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// --- Checklist Logic ---
function renderChecklist() {
    const container = document.getElementById('checklist-container');
    container.innerHTML = '';
    
    const savedProgress = JSON.parse(localStorage.getItem('electionChecklist')) || {};
    
    checklistData.forEach(item => {
        const isChecked = savedProgress[item.id] ? 'checked' : '';
        const completedClass = isChecked ? 'completed' : '';
        
        const html = `
            <label class="checklist-item ${completedClass}" for="chk-${item.id}">
                <input type="checkbox" id="chk-${item.id}" data-id="${item.id}" ${isChecked}>
                <span>${item.label}</span>
            </label>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    
    container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            savedProgress[id] = e.target.checked;
            localStorage.setItem('electionChecklist', JSON.stringify(savedProgress));
            
            const itemElement = e.target.closest('.checklist-item');
            if (e.target.checked) {
                itemElement.classList.add('completed');
                // Simple pop animation on check
                itemElement.style.transform = 'scale(1.02)';
                setTimeout(() => itemElement.style.transform = '', 200);
            } else {
                itemElement.classList.remove('completed');
            }
            updateChecklistProgress();
        });
    });
    
    updateChecklistProgress();
}

function updateChecklistProgress() {
    const savedProgress = JSON.parse(localStorage.getItem('electionChecklist')) || {};
    const completed = Object.values(savedProgress).filter(v => v).length;
    const total = checklistData.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    const pgBar = document.getElementById('checklist-progress-bar');
    const pgText = document.getElementById('checklist-percentage');
    if(pgBar) pgBar.style.width = `${percentage}%`;
    if(pgText) pgText.textContent = `${percentage}%`;
    
    const dashPgBar = document.getElementById('dash-checklist-progress');
    const dashPgText = document.getElementById('dash-checklist-text');
    if(dashPgBar) dashPgBar.style.width = `${percentage}%`;
    if(dashPgText) dashPgText.textContent = `${percentage}% Completed`;
}

document.getElementById('reset-checklist-btn').addEventListener('click', () => {
    if(confirm("Are you sure you want to reset your voting plan progress?")) {
        localStorage.removeItem('electionChecklist');
        renderChecklist();
    }
});

// --- Glossary Logic ---
function renderGlossary(filterText = '') {
    const container = document.getElementById('glossary-container');
    container.innerHTML = '';
    
    const filtered = glossaryData.filter(item => 
        item.term.toLowerCase().includes(filterText.toLowerCase()) || 
        item.definition.toLowerCase().includes(filterText.toLowerCase())
    );
    
    if(filtered.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary w-full">No terms found.</p>';
        return;
    }
    
    filtered.forEach(item => {
        const html = `
            <div class="glossary-card glass-card">
                <h3>${item.term}</h3>
                <p>${item.definition}</p>
                <button class="outline-btn ask-ai-btn" onclick="askAI('Explain ${item.term} in simple terms.')" aria-label="Ask AI about ${item.term}">
                    Ask AI 🤖
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

document.getElementById('glossary-search').addEventListener('input', (e) => {
    renderGlossary(e.target.value);
});

// --- Forms Logic ---
function renderForms() {
    const container = document.getElementById('forms-container');
    container.innerHTML = '';
    
    formsData.forEach(form => {
        const html = `
            <div class="form-card glass-card">
                <div class="flex-between">
                    <h3>${form.title}</h3>
                    <span class="header-icon">📄</span>
                </div>
                <p><strong>Purpose:</strong> ${form.purpose}</p>
                <p><strong>For:</strong> ${form.who}</p>
                <p><strong>Proof needed:</strong> ${form.proof}</p>
                <button class="outline-btn ask-ai-btn" onclick="askAI('How do I fill out ${form.title} for voter registration?')" aria-label="Ask AI about ${form.title}">
                    Ask Election Edu 🤖
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// --- Beginner Mode Logic ---
let currentBeginnerStep = 0;
const beginnerModal = document.getElementById('beginner-modal');
const beginnerTitle = document.getElementById('beginner-title');
const beginnerContent = document.getElementById('beginner-content');
const beginnerStepIndicator = document.getElementById('beginner-step-indicator');
const beginnerNextBtn = document.getElementById('beginner-next-btn');

document.getElementById('start-beginner-btn').addEventListener('click', () => {
    // Always start from beginning if they click the main button, 
    // or resume if they haven't finished.
    currentBeginnerStep = parseInt(localStorage.getItem('beginnerStep')) || 0;
    if(currentBeginnerStep >= beginnerSteps.length) {
        currentBeginnerStep = 0;
        localStorage.setItem('beginnerStep', 0);
    }
    openBeginnerModal();
});

document.getElementById('close-beginner-btn').addEventListener('click', () => {
    beginnerModal.classList.add('hidden');
});

function openBeginnerModal() {
    beginnerModal.classList.remove('hidden');
    renderBeginnerStep();
}

function renderBeginnerStep() {
    const step = beginnerSteps[currentBeginnerStep];
    beginnerTitle.textContent = step.title;
    beginnerContent.textContent = step.content;
    beginnerStepIndicator.textContent = `Step ${currentBeginnerStep + 1} of ${beginnerSteps.length}`;
    
    if (currentBeginnerStep === beginnerSteps.length - 1) {
        beginnerNextBtn.textContent = "Finish 🏆";
    } else {
        beginnerNextBtn.textContent = "Next Step ➡️";
    }
}

beginnerNextBtn.addEventListener('click', () => {
    currentBeginnerStep++;
    localStorage.setItem('beginnerStep', currentBeginnerStep);
    
    if (currentBeginnerStep >= beginnerSteps.length) {
        beginnerModal.classList.add('hidden');
        alert("Congratulations! You've completed the Beginner Guide!");
    } else {
        renderBeginnerStep();
    }
});

document.getElementById('beginner-ask-ai-btn').addEventListener('click', () => {
    beginnerModal.classList.add('hidden');
    askAI(`Tell me more about: ${beginnerSteps[currentBeginnerStep].title}`);
});

// --- Quiz Logic ---
let currentQuestionIndex = 0;
let score = 0;

const quizStart = document.getElementById('quiz-start');
const quizContent = document.getElementById('quiz-content');
const quizResult = document.getElementById('quiz-result');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progress = document.getElementById('progress');
const questionNumber = document.getElementById('question-number');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');

document.getElementById('start-quiz-btn').addEventListener('click', () => {
    quizStart.classList.add('hidden');
    quizContent.classList.remove('hidden');
    showQuestion();
});

function showQuestion() {
    const q = electionData.quiz[currentQuestionIndex];
    questionText.textContent = q.question;
    questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${electionData.quiz.length}`;
    progress.style.width = `${((currentQuestionIndex + 1) / electionData.quiz.length) * 100}%`;

    optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(idx, btn));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(idx, btn) {
    const q = electionData.quiz[currentQuestionIndex];
    const options = optionsContainer.querySelectorAll('.option');
    
    options.forEach(o => o.style.pointerEvents = 'none');

    if (idx === q.answer) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        options[q.answer].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < electionData.quiz.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    quizContent.classList.add('hidden');
    quizResult.classList.remove('hidden');
    const totalPoints = score * 10;
    finalScore.textContent = `${totalPoints} Points`;
    
    if (score === electionData.quiz.length) {
        resultMessage.textContent = "Excellent! You are an Election Expert! 🏆 (Perfect Score)";
    } else if (score > 2) {
        resultMessage.textContent = "Good job! You earned some solid points.";
    } else {
        resultMessage.textContent = "Keep learning! Every point counts in a democracy.";
    }
}

// --- Initialize App ---
function init() {
    renderFlashcard();
    renderRoadmap();
    renderChecklist();
    renderGlossary();
    renderForms();
}

init();
