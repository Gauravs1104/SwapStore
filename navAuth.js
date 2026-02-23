import { showToast } from "./showToast";

document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.querySelector('.sing_in_up');
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    // If user is logged in
    authContainer.innerHTML = `
      <a href="profile.html" style="font-size: 1.6rem; color: white; margin-right: 1.5rem;"><i class="fa-solid fa-user"></i> Hello, ${user.name.split(' ')[0]}</a>
      <a href="#" id="logoutBtn">LOGOUT</a>
    `;

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showToast('Logged out successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  } else {
    // If user is NOT logged in
    authContainer.innerHTML = `
      <a href="login.html">SIGN IN</a>
      <a href="register.html">SIGN UP</a>
    `;
  }
});
