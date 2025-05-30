// Form submission handler
document.getElementById('budgetForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const data = { 
    pay: document.getElementById('pay').value,
    notes: document.getElementById('notes').value,
    date: document.getElementById('date').value
  };
  
  fetch('https://script.google.com/macros/s/AKfycbwpZk0uPc5wRGvo5qKuE7ZUhUanft_Ax45erylAuvGqoj4B_Dp0YDR6hkKYqYPm-Qzp3g/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  document.getElementById('statusMessage').innerHTML = `
    <div class="success-message">
      🌸 Your budget has been submitted, Maron! <br>Time to sip boba and relax! 🫧🫧
    </div>`;
    
  document.getElementById('budgetForm').reset();
});
