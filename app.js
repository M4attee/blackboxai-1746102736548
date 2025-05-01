// Main app logic for 3D printed objects store

// Utility: Show only one step section
function showStep(stepId) {
  document.querySelectorAll('.step').forEach((section) => {
    section.classList.add('hidden');
  });
  document.getElementById(stepId).classList.remove('hidden');
}

// Store user and order data in localStorage keys
const STORAGE_USERS = '3dstore_users';
const STORAGE_ORDERS = '3dstore_orders';

// Current session data
let currentUser = null;
let currentGrams = 0;
let currentPrice = 0;

// Registration form handling
const registrationForm = document.getElementById('registration-form');
registrationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = registrationForm.username.value.trim();
  const email = registrationForm.email.value.trim();
  const password = registrationForm.password.value;

  if (!username || !email || !password) {
    alert('Per favore, compila tutti i campi.');
    return;
  }

  // Save user to localStorage
  let users = JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
  if (users.find(u => u.username === username)) {
    alert('Nome utente già registrato.');
    return;
  }
  users.push({ username, email, password });
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  currentUser = { username, email };

  // Proceed to next step
  showStep('step-upload');
});

// 3D Model upload and grams calculation
const modelFileInput = document.getElementById('model-file');
const modelInfo = document.getElementById('model-info');
const toPersonalDataBtn = document.getElementById('to-personal-data');

modelFileInput.addEventListener('change', () => {
  const file = modelFileInput.files[0];
  if (!file) {
    modelInfo.textContent = '';
    toPersonalDataBtn.disabled = true;
    return;
  }
  if (!file.name.toLowerCase().endsWith('.stl')) {
    alert('Per favore, carica un file STL valido.');
    modelFileInput.value = '';
    modelInfo.textContent = '';
    toPersonalDataBtn.disabled = true;
    return;
  }

  // Read STL file and calculate grams
  const reader = new FileReader();
  reader.onload = function(event) {
    const contents = event.target.result;
    try {
      const loader = new THREE.STLLoader();
      const geometry = loader.parse(contents);
      geometry.computeBoundingBox();
      geometry.computeVertexNormals();

      // Calculate volume in cubic mm
      const volume = calculateVolume(geometry);
      // Assume PLA density ~1.24 g/cm3 = 1.24e-3 g/mm3
      const density = 0.00124;
      const grams = volume * density;

      currentGrams = grams;
      currentPrice = grams * 0.03 * 4;

      modelInfo.innerHTML = "Peso stimato: <strong>" + grams.toFixed(2) + " g</strong><br />Prezzo calcolato: <strong>€ " + currentPrice.toFixed(2) + "</strong>";
      toPersonalDataBtn.disabled = false;
    } catch (error) {
      alert('Errore nel caricamento del modello 3D.');
      modelInfo.textContent = '';
      toPersonalDataBtn.disabled = true;
    }
  };
  reader.readAsArrayBuffer(file);
});

// Volume calculation helper function for geometry
function calculateVolume(geometry) {
  let position = geometry.attributes.position;
  let volume = 0;
  for (let i = 0; i < position.count; i += 3) {
    const p1 = new THREE.Vector3().fromBufferAttribute(position, i);
    const p2 = new THREE.Vector3().fromBufferAttribute(position, i + 1);
    const p3 = new THREE.Vector3().fromBufferAttribute(position, i + 2);
    volume += signedVolumeOfTriangle(p1, p2, p3);
  }
  return Math.abs(volume);
}

// Signed volume of triangle helper
function signedVolumeOfTriangle(p1, p2, p3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}

// Proceed to personal data step
toPersonalDataBtn.addEventListener('click', () => {
  showStep('step-personal-data');
});

// Personal data form handling
const personalDataForm = document.getElementById('personal-data-form');
personalDataForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = personalDataForm.nome.value.trim();
  const cognome = personalDataForm.cognome.value.trim();
  const stato = personalDataForm.stato.value.trim();
  const citta = personalDataForm.citta.value.trim();
  const via = personalDataForm.via.value.trim();
  const cap = personalDataForm.cap.value.trim();

  if (!nome || !cognome || !stato || !citta || !via || !cap) {
    alert('Per favore, compila tutti i campi dei dati personali.');
    return;
  }

  currentUser.personalData = { nome, cognome, stato, citta, via, cap };

  showStep('step-payment');
});

// Payment form handling
const paymentForm = document.getElementById('payment-form');
const paymentMethodSelect = document.getElementById('payment-method');
const cardInfoDiv = document.getElementById('card-info');
const cardNumberInput = document.getElementById('card-number');
const cardTypeIconDiv = document.getElementById('card-type-icon');

paymentMethodSelect.addEventListener('change', () => {
  if (paymentMethodSelect.value === 'card') {
    cardInfoDiv.classList.remove('hidden');
  } else {
    cardInfoDiv.classList.add('hidden');
  }
  cardTypeIconDiv.innerHTML = '';
  cardNumberInput.value = '';
});

cardNumberInput.addEventListener('input', () => {
  const cardType = detectCardType(cardNumberInput.value);
  cardTypeIconDiv.innerHTML = getCardIconHtml(cardType);
});

// Detect card type from number (basic)
function detectCardType(number) {
  const cleaned = number.replace(/\s+/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  return 'unknown';
}

// Return FontAwesome icon html for card type
function getCardIconHtml(type) {
  switch (type) {
    case 'visa':
      return '<i class="fab fa-cc-visa text-blue-600"></i>';
    case 'mastercard':
      return '<i class="fab fa-cc-mastercard text-red-600"></i>';
    case 'amex':
      return '<i class="fab fa-cc-amex text-blue-400"></i>';
    case 'discover':
      return '<i class="fab fa-cc-discover text-orange-500"></i>';
    default:
      return '';
  }
}

paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const method = paymentMethodSelect.value;
  if (!method) {
    alert('Seleziona un metodo di pagamento.');
    return;
  }

  if (method === 'card') {
    const cardNumber = cardNumberInput.value.trim();
    const cardCvv = document.getElementById('card-cvv').value.trim();
    const cardHolder = document.getElementById('card-holder').value.trim();
    if (!cardNumber || !cardCvv || !cardHolder) {
      alert('Per favore, compila tutti i campi della carta.');
      return;
    }
    currentUser.payment = {
      method,
      cardNumber,
      cardCvv,
      cardHolder,
    };
    finalizeOrder();
  } else if (method === 'paypal') {
    // Simulate redirect to PayPal
    alert('Verrai reindirizzato a PayPal.');
    window.location.href = 'https://www.paypal.com/signin';
  }
});

// Finalize order: save order and show confirmation
function finalizeOrder() {
  const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || [];
  const order = {
    user: currentUser,
    grams: currentGrams,
    price: currentPrice,
    date: new Date().toISOString(),
  };
  orders.push(order);
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
  showStep('order-confirmation');
}

// Admin page redirect button
const goToAdminBtn = document.getElementById('go-to-admin');
goToAdminBtn.addEventListener('click', () => {
  window.location.href = 'admin.html';
});

// Initialize first step
showStep('step-registration');
