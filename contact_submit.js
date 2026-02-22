const CONTACT_API_URL = '/api/contact';

document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('username').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.querySelector('textarea[name="message"]').value,
  };

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
      e.target.reset(); // Clear the form
    } else {
      alert(data.message || 'Failed to send message.');
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    alert('Failed to send message. Please check if the server is running on port 5000.');
  }
});
