const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLeadStatus } = require('../controllers/leadsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // كل les routes محمية

router.get('/', getLeads);
router.post('/', createLead);
router.patch('/:id/status', updateLeadStatus);

module.exports = router;