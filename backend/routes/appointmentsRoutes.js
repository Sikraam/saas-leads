const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { tenantId: req.user.tenantId },
      include: { lead: true },
      orderBy: { scheduledAt: 'desc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;