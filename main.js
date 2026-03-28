// Session Management
let currentSession = null;

// Navigation Function
function showSection(sectionId, button) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update AI analysis if visited
    if (sectionId === 'ai-advisor') {
        updateAIAnalysis();
    }
    
    // Handle profile section display
    if (sectionId === 'profile') {
        showProfileInterface();
    }
}

// Profile UI Navigation Functions
function showAuthOptions() {
    document.getElementById('authOptions').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('createForm').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('authOptions').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('createForm').style.display = 'none';
    restoreLoginData(); // Restore saved data
    document.getElementById('loginError').style.display = 'none';
}

function showCreateForm() {
    document.getElementById('authOptions').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('createForm').style.display = 'block';
    document.getElementById('createProfileForm').reset();
}

// Create new profile function
function createProfile(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('createFirstName').value.trim();
    const lastName = document.getElementById('createLastName').value.trim();
    const password = document.getElementById('createPassword').value;
    
    const profileData = {
        name: firstName + ' ' + lastName,
        age: document.getElementById('createAge').value,
        income: document.getElementById('createIncome').value,
        creditScore: document.getElementById('createCreditScore').value,
        debts: document.getElementById('createDebts').value,
        insurance: document.getElementById('createInsurance').value,
        retirementAge: document.getElementById('createRetirementAge').value,
        retirementGoal: document.getElementById('createRetirementGoal').value,
        savings: document.getElementById('createSavings').value,
        netWorth: document.getElementById('createNetWorth').value,
        investments: document.getElementById('createInvestments').value,
        family: document.getElementById('createFamily').value,
        savedDate: new Date().toLocaleString()
    };
    
    // Store credentials
    const credentials = {
        firstName: firstName,
        lastName: lastName,
        password: password
    };
    
    localStorage.setItem('userCredentials', JSON.stringify(credentials));
    currentSession = { firstName, lastName };
    sessionStorage.setItem('currentUser', JSON.stringify(currentSession));
    sessionStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    successMsg.textContent = '✓ Profile created successfully! You are now logged in.';
    
    // Clear form inputs
    document.getElementById('createProfileForm').reset();
    
    setTimeout(() => {
        successMsg.style.display = 'none';
        showProfileInterface();
    }, 2000);
}

// Login user function
function loginUser(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('loginFirstName').value.trim();
    const lastName = document.getElementById('loginLastName').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const credentials = localStorage.getItem('userCredentials');
    if (!credentials) {
        alert('No account found. Please create a profile first.');
        return;
    }
    
    const stored = JSON.parse(credentials);
    
    if (stored.firstName === firstName && stored.lastName === lastName && stored.password === password) {
        currentSession = { firstName, lastName };
        sessionStorage.setItem('currentUser', JSON.stringify(currentSession));
        showProfileInterface();
        document.getElementById('loginError').style.display = 'none';
    } else {
        document.getElementById('loginError').style.display = 'block';
        document.getElementById('loginError').textContent = '❌ Invalid credentials. Try again.';
    }
}

function logoutUser() {
    currentSession = null;
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userProfile');
    document.getElementById('profileForm').reset();
    document.getElementById('loginForm').reset();
    document.getElementById('createForm').reset();
    saveLoginData(); // Save data before clearing fields
    showProfileInterface();
}

// Update existing profile function
function updateProfile(event) {
    event.preventDefault();
    
    const profileData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        income: document.getElementById('income').value,
        creditScore: document.getElementById('creditScore').value,
        debts: document.getElementById('debts').value,
        insurance: document.getElementById('insurance').value,
        retirementAge: document.getElementById('retirementAge').value,
        retirementGoal: document.getElementById('retirementGoal').value,
        savings: document.getElementById('savings').value,
        netWorth: document.getElementById('netWorth').value,
        investments: document.getElementById('investments').value,
        family: document.getElementById('family').value,
        savedDate: new Date().toLocaleString()
    };
    
    // Update profile in session
    sessionStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Show success message
    const successMsg = document.getElementById('viewSuccessMessage');
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

function saveProfile(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('name').value.split(' ')[0] || document.getElementById('firstName').value;
    const lastName = document.getElementById('name').value.split(' ').slice(1).join(' ') || document.getElementById('lastName').value;
    const password = document.getElementById('password').value;
    
    const profileData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        income: document.getElementById('income').value,
        creditScore: document.getElementById('creditScore').value,
        debts: document.getElementById('debts').value,
        insurance: document.getElementById('insurance').value,
        retirementAge: document.getElementById('retirementAge').value,
        retirementGoal: document.getElementById('retirementGoal').value,
        family: document.getElementById('family').value,
        savedDate: new Date().toLocaleString()
    };
    
    // Store credentials separately (only first, last, password)
    const credentials = {
        firstName: firstName,
        lastName: lastName,
        password: password
    };
    
    // Save credentials
    localStorage.setItem('userCredentials', JSON.stringify(credentials));
    
    // Save profile data - immediately delete it from localStorage after saving
    // This creates a session-only profile
    currentSession = { firstName, lastName };
    sessionStorage.setItem('currentUser', JSON.stringify(currentSession));
    sessionStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    successMsg.textContent = '✓ Profile saved! You are now logged in.';
    setTimeout(() => {
        successMsg.style.display = 'none';
        showProfileInterface();
    }, 2000);
}

