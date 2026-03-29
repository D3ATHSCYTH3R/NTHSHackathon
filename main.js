/* ============================================
   FINANCECENTRAL — MAIN.JS  (Global Scope)
   All gate functions are global so inline
   onclick= handlers in HTML work correctly.
============================================ */

const STORAGE_KEY = 'fc_user_v3';
let profile = null;

/* ─── FORMAT HELPERS ─────────────────────── */
function fmt(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n || 0);
}
function setInner(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val != null ? val : '';
}

/* ─── GATE TOGGLE ────────────────────────── */
function gateSwitch(tab) {
  const loginForm  = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const loginTab   = document.getElementById('gtab-login');
  const signupTab  = document.getElementById('gtab-signup');
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
  }
}

/* ─── LOGIN ──────────────────────────────── */
function doLogin() {
  const name = document.getElementById('login-name').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err  = document.getElementById('login-err');
  err.textContent = '';

  if (!name || !pass) { err.textContent = 'Please fill in both fields.'; return; }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) { err.textContent = 'No profile found. Click "Create Profile" to get started.'; return; }

  try {
    const p = JSON.parse(saved);
    if (p.name.toLowerCase() !== name.toLowerCase() || p.password !== pass) {
      err.textContent = 'Incorrect name or password. Try again.'; return;
    }
    profile = p;
    showApp();
  } catch (e) {
    err.textContent = 'Could not read profile. Please create a new one.';
  }
}

/* ─── SIGNUP ─────────────────────────────── */
function doSignup() {
  const err = document.getElementById('signup-err');
  err.textContent = '';

  const name   = document.getElementById('su-name').value.trim();
  const pass   = document.getElementById('su-pass').value;
  const income = document.getElementById('su-income').value;

  if (!name)   { err.textContent = 'Please enter your full name.';     return; }
  if (!pass)   { err.textContent = 'Please create a password.';        return; }
  if (!income) { err.textContent = 'Please enter your annual income.'; return; }

  profile = {
    name,
    password:    pass,
    family:      document.getElementById('su-family').value.trim(),
    income:      parseFloat(income) || 0,
    debts:       parseFloat(document.getElementById('su-debts').value)     || 0,
    credit:      parseInt(document.getElementById('su-credit').value)      || 650,
    insurance:   parseFloat(document.getElementById('su-insurance').value) || 0,
    retireAge:   parseInt(document.getElementById('su-ret-age').value)     || 65,
    retireMoney: parseFloat(document.getElementById('su-ret-money').value) || 1000000,
    chatHistory: []
  };

  saveProfile();
  showApp();
}

/* ─── LOGOUT ─────────────────────────────── */
function doLogout() {
  profile = null;
  document.getElementById('login-gate').style.display = 'flex';
  document.getElementById('app').classList.add('hidden');
  document.getElementById('form-login').reset();
  document.getElementById('login-err').textContent = '';
  gateSwitch('login');
}

/* ─── SAVE ───────────────────────────────── */
function saveProfile() {
  if (profile) localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/* ─── SHOW APP ───────────────────────────── */
function showApp() {
  document.getElementById('login-gate').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');
  updateNavUser();
  populateHomeDash();
  populateProfilePage();
  populateAISnapshot();
  navTo('home');
}

/* ─── NAVIGATION ─────────────────────────── */
function navTo(page) {
  // Hide all pages — also strip the 'hidden' class so we control display purely via inline style
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.add('hidden');
    p.style.display = '';
  });

  // Show the target page — must remove 'hidden' FIRST (it has display:none !important)
  const el = document.getElementById('page-' + page);
  if (el) {
    el.classList.remove('hidden');
    el.classList.add('active');
  }

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('data-page') === page);
  });

  // Populate dynamic profile values on specific pages
  if (page === 'ai') renderAIPage();
  if (page === 'credit' && profile) {
    setInner('credit-art-score',  profile.credit);
    setInner('credit-hero-score', profile.credit);
    setInner('credit-hero-debts', fmt(profile.debts));
  }
  if (page === 'insurance' && profile) {
    setInner('insure-hero-monthly', fmt(profile.insurance) + '/mo');
  }
  if (page === 'investing' && profile) {
    setInner('invest-hero-retire', fmt(profile.retireMoney));
  }
}

