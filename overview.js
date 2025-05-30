// Data structure - initialized with zeros for fallback
let data = {
  overview: [{
    Loan: 0,
    Savings: 0,
    Charity: 0,
    Fond: 0,
    FreeUse: 0,
    total: 0,
    payCount: 3
  }],
  totalView: {
    Loan: 0,
    Savings: 0,
    Charity: 0,
    Fond: 0,
    FreeUse: 0,
    Total: 0,
    roundingBuffer: 0
  },
  lastPay: {
    Loan: 0,
    Savings: 0,
    Charity: 0,
    Fond: 0,
    FreeUse: 0,
    Total: 0
  }
};

// DOM elements
const viewToggle = document.getElementById('viewToggle');
const toggleLabel = document.getElementById('toggleLabel');
const tableBody = document.getElementById('tableBody');
const amountHeader = document.getElementById('amountHeader');
const roundingFootnote = document.getElementById('roundingFootnote');
const momorinText = document.getElementById('momorinText');

// Initialize the page
function initializePage() {
  // Fetch data from Google Sheets
  fetchDataFromSheets()
    .then(() => {
      populateTable('monthly');
      updateExtraInfo();
    })
    .catch(error => {
      console.error('Error initializing page:', error);
      // Initialize with fallback data
      populateTable('monthly');
      updateExtraInfo();
    });

  // Set up event listeners
  setupEventListeners();
}

// Fetch data from Google Sheets
async function fetchDataFromSheets() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwpZk0uPc5wRGvo5qKuE7ZUhUanft_Ax45erylAuvGqoj4B_Dp0YDR6hkKYqYPm-Qzp3g/exec');
    const jsonData = await response.json();
    data = jsonData;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

// Set up event listeners
function setupEventListeners() {
  viewToggle.addEventListener('change', handleViewToggle);
}

// Handle view toggle between monthly and total view
function handleViewToggle() {
  const view = viewToggle.checked ? 'total' : 'monthly';
  toggleLabel.textContent = viewToggle.checked ? 'Total View' : 'Monthly View';
  amountHeader.textContent = viewToggle.checked ? 'Total' : 'This Month';
  populateTable(view);
}

// Populate the data table
function populateTable(view) {
  tableBody.innerHTML = '';
  const isTotalView = view === 'total';
  const source = isTotalView ? data.totalView : data.overview[data.overview.length - 1];
  
  const categories = [
    { key: 'Loan', label: 'Loan' },
    { key: 'Savings', label: 'Savings' },
    { key: 'Charity', label: 'Charity' },
    { key: 'Fond', label: 'Fond' },
    { key: 'FreeUse', label: 'Free Use' }
  ];
  
  // Create category rows
  categories.forEach(cat => {
    const row = createTableRow(
      cat.label,
      `${source[cat.key]} NOK`,
      `${data.lastPay[cat.key]} NOK`
    );
    tableBody.appendChild(row);
  });

  // Create total row
  const totalRow = createTableRow(
    'Total',
    `${isTotalView ? source.Total : source.total} NOK`,
    `${data.lastPay.Total} NOK`,
    true
  );
  tableBody.appendChild(totalRow);
}

// Create a table row
function createTableRow(category, amount, lastPay, isTotal = false) {
  const row = document.createElement('tr');
  if (isTotal) {
    row.classList.add('total-row');
  }

  const categoryCell = document.createElement('td');
  categoryCell.textContent = category;

  const amountCell = document.createElement('td');
  amountCell.textContent = amount;

  const lastPayCell = document.createElement('td');
  lastPayCell.textContent = lastPay;

  row.appendChild(categoryCell);
  row.appendChild(amountCell);
  row.appendChild(lastPayCell);

  return row;
}

// Update extra information on the page
function updateExtraInfo() {
  updateRoundingFootnote();
  updateMomorinMessage();
}

// Update rounding buffer footnote
function updateRoundingFootnote() {
  roundingFootnote.textContent = `* Rounding buffer is currently ${data.totalView.roundingBuffer} NOK.`;
}

// Update Momorin message
function updateMomorinMessage() {
  const paysThisMonth = data.overview[data.overview.length - 1].payCount;
  momorinText.textContent = `Momorin 🐾: You have in total ${paysThisMonth} pays this month!`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
