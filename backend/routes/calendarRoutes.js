const express = require('express');
const router = express.Router();
const { createCalendarEvent } = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { leadName, phone, dateTime, notes } = req.body;
    
    if (!leadName || !dateTime) {
      return res.status(400).json({ error: 'leadName et dateTime sont requis' });
    }

    const event = await createCalendarEvent(leadName, phone, dateTime, notes);
    
    res.json({ 
      success: true, 
      message: 'RDV créé avec succès!',
      eventId: event.id,
      eventLink: event.htmlLink
    });
  } catch (error) {
    console.error('❌ Calendar error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;