/* ─── NAV USER ───────────────────────────── */
function updateNavUser() {
  setInner('nav-name', profile.name.split(' ')[0]);
  setInner('nav-avatar', profile.name.charAt(0).toUpperCase());
}

/* ─── HOME DASHBOARD ─────────────────────── */
function populateHomeDash() {
  setInner('home-income',       fmt(profile.income));
  setInner('home-debts',        fmt(profile.debts));
  setInner('home-credit-score', profile.credit + ' / 850');
  setInner('home-retire',       fmt(profile.retireMoney));
}

/* ─── PROFILE PAGE ───────────────────────── */
function populateProfilePage() {
  if (!profile) return;
  setInner('prof-display-name',   profile.name);
  setInner('prof-display-family', profile.family || 'Not specified');
  const av = document.getElementById('prof-big-avatar');
  if (av) av.textContent = profile.name.charAt(0).toUpperCase();
  setInner('prof-show-income',    fmt(profile.income));
  setInner('prof-show-debts',     fmt(profile.debts));
  setInner('prof-show-credit',    profile.credit + ' / 850');
  setInner('prof-show-insurance', fmt(profile.insurance) + ' / mo');
  setInner('prof-show-ret-age',   profile.retireAge);
  setInner('prof-show-ret-money', fmt(profile.retireMoney));
  setVal('upd-name',      profile.name);
  setVal('upd-family',    profile.family || '');
  setVal('upd-income',    profile.income);
  setVal('upd-debts',     profile.debts);
  setVal('upd-credit',    profile.credit);
  setVal('upd-insurance', profile.insurance);
  setVal('upd-ret-age',   profile.retireAge);
  setVal('upd-ret-money', profile.retireMoney);
}

function doUpdateProfile() {
  if (!profile) return;
  const newName = document.getElementById('upd-name').value.trim();
  if (newName) profile.name = newName;
  profile.family      = document.getElementById('upd-family').value.trim();
  profile.income      = parseFloat(document.getElementById('upd-income').value)    || profile.income;
  profile.debts       = parseFloat(document.getElementById('upd-debts').value)     || profile.debts;
  profile.credit      = parseInt(document.getElementById('upd-credit').value)      || profile.credit;
  profile.insurance   = parseFloat(document.getElementById('upd-insurance').value) || profile.insurance;
  profile.retireAge   = parseInt(document.getElementById('upd-ret-age').value)     || profile.retireAge;
  profile.retireMoney = parseFloat(document.getElementById('upd-ret-money').value) || profile.retireMoney;
  const newPass = document.getElementById('upd-pass').value;
  if (newPass) profile.password = newPass;

  saveProfile();
  updateNavUser();
  populateHomeDash();
  populateProfilePage();
  populateAISnapshot();

  const msg = document.getElementById('upd-success');
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 3000);
}

/* ─── AI SNAPSHOT CARDS ──────────────────── */
function populateAISnapshot() {
  const container = document.getElementById('ai-feedback-snapshot');
  if (!container || !profile) return;
  container.innerHTML = '';
  generateSnapshotCards().forEach(c => {
    const div = document.createElement('div');
    div.className = 'fb-card';
    div.innerHTML = `<div class="fb-card-title">${c.title}</div><span class="fb-tag ${c.tag}">${c.tagLabel}</span><div class="fb-card-body">${c.body}</div>`;
    container.appendChild(div);
  });
}

