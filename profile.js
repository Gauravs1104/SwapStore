const PROFILE_API_URL = '/api/auth/profile';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to view your profile.');
    window.location.href = 'login.html';
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
        throw new Error("Server returned an invalid response (not JSON). Please check if the backend is running on port 5000.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server Error Response:', errorData);
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return;
      }
      throw new Error(errorData.message || 'Failed to fetch profile data');
    }

    const userData = await response.json();
    displayProfile(userData);
  } catch (error) {
    console.error('Detailed Profile Error:', error);
    if (error.message === 'Failed to fetch') {
        alert('Profile Error: Failed to fetch. Please ensure the backend server is running on port 5000.');
    } else {
        alert('Profile Error: ' + error.message);
    }
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
