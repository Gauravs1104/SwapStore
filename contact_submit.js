const CONTACT_API_URL = '/api/contact';

const handleContactSubmit = async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  if (!name || !email || !subject || !message) {
    alert('Please fill in all fields.');
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
      alert('Message sent successfully! We will get back to you soon.');
      e.target.reset();
    } else {
      alert(data.message || 'Failed to send message.');
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    alert('Something went wrong. Please check your internet connection and try again.');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  } else {
    console.error('Contact form not found');
  }
});