function generateSnapshotCards() {
  const p = profile;
  const cards = [];
  const dtiRatio = p.income > 0 ? ((p.debts / p.income) * 100).toFixed(0) : 0;

  // Credit
  const cTier  = p.credit >= 740 ? 'good' : p.credit >= 670 ? 'warn' : 'danger';
  const cLabel = p.credit >= 740 ? 'Excellent' : p.credit >= 670 ? 'Fair' : 'Needs Work';
  cards.push({
    title: 'Credit Score: ' + p.credit,
    tag: cTier, tagLabel: cLabel,
    body: p.credit >= 740
      ? `Your score of ${p.credit} qualifies you for top-tier mortgage and loan rates. Maintain utilization below 10% to sustain this level.`
      : p.credit >= 670
      ? `Your score of ${p.credit} is good but sub-optimal. Zero missed payments and reducing utilization below 20% can push you into Excellent range within 6–12 months.`
      : `Your score of ${p.credit} significantly limits your borrowing power. Focus on on-time payments and aggressive balance paydown over the next 6 months as your top priority.`
  });

  // Debt
  const dTag = dtiRatio < 20 ? 'good' : dtiRatio < 50 ? 'warn' : 'danger';
  cards.push({
    title: 'Debt-to-Income: ' + dtiRatio + '%',
    tag: dTag, tagLabel: dtiRatio < 20 ? 'Healthy' : dtiRatio < 50 ? 'Elevated' : 'Critical',
    body: dtiRatio < 20
      ? `DTI of ${dtiRatio}% is excellent. Continue steady payments and redirect freed cash flow into your investment portfolio aggressively.`
      : dtiRatio < 50
      ? `DTI of ${dtiRatio}% is manageable but elevated. Use the Debt Avalanche—target your highest-interest debt with every spare dollar while maintaining minimums on the rest.`
      : `DTI of ${dtiRatio}% is high. Prioritize debt consolidation or a balance transfer to reduce your effective rate, halt all discretionary spending, and apply every available dollar toward repayment.`
  });

  // Insurance
  const iRatio = p.income > 0 ? ((p.insurance * 12 / p.income) * 100).toFixed(1) : 0;
  const iTag = iRatio < 8 ? 'good' : iRatio < 15 ? 'warn' : 'danger';
  cards.push({
    title: 'Insurance: ' + fmt(p.insurance) + '/mo',
    tag: iTag, tagLabel: iRatio + '% of income',
    body: iRatio < 8
      ? `Insurance at ${iRatio}% of annual income is well-optimized. Review policies annually to prevent loyalty premium creep.`
      : `${iRatio}% of annual income on insurance is above ideal. Re-quote auto and home coverage and evaluate whether an HDHP + HSA could reduce your health insurance premium significantly.`
  });

  // Retirement
  const yearsLeft = Math.max(p.retireAge - 35, 5);
  const monthlyNeeded = Math.round(p.retireMoney / (yearsLeft * 12 * 100)) * 100;
  cards.push({
    title: 'Retirement Goal: ' + fmt(p.retireMoney),
    tag: 'warn', tagLabel: 'Plan Active',
    body: `To reach ${fmt(p.retireMoney)} by age ${p.retireAge}, invest approximately ${fmt(monthlyNeeded)}/month assuming 10% average market returns. Priority order: (1) 401k employer match, (2) Roth IRA max, (3) taxable brokerage in index funds.`
  });

  return cards;
}

/* ─── AI PAGE ────────────────────────────── */
function renderAIPage() {
  populateAISnapshot();
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  msgs.innerHTML = '';
  appendAIBubble(`Hello${profile ? ', ' + profile.name.split(' ')[0] : ''}! I have analyzed your financial profile and am ready to provide personalized guidance. Your snapshot is on the left. What would you like to explore?`);
  if (profile && profile.chatHistory) {
    profile.chatHistory.forEach(m => {
      if (m.role === 'user') appendUserBubble(m.text);
      else appendAIBubble(m.text);
    });
  }
}

/* ─── CHAT ───────────────────────────────── */
function sendChat() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';
  appendUserBubble(text);
  if (!profile.chatHistory) profile.chatHistory = [];
  profile.chatHistory.push({ role: 'user', text });

  showTyping();
  setTimeout(() => {
    hideTyping();
    const reply = getAIReply(text);
    appendAIBubble(reply);
    profile.chatHistory.push({ role: 'ai', text: reply });
    saveProfile();
  }, 900 + Math.random() * 800);
}

