const OpenAI = require('openai');
const { PrismaClient } = require('@prisma/client');
const twilio = require('twilio');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function handleWhatsAppReply(req, res) {
  try {
    const { Body, From } = req.body;
    const phone = From.replace('whatsapp:+212', '0').replace('whatsapp:+', '');
    
    console.log('📱 Message recu de:', phone, '→', Body);

    // Trouver le lead
    const lead = await prisma.lead.findFirst({
      where: { phone: { contains: phone.slice(-9) } }
    });

    if (!lead) {
      console.log('❌ Lead non trouvé pour:', phone);
      return res.sendStatus(200);
    }

    // Récupérer historique conversations
    let conv = await prisma.conversation.findFirst({
      where: { leadId: lead.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    // Créer conversation si elle n'existe pas
    if (!conv) {
      conv = await prisma.conversation.create({
        data: { leadId: lead.id, tenantId: lead.tenantId, status: 'active' },
        include: { messages: true }
      });
    }

    // Sauvegarder message user
    await prisma.message.create({
      data: { conversationId: conv.id, role: 'user', content: Body }
    });

    // Construire historique pour OpenAI
    const messages = [
      {
        role: 'system',
        content: `Tu es un assistant commercial intelligent pour une entreprise. 
Tu parles en français (ou en darija si le client écrit en darija).
Ton objectif: qualifier le lead et prendre un rendez-vous.
Pose des questions sur: leurs besoins, leur budget, leur disponibilité.
Quand le lead est prêt pour un RDV, propose des créneaux: lundi, mardi ou mercredi entre 10h et 17h.
Sois chaleureux, professionnel et concis (max 3 phrases par réponse).
Nom du lead: ${lead.name}`
      },
      ...conv.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: Body }
    ];

    // Appel OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 200,
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('🤖 AI response:', aiResponse);

    // Sauvegarder réponse AI
    await prisma.message.create({
      data: { conversationId: conv.id, role: 'assistant', content: aiResponse }
    });

    // Envoyer réponse WhatsApp
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