import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Post Contact Message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({ message: 'Contact message sent successfully!' });
  } catch (err) {
    console.error('Contact Error:', err);
    res.status(500).json({ message: 'Failed to send message: ' + err.message });
  }
});

export default router;
