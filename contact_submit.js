import { showToast } from "./showToast";

const CONTACT_API_URL = '/api/contact';

const handleContactSubmit = async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  if (!name || !email || !subject || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }

  const formData = { name, email, subject, message };

  try {
    const response = await fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Message sent successfully!');
      e.target.reset();
    } else {
      showToast(data.message || 'Failed to send message.', 'error');
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    showToast('Something went wrong. Please check your connection.', 'error');
  }
};

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', handleContactSubmit);
} else {
  console.error('Contact form not found on this page');
}
