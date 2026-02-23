import { showToast } from "./showToast";

const API_URL = '/api/auth';

// ... (previous password toggle code)
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const phoneCode = document.getElementById('countryCode').value;
  const phoneNumber = document.getElementById('phone').value;

  if (!phoneCode) {
    showToast('Please select a country code.', 'error');
    return;
  }

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: `${phoneCode} ${phoneNumber}`,
    password: document.getElementById('password').value,
    address: {
      street: document.getElementById('street').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value,
    },
  };

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Registration successful! Please login.');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    showToast('Something went wrong. Please try again.', 'error');
  }
});
