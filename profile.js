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

    // Initialize Modal and Form with user data
    setupEditModal(userData);

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

function setupEditModal(user) {
  const modal = document.getElementById('editProfileModal');
  const editBtn = document.getElementById('editProfileBtn');
  const closeBtn = document.getElementById('closeModal');
  const form = document.getElementById('editProfileForm');
  const picInput = document.getElementById('editPicFile');
  const picPreview = document.getElementById('editPicPreview');
  let base64Image = user.profilePic || '';

  editBtn.onclick = () => {
    modal.style.display = 'flex';
    // Pre-fill form
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editPhone').value = user.phone || '';
    picPreview.src = user.profilePic || '/images/favicon-32x32.png';
    base64Image = user.profilePic || '';
    
    if (user.address) {
      document.getElementById('editStreet').value = user.address.street || '';
      document.getElementById('editCity').value = user.address.city || '';
      document.getElementById('editState').value = user.address.state || '';
      document.getElementById('editZip').value = user.address.zip || '';
      document.getElementById('editCountry').value = user.address.country || '';
    }
  };

  // Image handling
  picInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        showToast('Image size should be less than 200 KB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Image = reader.result;
        picPreview.src = base64Image;
      };
      reader.readAsDataURL(file);
    }
  };

  closeBtn.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const updatedData = {
      name: document.getElementById('editName').value,
      phone: document.getElementById('editPhone').value,
      profilePic: base64Image,
      address: {
        street: document.getElementById('editStreet').value,
        city: document.getElementById('editCity').value,
        state: document.getElementById('editState').value,
        zip: document.getElementById('editZip').value,
        country: document.getElementById('editCountry').value,
      }
    };

    try {
      const response = await fetch(PROFILE_API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const newUser = await response.json();
      showToast('Profile updated successfully!');
      modal.style.display = 'none';
      
      // Refresh the page data
      displayProfile(newUser);
      // Update the local storage user object too
      localStorage.setItem('user', JSON.stringify({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }));
    } catch (err) {
      showToast('Update failed: ' + err.message, 'error');
    }
  };
}

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
