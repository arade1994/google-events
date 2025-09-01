import { google } from "googleapis";

export async function fetchGoogleEvents(
  accessToken?: string,
  refreshToken?: string
) {
  if (!accessToken || !refreshToken) {
    throw new Error("Access token or refresh token is missing");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - 3);
  const future = new Date();
  future.setMonth(now.getMonth() + 3);

  const events = await calendar.events.list({
    calendarId: "primary",
    singleEvents: true,
    orderBy: "startTime",
    timeMin: past.toISOString(),
    timeMax: future.toISOString(),
    showDeleted: true,
  });

  return events.data.items || [];
}
