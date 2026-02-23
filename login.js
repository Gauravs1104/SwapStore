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

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Login successful!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (error) {
    console.error('Error during login:', error);
    showToast('Something went wrong. Please try again.', 'error');
  }
});

// Handle Google Login
window.addEventListener('google-login', async (event) => {
  const { credential } = event.detail;

  try {
    const response = await fetch(`${API_URL}/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: credential }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Google Login successful!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      console.error('Backend Google Login Error:', data);
      showToast(data.message || 'Google Login failed', 'error');
    }
  } catch (error) {
    console.error('Network/Frontend Error during Google login:', error);
    showToast('Google Login failed. Please check your connection.', 'error');
  }
});
