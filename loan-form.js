// Form submission handler for loan tracker
document.getElementById('loanForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const amount = document.getElementById('amount').value;
  const notes = document.getElementById('notes').value;
  const date = document.getElementById('date').value;
  const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
  const kg = document.getElementById('kg').checked;
  const lg = document.getElementById('lg').checked;
  
  const data = { 
    amount: amount,
    notes: notes,
    date: date,
    transactionType: transactionType,
    kg: kg,
    lg: lg
  };
  
  fetch('https://script.google.com/macros/s/AKfycbx_EbCS2ZlxxziXlQwlC4r3knwhaOHtdIIlfnbEjP6uRxa29se39Bm1e13ct0tll0wK/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  // Format date for receipt
  const receiptDate = date ? new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Build checkbox tags
  let tags = [];
  if (kg) tags.push('KG');
  if (lg) tags.push('LG');
  const tagString = tags.length > 0 ? tags.join(', ') : 'None';
  
  // Create receipt
  document.getElementById('statusMessage').innerHTML = `
    <div class="receipt-message">
      <div class="receipt-header">
        🌸 Transaction Receipt 🌸
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Type:</span>
        <span class="receipt-value">${transactionType === 'borrow' ? 'Borrowed 💸' : 'Returned 💰'}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Amount:</span>
        <span class="receipt-value">${amount} NOK</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Friend:</span>
        <span class="receipt-value">${notes}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Date:</span>
        <span class="receipt-value">${receiptDate}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Tags:</span>
        <span class="receipt-value">${tagString}</span>
      </div>
      <div class="receipt-footer">
        ✨ Recorded with care! ✨
      </div>
    </div>`;
    
  document.getElementById('loanForm').reset();
});
