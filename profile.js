import { showToast } from "./showToast";

const PROFILE_API_URL = '/api/auth/profile';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showToast('Please login to view your profile.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }

  try {
    const response = await fetch(PROFILE_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Server returned an invalid response.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server Error Response:', errorData);
      if (response.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        return;
      }
      throw new Error(errorData.message || 'Failed to fetch profile data');
    }

    const userData = await response.json();
    displayProfile(userData);

    // Add Logout Button listener
    document.getElementById('profileLogoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showToast('Logged out successfully!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  } catch (error) {
    console.error('Detailed Profile Error:', error);
    showToast('Profile Error: ' + error.message, 'error');
  }
});

function displayProfile(user) {
  // Update header
  document.getElementById('userNameHeader').textContent = user.name;
  document.getElementById('userEmailHeader').textContent = user.email;
  if (user.profilePic) {
      document.getElementById('userPic').src = user.profilePic;
  }

  // Update details
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
  document.getElementById('profileRole').textContent = user.role.toUpperCase();

  // Update address
  if (user.address) {
    document.getElementById('profileStreet').textContent = user.address.street || '--';
    document.getElementById('profileCity').textContent = user.address.city || '--';
    document.getElementById('profileState').textContent = user.address.state || '--';
    document.getElementById('profileZip').textContent = user.address.zip || '--';
    document.getElementById('profileCountry').textContent = user.address.country || '--';
  }
}
