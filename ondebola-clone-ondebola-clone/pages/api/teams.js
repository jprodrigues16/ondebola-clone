/*
 * API route for retrieving information about teams in Portugal. This handler
 * calls the API‑Football `teams` endpoint and optionally filters teams by
 * search keyword. The API returns both club and national teams; by
 * default we include all Portuguese teams. A `search` query parameter
 * performs a case‑insensitive search on team names.
 *
 * Required environment variable:
 *   API_FOOTBALL_KEY: your API‑Football v3 API key
 */
export default async function handler(req, res) {
  const { search } = req.query;
  const url = new URL('https://v3.football.api-sports.io/teams');
  // Restrict to Portuguese teams by country. According to the API
  // documentation, the `country` parameter filters teams by country name
  //【66957918526591†L121-L129】.
  url.searchParams.set('country', 'Portugal');
  // Optionally pass a search term to the API for fuzzy team name search
  if (search) {
    url.searchParams.set('search', search);
  }
  // Limit to the current season to reduce the number of results
  const year = new Date().getFullYear();
  url.searchParams.set('season', year.toString());

  try {
    const apiKey = process.env.API_FOOTBALL_KEY;
    if (!apiKey) {
      throw new Error('Missing API_FOOTBALL_KEY environment variable');
    }
    const response = await fetch(url.toString(), {
      headers: {
        'x-apisports-key': apiKey,
        'x-apisports-host': 'v3.football.api-sports.io',
      },
    });
    if (!response.ok) {
      const body = await response.text();
      return res.status(response.status).send(body);
    }
    const data = await response.json();
    // Extract only the team objects from the response array
    const teams = (data.response || []).map((item) => item.team);
    return res.status(200).json({ teams });
  } catch (error) {
    console.error('Team API error', error);
    return res.status(500).json({ error: 'Failed to fetch teams' });
  }
}