function showProfileInterface() {
    const authOptions = document.getElementById('authOptions');
    const loginForm = document.getElementById('loginForm');
    const createForm = document.getElementById('createForm');
    const profileFormWrapper = document.getElementById('profileFormWrapper');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentSession || sessionStorage.getItem('currentUser')) {
        currentSession = JSON.parse(sessionStorage.getItem('currentUser'));
        authOptions.style.display = 'none';
        loginForm.style.display = 'none';
        createForm.style.display = 'none';
        profileFormWrapper.style.display = 'block';
        logoutBtn.style.display = 'inline-block';
        loadProfileData();
    } else {
        authOptions.style.display = 'block';
        loginForm.style.display = 'none';
        createForm.style.display = 'none';
        profileFormWrapper.style.display = 'none';
        logoutBtn.style.display = 'none';
        document.getElementById('loginForm').reset();
        document.getElementById('createForm').reset();
    }
}

function loadProfileData() {
    const saved = sessionStorage.getItem('userProfile');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('name').value = data.name || '';
        document.getElementById('age').value = data.age || '';
        document.getElementById('income').value = data.income || '';
        document.getElementById('creditScore').value = data.creditScore || '';
        document.getElementById('debts').value = data.debts || '';
        document.getElementById('insurance').value = data.insurance || '';
        document.getElementById('retirementAge').value = data.retirementAge || '';
        document.getElementById('retirementGoal').value = data.retirementGoal || '';
        document.getElementById('savings').value = data.savings || '';
        document.getElementById('netWorth').value = data.netWorth || '';
        document.getElementById('investments').value = data.investments || '';
        document.getElementById('family').value = data.family || '';
    }
}

// AI Advisor Responses Database
const aiResponses = {
    credit: "Based on your profile, working on credit score improvement could save significant money on loans and mortgages. Focus on paying bills on time and reducing credit utilization below 30%.",
    debt: "Your debt situation is important to address. Consider the avalanche method (highest interest first) or snowball method (smallest balance first) for psychological motivation.",
    retirement: "Your retirement goals are achievable! Based on your income and target age, calculated savings needed shows your progress. Consider maximizing 401k and IRA contributions.",
    emergency: "Building a 3-6 month emergency fund is crucial. This prevents reliance on credit during unexpected situations.",
    investing: "Starting an investment strategy early maximizes compound growth. Consider low-cost index funds and target-date funds for simplified investing.",
    insurance: "Your insurance costs seem reasonable. Annually review coverage to ensure you're not over or under-insured for your situation.",
    savings: "Your income provides opportunity for wealth building. Aim to save 20% of income after taxes—split between emergency fund, debt payoff, and investments.",
    banking: "Optimizing your banking setup with high-yield savings could increase returns significantly. Review current rates versus available options."
};

// Send AI message function
function sendMessage() {
    const input = document.getElementById('userInput');
    const messages = document.getElementById('chatMessages');
    const userMsg = input.value.trim();
    
    if (!userMsg) return;
    
    const saved = sessionStorage.getItem('userProfile');
    if (!saved) {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai-message';
        aiMsg.textContent = 'Please complete your profile first to get personalized advice!';
        messages.appendChild(aiMsg);
        messages.scrollTop = messages.scrollHeight;
        input.value = '';
        return;
    }
    
    // Add user message
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.textContent = userMsg;
    messages.appendChild(userDiv);
    
    // Generate AI response
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai-message';
    
    const lowerMsg = userMsg.toLowerCase();
    let response = "I'm here to help with your finances. Ask about credit, debt, retirement, emergency funds, investing, insurance, savings, or banking strategies.";
    
    for (let key in aiResponses) {
        if (lowerMsg.includes(key)) {
            response = aiResponses[key];
            break;
        }
    }
    
    aiMsg.textContent = response;
    messages.appendChild(aiMsg);
    messages.scrollTop = messages.scrollHeight;
    input.value = '';
}

// Listen for Enter key in chat
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    // Initialize profile interface on page load
    showProfileInterface();
});

