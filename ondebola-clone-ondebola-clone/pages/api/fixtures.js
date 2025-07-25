/*
 * API route for fetching fixtures from API‑Football (API‑Sports). This handler
 * proxies requests from the client to the third‑party API, injecting the
 * appropriate authentication headers and query parameters. It supports
 * filtering by team identifier and date. The timezone is hardcoded to
 * Europe/Lisbon so that kick‑off times are aligned with Portuguese local
 * time.
 *
 * Environment variable required:
 *   - API_FOOTBALL_KEY: Your personal API key for API‑Football v3
 */
export default async function handler(req, res) {
  const { team, date, league, season, next, last, from, to } = req.query;

  // Build the URL for the fixtures endpoint. The API accepts many
  // parameters; here we only include those provided by the client.
  const url = new URL('https://v3.football.api-sports.io/fixtures');
  if (team) url.searchParams.set('team', team);
  if (date) url.searchParams.set('date', date);
  if (league) url.searchParams.set('league', league);
  if (season) url.searchParams.set('season', season);
  if (next) url.searchParams.set('next', next);
  if (last) url.searchParams.set('last', last);
  if (from) url.searchParams.set('from', from);
  if (to) url.searchParams.set('to', to);
  // Always set the timezone to Europe/Lisbon for consistent times
  url.searchParams.set('timezone', 'Europe/Lisbon');

  try {
    const apiKey = process.env.API_FOOTBALL_KEY;
    if (!apiKey) {
      throw new Error('Missing API_FOOTBALL_KEY environment variable');
    }
    const response = await fetch(url.toString(), {
      headers: {
        'x-apisports-key': apiKey,
        // The API expects the host header when not using RapidAPI. See docs
        // example for correct header names【91804133009562†screenshot】.
        'x-apisports-host': 'v3.football.api-sports.io',
      },
    });
    if (!response.ok) {
      const body = await response.text();
      return res.status(response.status).send(body);
    }
    const data = await response.json();
    // Return only the response array to the client
    return res.status(200).json({ fixtures: data.response });
  } catch (error) {
    console.error('API error', error);
    return res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
}