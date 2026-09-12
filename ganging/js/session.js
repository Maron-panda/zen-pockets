// Tracks which student is currently using this browser tab.
// Uses sessionStorage (clears when the tab closes) rather than localStorage,
// so a shared classroom device doesn't stay "logged in" as the last student.
// This never stores scores or progress -- that all lives in the Sheet.
const Session = {
  KEY: 'currentUser',
  get() { return sessionStorage.getItem(this.KEY); },
  set(username) { sessionStorage.setItem(this.KEY, username); },
  clear() { sessionStorage.removeItem(this.KEY); },
  require() {
    const u = this.get();
    if (!u) { window.location.href = 'index.html'; return null; }
    return u;
  }
};
