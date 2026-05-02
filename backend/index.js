process.loadEnvFile('.env');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// WEBHOOK GET - Verification
app.get('/api/webhook/facebook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
    console.log('✅ Webhook verifie!');
    return res.status(200).send(challenge);
  }
  return res.status(403).json({ error: 'Echec' });
});

// WEBHOOK POST - Reception leads
app.post('/api/webhook/facebook', async (req, res) => {
  console.log('📩 Lead recu!', JSON.stringify(req.body));
  try {
    const { object, entry } = req.body;
    if (object !== 'page') return res.sendStatus(200);
    for (const e of entry) {
      for (const change of e.changes) {
        if (change.field !== 'leadgen') continue;
        const leadData = change.value;
        const name = leadData.field_data?.find(f => f.name === 'full_name')?.values[0] || 'Inconnu';
        const phone = leadData.field_data?.find(f => f.name === 'phone_number')?.values[0] || '';

        await prisma.lead.create({
          data: {
            name,
            phone,
            source: 'facebook',
            status: 'new',
            tenantId: '722c9d64-f244-4772-a70a-318f2f0018f3'
          }
        });
        console.log('✅ Lead cree:', name, phone);
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error('❌ Erreur:', error);
    return res.sendStatus(500);
  }
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/leads', generalLimiter, require('./routes/leadsRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'API SaaS Leads — Server running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});