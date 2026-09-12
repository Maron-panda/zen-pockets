// Starter achievement set. Add more by adding objects here -- each needs a
// unique id, a display label, and a check(profile) function returning true/false.
// profile = the object returned by Api.getUserProfile (badges, total_sessions, sessions[]).
const ACHIEVEMENTS = [
  { id: 'first_steps', label: 'First Steps', check: (p) => p.total_sessions >= 1 },
  { id: 'dedicated_5', label: 'Dedicated x5', check: (p) => p.total_sessions >= 5 },
  { id: 'dedicated_20', label: 'Dedicated x20', check: (p) => p.total_sessions >= 20 },
  {
    id: 'sharp_shooter',
    label: 'Sharp Shooter',
    check: (p) => p.sessions.length > 0 && p.sessions[0].mode && p.sessions[0].mode.startsWith('battle') && Number(p.sessions[0].accuracy_pct) >= 90
  },
  { id: 'on_fire', label: 'On Fire', check: (p) => computeStreak(p.sessions) >= 3 }
];

function computeStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const days = [...new Set(sessions.map(s => String(s.date).slice(0, 10)))].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  for (const d of days) {
    const day = new Date(d);
    const diffDays = Math.round((stripTime(cursor) - stripTime(day)) / 86400000);
    if (diffDays === streak || diffDays === streak + 1) {
      streak++;
      cursor = day;
    } else {
      break;
    }
  }
  return streak;
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// Fetches the latest profile, checks every achievement, awards any newly earned
// ones via the API, and returns the list of achievements just unlocked.
async function evaluateAndAwardAchievements(username) {
  const profile = await Api.getUserProfile(username);
  if (profile.error) return [];
  const newlyEarned = [];
  for (const a of ACHIEVEMENTS) {
    if (!profile.badges.includes(a.id) && a.check(profile)) {
      await Api.addBadge(username, a.id);
      newlyEarned.push(a);
    }
  }
  return newlyEarned;
}
