const OpenAI = require('openai');
const { PrismaClient } = require('@prisma/client');
const twilio = require('twilio');
const { createCalendarEvent } = require('./calendarController');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function extractRDVInfo(text) {
  const rdvKeywords = ['rendez-vous', 'rdv', 'confirme', 'confirmé', 'd\'accord', 'ok pour', 'parfait pour', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  const timePattern = /(\d{1,2}h|\d{1,2}:\d{2})/i;
  const datePattern = /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|\d{1,2}[\/\-]\d{1,2})/i;
  const textLower = text.toLowerCase();
  const hasRDV = rdvKeywords.some(k => textLower.includes(k));
  const timeMatch = text.match(timePattern);
  const dateMatch = text.match(datePattern);
  return { hasRDV, time: timeMatch?.[0], date: dateMatch?.[0] };
}

function getNextDateForDay(dayName) {
  const days = { 'lundi': 1, 'mardi': 2, 'mercredi': 3, 'jeudi': 4, 'vendredi': 5, 'samedi': 6, 'dimanche': 0 };
  const today = new Date();
  const targetDay = days[dayName.toLowerCase()];
  if (targetDay === undefined) return null;
  const daysUntil = (targetDay - today.getDay() + 7) % 7 || 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate;
}

function buildDateTime(date, time) {
  try {
    let baseDate = new Date();
    if (date) {
      const dayDate = getNextDateForDay(date);
      if (dayDate) baseDate = dayDate;
    }
    let hours = 10;
    if (time) {
      const match = time.match(/(\d{1,2})/);
      if (match) hours = parseInt(match[1]);
    }
    baseDate.setHours(hours, 0, 0, 0);
    return baseDate.toISOString();
  } catch (e) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow.toISOString();
  }
}

async function handleWhatsAppReply(req, res) {
  try {
    const { Body, From } = req.body;
    const phone = From.replace('whatsapp:+212', '0').replace('whatsapp:+', '');
    console.log('📱 Message recu de:', phone, '→', Body);

    const lead = await prisma.lead.findFirst({
      where: { phone: { contains: phone.slice(-9) } }
    });

    if (!lead) {
      console.log('❌ Lead non trouvé pour:', phone);
      return res.sendStatus(200);
    }

    let conv = await prisma.conversation.findFirst({
      where: { leadId: lead.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: { leadId: lead.id, tenantId: lead.tenantId, status: 'active' },
        include: { messages: true }
      });
    }

    await prisma.message.create({
      data: { conversationId: conv.id, role: 'user', content: Body }
    });

    const messages = [
      {
        role: 'system',
        content: `Tu es un assistant commercial intelligent pour une entreprise. 
Tu parles en français (ou en darija si le client écrit en darija).
Ton objectif: qualifier le lead et prendre un rendez-vous.
Pose des questions sur: leurs besoins, leur budget, leur disponibilité.
Quand le lead est prêt pour un RDV, propose des créneaux: lundi, mardi ou mercredi entre 10h et 17h.
Quand le client CONFIRME un créneau précis, inclus obligatoirement la phrase exacte: "RDV CONFIRMÉ:"  suivi du jour et l'heure. Exemple: "RDV CONFIRMÉ: mardi 14h".
Sois chaleureux, professionnel et concis (max 3 phrases par réponse).
Nom du lead: ${lead.name}`
      },
      ...conv.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: Body }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 200,
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('🤖 AI response:', aiResponse);

    await prisma.message.create({
      data: { conversationId: conv.id, role: 'assistant', content: aiResponse }
    });

    // Detect RDV confirmation → Calendar + DB
    if (aiResponse.includes('RDV CONFIRMÉ:')) {
      try {
        const rdvInfo = extractRDVInfo(aiResponse);
        const dateTime = buildDateTime(rdvInfo.date, rdvInfo.time);

        const event = await createCalendarEvent(
          lead.name,
          lead.phone,
          dateTime,
          'Lead confirmé via WhatsApp AI'
        );
        console.log('📅 RDV créé dans Google Calendar:', event.htmlLink);

        // Save f DB
        await prisma.appointment.upsert({
          where: { leadId: lead.id },
          update: {
            scheduledAt: new Date(dateTime),
            googleEventId: event.id,
            status: 'scheduled'
          },
          create: {
            leadId: lead.id,
            tenantId: lead.tenantId,
            scheduledAt: new Date(dateTime),
            googleEventId: event.id,
            status: 'scheduled'
          }
        });
        console.log('✅ Appointment saved in DB');
      } catch (calErr) {
        console.error('❌ Calendar error:', calErr.message);
      }
    }

    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: From,
      body: aiResponse
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    return res.sendStatus(500);
  }
}

module.exports = { handleWhatsAppReply };