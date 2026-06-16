const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '..', 'google-service-account.json.json'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

async function createCalendarEvent(leadName, phone, dateTime, notes = '') {
  const startTime = new Date(dateTime);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const event = {
    summary: `RDV — ${leadName}`,
    description: `📞 Téléphone: ${phone}\n📝 Notes: ${notes}\n\n✅ Créé automatiquement par LeadFlow AI`,
    start: { dateTime: startTime.toISOString(), timeZone: 'Africa/Casablanca' },
    end: { dateTime: endTime.toISOString(), timeZone: 'Africa/Casablanca' },
  };

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'ikraamse7@gmail.com',
    resource: event,
  });

  return response.data;
}

module.exports = { createCalendarEvent };