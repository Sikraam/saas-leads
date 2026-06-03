const { google } = require('googleapis');
const path = require('path');

// Try env variables first, fallback to file
let authConfig;
if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
  authConfig = {
    credentials: {
      type: 'service_account',
      project_id: 'helical-button-489911-p9',
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: '112054358788072645472',
      universe_domain: 'googleapis.com'
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  };
} else {
  authConfig = {
    keyFile: path.join(__dirname, '..', 'google-service-account.json.json'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  };
}

const auth = new google.auth.GoogleAuth(authConfig);
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