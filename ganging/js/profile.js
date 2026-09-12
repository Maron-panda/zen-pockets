const username = Session.require();

(async function () {
  if (!username) return;
  const profile = await Api.getUserProfile(username);
  document.getElementById('profile-loading').style.display = 'none';
  if (profile.error) return;
  document.getElementById('profile-view').style.display = 'block';

  document.getElementById('profile-name').textContent = username;
  const avgAccuracy = profile.sessions.length
    ? Math.round(profile.sessions.reduce((sum, s) => sum + Number(s.accuracy_pct || 0), 0) / profile.sessions.length)
    : 0;
  document.getElementById('profile-meta').textContent = `${profile.total_sessions} sessions · ${avgAccuracy}% avg accuracy`;

  document.getElementById('badge-case').innerHTML = ACHIEVEMENTS.map(a => {
    const earned = profile.badges.includes(a.id);
    return `<div class="badge-slot"><div class="badge-star ${earned ? '' : 'locked'}"></div><div class="badge-label">${a.label}</div></div>`;
  }).join('');

  const rows = profile.sessions.map(s => `
    <div class="log-row">
      <span>${formatDate(s.date)} · ${formatMode(s.mode, s.table)}</span>
      <span class="acc">${s.accuracy_pct}%</span>
    </div>`).join('');
  document.getElementById('session-log').innerHTML = rows || '<div class="loading">No sessions yet.</div>';
})();

function formatMode(mode, table) {
  if (mode === 'battle-normal') return 'Battle (Normal)';
  if (mode === 'battle-adaptive') return 'Battle (Character Dev.)';
  if (mode && String(mode).startsWith('practice')) return `Practice ${table}×`;
  return mode;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
