const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET tous les leads du tenant
const getLeads = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const leads = await prisma.lead.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ leads });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// POST créer un lead manuellement
const createLead = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { name, phone, source } = req.body;

    const lead = await prisma.lead.create({
      data: { name, phone, source: source || 'manual', tenantId }
    });

    res.status(201).json({ message: 'Lead créé', lead });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PATCH update status du lead
const updateLeadStatus = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const { status } = req.body;

    const lead = await prisma.lead.update({
      where: { id, tenantId }, // multi-tenant security
      data: { status }
    });

    res.json({ message: 'Statut mis à jour', lead });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getLeads, createLead, updateLeadStatus };