const nameInput = document.getElementById('username-input');
const stepName = document.getElementById('step-name');
const stepLogin = document.getElementById('step-login');
const stepRegister = document.getElementById('step-register');

let pendingUsername = '';

document.getElementById('continue-btn').addEventListener('click', async () => {
  const username = nameInput.value.trim();
  if (!username) return;
  pendingUsername = username;
  const btn = document.getElementById('continue-btn');
  btn.disabled = true;
  btn.textContent = 'Checking…';
  try {
    const res = await Api.checkUser(username);
    if (res.exists) {
      document.getElementById('welcome-back-text').textContent = `Welcome back, ${username}! Enter your PIN.`;
      stepName.style.display = 'none';
      stepLogin.style.display = 'block';
      document.getElementById('pin-login-input').focus();
    } else {
      document.getElementById('not-registered-text').textContent = `"${username}" isn't registered yet. Want to create an account?`;
      stepName.style.display = 'none';
      stepRegister.style.display = 'block';
      document.getElementById('pin-register-input').focus();
    }
  } catch (e) {
    alert('Could not reach the server. Check your connection and try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Continue';
  }
});

document.getElementById('back-from-login').addEventListener('click', () => {
  stepLogin.style.display = 'none';
  stepName.style.display = 'block';
});
document.getElementById('back-from-register').addEventListener('click', () => {
  stepRegister.style.display = 'none';
  stepName.style.display = 'block';
});

document.getElementById('login-btn').addEventListener('click', async () => {
  const pin = document.getElementById('pin-login-input').value.trim();
  const errEl = document.getElementById('login-error');
  errEl.style.display = 'none';
  if (!/^\d{4}$/.test(pin)) {
    errEl.textContent = 'Enter your 4-digit PIN.';
    errEl.style.display = 'block';
    return;
  }
  const res = await Api.login(pendingUsername, pin);
  if (res.exists && res.pinOk) {
    Session.set(pendingUsername);
    window.location.href = 'home.html';
  } else {
    errEl.textContent = 'Incorrect PIN. Try again.';
    errEl.style.display = 'block';
  }
});

document.getElementById('register-btn').addEventListener('click', async () => {
  const pin = document.getElementById('pin-register-input').value.trim();
  const errEl = document.getElementById('register-error');
  errEl.style.display = 'none';
  if (!/^\d{4}$/.test(pin)) {
    errEl.textContent = 'Choose a 4-digit PIN.';
    errEl.style.display = 'block';
    return;
  }
  const res = await Api.createUser(pendingUsername, pin);
  if (res.success) {
    Session.set(pendingUsername);
    window.location.href = 'home.html';
  } else {
    errEl.textContent = res.error || 'Something went wrong. Try again.';
    errEl.style.display = 'block';
  }
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('continue-btn').click();
});