// Allow Enter key to send
document.addEventListener('DOMContentLoaded', function () {
  const ci = document.getElementById('chat-input');
  if (ci) ci.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); sendChat(); }
  });
});

function appendAIBubble(text) {
  const area = document.getElementById('chat-messages');
  if (!area) return;
  const div = document.createElement('div');
  div.className = 'chat-msg ai-msg';
  div.innerHTML = `<div class="chat-avatar-ai">FC</div><div class="chat-bubble">${text}</div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function appendUserBubble(text) {
  const area = document.getElementById('chat-messages');
  if (!area) return;
  const init = profile ? profile.name.charAt(0).toUpperCase() : 'U';
  const div = document.createElement('div');
  div.className = 'chat-msg user-msg';
  div.innerHTML = `<div class="chat-avatar-user">${init}</div><div class="chat-bubble">${text}</div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

let typingEl = null;
function showTyping() {
  const area = document.getElementById('chat-messages');
  if (!area) return;
  typingEl = document.createElement('div');
  typingEl.className = 'chat-msg ai-msg';
  typingEl.innerHTML = `<div class="chat-avatar-ai">FC</div><div class="chat-bubble"><div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
  area.appendChild(typingEl);
  area.scrollTop = area.scrollHeight;
}
function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

/* ─── AI REPLY ENGINE ────────────────────── */
function getAIReply(input) {
  if (!profile) return "Please log in to receive personalized advice.";
  const p = profile;
  const lower = input.toLowerCase();

  if (/(credit|score|fico)/i.test(lower)) {
    if (p.credit >= 740) return `Your score of ${p.credit} is Excellent. To maintain and optimize further: request credit limit increases without spending more, keep utilization under 10% across all cards, and avoid opening new accounts within 6 months of any major financing event like a mortgage application.`;
    if (p.credit >= 670) return `Your score of ${p.credit} is good but has meaningful room to improve. Three high-impact moves: (1) pay every bill on or before the due date, (2) pay down revolving balances to below 20% utilization, (3) dispute any inaccuracies on your three bureau reports. A 50–80 point improvement in 12 months is realistic with disciplined execution.`;
    return `With a score of ${p.credit}, rebuilding is your top financial priority—it affects every borrowing cost you face. Start with: a secured credit card with a $500 limit, use it for one recurring small bill, pay it in full monthly. Consider asking a family member to add you as an authorized user on their older, well-maintained account. These steps alone can move your score 40–60 points in 6 months.`;
  }

  if (/(debt|loan|owe|payoff|pay off)/i.test(lower)) {
    const dti = p.income > 0 ? ((p.debts / p.income) * 100).toFixed(1) : '—';
    return `Your debt-to-income ratio is approximately ${dti}%. ${parseFloat(dti) > 40 ? `This is elevated and should be your primary financial focus right now. I recommend the Debt Avalanche: list all debts by interest rate, make minimum payments on all, and funnel every spare dollar toward the highest-rate balance. Simultaneously, explore 0% APR balance transfer cards for any high-rate credit card debt—this alone can save thousands in interest.` : `This is manageable. For any debt above 7% interest rate, apply extra payments aggressively before increasing investment contributions. For debt beneath 5%, consider making only minimums and investing the surplus—the expected market return exceeds the debt's cost.`}`;
  }

  if (/(invest|stock|market|ira|401k|roth|fund|etf)/i.test(lower)) {
    const yearsLeft = Math.max(p.retireAge - 35, 5);
    return `Based on your income of ${fmt(p.income)} and retirement goal of ${fmt(p.retireMoney)} by age ${p.retireAge} (${yearsLeft} years away), your investment priority stack should be: (1) 401(k) up to the full employer match—that is a guaranteed 50–100% return, (2) Roth IRA at $7,000/year for tax-free growth, (3) taxable brokerage in a simple S&P 500 index fund (VOO or FXAIX at ~0.03% expense ratio). Dollar-cost average consistently every payday and never pause during market downturns.`;
  }

  if (/(insurance|coverage|premium|hsa|deductible)/i.test(lower)) {
    return `You are spending ${fmt(p.insurance)}/month on insurance. For optimization: (1) shop your auto and home insurance annually—loyalty penalties are real and switching or re-quoting commonly saves $300–$600/year, (2) if on a high-premium health plan, evaluate switching to an HDHP paired with an HSA—your HSA funds grow tax-free and carry over indefinitely unlike FSAs, (3) verify your life insurance covers 10–12x your annual income (${fmt(p.income * 10)} to ${fmt(p.income * 12)}) if you have dependents.`;
  }

  if (/(budget|save|saving|spend|emergency|fund)/i.test(lower)) {
    const monthly = Math.round(p.income / 12);
    return `On ${fmt(p.income)}/year (~${fmt(monthly)}/month), a professional allocation: 50% (${fmt(monthly * 0.5)}) to necessities, 20% (${fmt(monthly * 0.2)}) to savings and investing, 10% (${fmt(monthly * 0.1)}) to debt paydown above minimums, 15% (${fmt(monthly * 0.15)}) to variable living, 5% (${fmt(monthly * 0.05)}) discretionary. Automate transfers on payday—spending becomes bounded by what remains, not the reverse. Your emergency fund target: ${fmt(monthly * 3)} to ${fmt(monthly * 6)} in an HYSA.`;
  }

  if (/(retire|retirement)/i.test(lower)) {
    const yearsLeft = Math.max(p.retireAge - 35, 5);
    const monthlyNeeded = Math.round(p.retireMoney / (yearsLeft * 12 * 50)) * 50;
    return `To reach ${fmt(p.retireMoney)} by age ${p.retireAge} (~${yearsLeft} years), assuming 10% average annual returns, you need to invest approximately ${fmt(monthlyNeeded)}/month consistently. Prioritize: (1) 401(k) up to employer match, (2) max Roth IRA ($583/month = $7,000/year), (3) remaining surplus into a taxable brokerage in index funds. Start now—every year of delay meaningfully reduces your ending balance.`;
  }

  if (/(banking|savings|hysa|account)/i.test(lower)) {
    return `For banking optimization at your income level of ${fmt(p.income)}/year: (1) your emergency fund target is ${fmt(Math.round(p.income / 12) * 3)}–${fmt(Math.round(p.income / 12) * 6)}—move it into an HYSA earning 4.5%+ (Marcus, Ally, SoFi), (2) set up automated paycheck splits on direct deposit day so money moves before you can spend it, (3) audit your statements for recurring fees and eliminate every one. The simple switch from a big bank savings account to an HYSA on a ${fmt(p.income / 12 * 3)} emergency fund earns you an extra ${fmt(Math.round(p.income / 12 * 3 * 0.046))} per year at no risk.`;
  }

  if (/(hello|hi|hey|help|start)/i.test(lower)) {
    return `Hello, ${p.name.split(' ')[0]}! I can give you personalized analysis on your credit (${p.credit}/850), debts (${fmt(p.debts)}), insurance (${fmt(p.insurance)}/mo), income (${fmt(p.income)}/yr), and retirement strategy (${fmt(p.retireMoney)} goal by age ${p.retireAge}). What would you like to tackle first?`;
  }

  return `Great question. Based on your financial profile—income of ${fmt(p.income)}, debts of ${fmt(p.debts)}, credit score of ${p.credit}, and a retirement goal of ${fmt(p.retireMoney)} by age ${p.retireAge}—my primary recommendation is to focus on ${p.debts > p.income * 0.3 ? 'aggressive debt reduction using the Debt Avalanche method' : p.credit < 700 ? 'structured credit score rebuilding' : 'maximizing tax-advantaged investment contributions through your 401k and Roth IRA'}. Ask me specifically about banking, credit, insurance, investing, budgeting, or retirement for a deeper analysis.`;
}

/* ─── BOOT ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      profile = JSON.parse(saved);
      if (profile && profile.name && profile.password) {
        showApp();
        return;
      }
    } catch (e) { profile = null; }
  }
  document.getElementById('login-gate').style.display = 'flex';
  document.getElementById('app').classList.add('hidden');
});
