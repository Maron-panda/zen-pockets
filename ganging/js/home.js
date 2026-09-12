(async function () {
  const username = Session.require();
  if (!username) return;
  document.getElementById('greet-text').textContent = `Welcome back, ${username}`;

  const profile = await Api.getUserProfile(username);
  if (profile.error) {
    document.getElementById('streak-text').textContent = '';
    return;
  }
  const streak = computeStreak(profile.sessions);
  const lastBattle = profile.sessions.find(s => s.mode && s.mode.startsWith('battle'));

  let text = '';
  if (streak > 0) text += `🔥 ${streak}-day streak`;
  if (lastBattle) text += (text ? ' · ' : '') + `${lastBattle.accuracy_pct}% accuracy last battle`;
  document.getElementById('streak-text').textContent = text || 'Play your first round to get started!';
})();