// Update AI Analysis Dashboard
function updateAIAnalysis() {
    const saved = sessionStorage.getItem('userProfile');
    if (!saved) {
        document.getElementById('healthAnalysis').innerHTML = '<div class="analysis-item">Complete your profile to get analysis</div>';
        document.getElementById('recommendations').innerHTML = '<div class="analysis-item">Complete your profile to get recommendations</div>';
        document.getElementById('metrics').innerHTML = '<div class="analysis-item">Complete your profile to see metrics</div>';
        return;
    }
    
    const data = JSON.parse(saved);
    const age = parseInt(data.age);
    const income = parseFloat(data.income);
    const debts = parseFloat(data.debts);
    const creditScore = parseInt(data.creditScore);
    const insurance = parseFloat(data.insurance);
    const retirementAge = parseInt(data.retirementAge);
    const savings = parseFloat(data.savings || 0);
    const investments = parseFloat(data.investments || 0);
    const netWorth = parseFloat(data.netWorth || 0);
    const monthlyExpenses = income - (insurance + 500); // Rough estimate
    
    // Health Analysis
    let health = '';
    const debtIncomeRatio = (debts / (income * 12)) * 100;
    if (debtIncomeRatio < 20) health = '✓ Debt levels are healthy';
    else if (debtIncomeRatio < 40) health = '⚠ Moderate debt—focus on paydown';
    else health = '⛔ High debt—prioritize aggressive payoff';
    
    let creditHealth = '';
    if (creditScore >= 750) creditHealth = '✓ Excellent credit score';
    else if (creditScore >= 700) creditHealth = '✓ Good credit score';
    else if (creditScore >= 650) creditHealth = '⚠ Fair credit—room for improvement';
    else creditHealth = '⛔ Poor credit—urgent improvement needed';
    
    document.getElementById('healthAnalysis').innerHTML = `
        <div class="metric">
            <span class="metric-label">Debt-to-Income Ratio:</span>
            <span class="metric-value">${debtIncomeRatio.toFixed(1)}%</span>
        </div>
        <div class="metric ${debtIncomeRatio < 20 ? 'success' : debtIncomeRatio < 40 ? '' : 'alert'}">
            <span class="metric-label">Status:</span>
            <span class="metric-value">${health}</span>
        </div>
        <div class="metric ${creditScore >= 750 ? 'success' : creditScore >= 700 ? '' : creditScore >= 650 ? '' : 'alert'}">
            <span class="metric-label">Credit Score:</span>
            <span class="metric-value">${creditScore} - ${creditHealth}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Years to Retirement:</span>
            <span class="metric-value">${retirementAge - age} years</span>
        </div>
    `;
    
    // Recommendations
    const recommendations = [];
    if (debtIncomeRatio > 30) recommendations.push('🚨 Prioritize debt payoff—use avalanche or snowball method');
    if (creditScore < 700) recommendations.push('📈 Improve credit score to unlock better interest rates');
    if (age > 50 && (retirementAge - age) < 15) recommendations.push('⏰ Aggressive retirement savings needed—maximize contributions');
    if (debtIncomeRatio < 10) recommendations.push('💡 Low debt—excellent position to start investing');
    if (creditScore >= 750) recommendations.push('✓ Excellent credit—lock in low rates on any debt');
    if (!recommendations.length) recommendations.push('Continue current financial trajectory—monitor quarterly');
    
    document.getElementById('recommendations').innerHTML = recommendations.map(r => `<div class="analysis-item">${r}</div>`).join('');
    
    // Metrics
    const yearsToRetirement = retirementAge - age;
    const projectedNeed = parseFloat(data.retirementGoal);
    const monthlyNeeded = projectedNeed / (yearsToRetirement * 12);
    const savingsPotential = (monthlyExpenses * 0.2).toFixed(0); // 20% savings rate
    
    document.getElementById('metrics').innerHTML = `
        <div class="metric">
            <span class="metric-label">Monthly Income:</span>
            <span class="metric-value">$${income.toFixed(0)}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Current Debts:</span>
            <span class="metric-value">$${debts.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Current Savings:</span>
            <span class="metric-value">$${savings.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Investments:</span>
            <span class="metric-value">$${investments.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Net Worth:</span>
            <span class="metric-value">$${netWorth.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Savings Potential (20%):</span>
            <span class="metric-value">$${savingsPotential}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Monthly for Retirement:</span>
            <span class="metric-value">$${monthlyNeeded.toFixed(0)}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Retirement Goal:</span>
            <span class="metric-value">$${parseFloat(data.retirementGoal).toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
        </div>
    `;
}

// Save login data to localStorage
function saveLoginData() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    localStorage.setItem('loginData', JSON.stringify({ username, password }));
}

// Restore login data from localStorage
function restoreLoginData() {
    const savedData = JSON.parse(localStorage.getItem('loginData'));
    if (savedData) {
        document.getElementById('username').value = savedData.username || '';
        document.getElementById('password').value = savedData.password || '';
    }
}
