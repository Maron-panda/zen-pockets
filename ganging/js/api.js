// Paste your deployed Apps Script Web App URL here (ends in /exec).
const API_URL = 'https://script.google.com/macros/s/AKfycbyCcJwX3ElYo0HJZTMvjbnFKPZBxGQLR9Q6ilLA27Yqu4e6cfh_fISXGmxz34iJTnl7JA/exec';

async function apiGet(action, params = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${API_URL}?${qs}`);
  return res.json();
}

// Uses text/plain content-type on purpose: it keeps the browser from sending
// a CORS preflight request, which Apps Script web apps don't handle well.
async function apiPost(action, body = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...body })
  });
  return res.json();
}

const Api = {
  checkUser: (username) => apiGet('checkUser', { username }),
  login: (username, pin) => apiGet('login', { username, pin }),
  createUser: (username, pin) => apiPost('createUser', { username, pin }),
  submitPracticeSession: (data) => apiPost('submitPracticeSession', data),
  submitBattleSession: (data) => apiPost('submitBattleSession', data),
  getFactStats: (username) => apiGet('getFactStats', { username }),
  getLeaderboard: () => apiGet('getLeaderboard'),
  getUserProfile: (username) => apiGet('getUserProfile', { username }),
  addBadge: (username, badgeId) => apiPost('addBadge', { username, badgeId })
};
