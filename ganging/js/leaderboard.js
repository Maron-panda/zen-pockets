Session.require();

const STAR_SVG = '<svg class="star-icon" viewBox="0 0 24 24"><path d="M12 1 L14.7 8.5 L22.8 8.7 L16.3 13.6 L18.6 21.3 L12 16.8 L5.4 21.3 L7.7 13.6 L1.2 8.7 L9.3 8.5 Z" fill="#fff"/></svg>';

(async function () {
  const res = await Api.getLeaderboard();
  document.getElementById('board-loading').style.display = 'none';
  const board = res.leaderboard || [];

  if (board.length === 0) {
    document.getElementById('board-empty').style.display = 'block';
    return;
  }
  document.getElementById('board-view').style.display = 'block';

  const placeClasses = ['first', 'second', 'third'];
  const top3 = board.slice(0, 3);
  document.getElementById('podium').innerHTML = top3.map((p, i) => `
    <div class="pod ${placeClasses[i]}">
      ${STAR_SVG}
      <div class="name">${escapeHtml(p.username)}</div>
      <div class="score">${p.score}</div>
    </div>`).join('');

  const rest = board.slice(3, 5);
  document.getElementById('rank-rows').innerHTML = rest.map((p, i) => `
    <div class="rank-row">
      <span class="n">${i + 4}. ${escapeHtml(p.username)}</span>
      <span>${p.score} · ${formatDate(p.date_iso)}</span>
    </div>`).join('');
})();

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
