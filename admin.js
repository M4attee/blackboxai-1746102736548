// Admin page logic

const STORAGE_USERS = '3dstore_users';
const STORAGE_ORDERS = '3dstore_orders';

const loginSection = document.getElementById('login-section');
const adminContent = document.getElementById('admin-content');
const adminLoginForm = document.getElementById('admin-login-form');
const ordersList = document.getElementById('orders-list');
const usersList = document.getElementById('users-list');
const logoutBtn = document.getElementById('logout-btn');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

adminLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    loginSection.classList.add('hidden');
    adminContent.classList.remove('hidden');
    loadData();
  } else {
    alert('Credenziali errate.');
  }
});

logoutBtn.addEventListener('click', () => {
  adminContent.classList.add('hidden');
  loginSection.classList.remove('hidden');
  adminLoginForm.reset();
  ordersList.innerHTML = '';
  usersList.innerHTML = '';
});

function loadData() {
  const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || [];
  const users = JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];

  // Display orders
  if (orders.length === 0) {
    ordersList.innerHTML = '<p class="text-gray-600">Nessun ordine presente.</p>';
  } else {
    ordersList.innerHTML = orders.map((order, index) => {
      const date = new Date(order.date).toLocaleString();
      return "<div class=\"border-b border-gray-300 py-2\">" +
             "<p><strong>Ordine #" + (index + 1) + "</strong> - " + date + "</p>" +
             "<p>Utente: " + order.user.username + " (" + order.user.email + ")</p>" +
             "<p>Peso: " + order.grams.toFixed(2) + " g</p>" +
             "<p>Prezzo: € " + order.price.toFixed(2) + "</p>" +
             "</div>";
    }).join('');
  }

  // Display users
  if (users.length === 0) {
    usersList.innerHTML = '<p class="text-gray-600">Nessun utente registrato.</p>';
  } else {
    usersList.innerHTML = users.map((user, index) => {
      return "<div class=\"border-b border-gray-300 py-2\">" +
             "<p><strong>Utente #" + (index + 1) + "</strong></p>" +
             "<p>Nome utente: " + user.username + "</p>" +
             "<p>Email: " + user.email + "</p>" +
             "</div>";
    }).join('');
  }
}
