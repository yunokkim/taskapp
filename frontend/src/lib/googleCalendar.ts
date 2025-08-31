import { google } from 'googleapis';

export function getGoogleCalendarClient(accessToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth });
}

export function getGoogleRecurrence(repeat: string): string[] {
  switch (repeat.toUpperCase()) {
    case 'DAILY': return ['RRULE:FREQ=DAILY'];
    case 'WEEKLY': return ['RRULE:FREQ=WEEKLY'];
    case 'MONTHLY': return ['RRULE:FREQ=MONTHLY'];
    default: return [];
  }
}