import { useEffect, useState } from 'react';

/**
 * Home page for the OndeBola clone. This component allows users to select
 * a date and optionally a Portuguese team, then fetches fixtures from
 * the backend API. Results are displayed in a simple list showing the
 * competing teams, kick‑off time (in Lisbon timezone) and television
 * broadcaster if available. Tailwind CSS is used for styling.
 */
export default function Home() {
  const [date, setDate] = useState(() => {
    // Default to today's date in YYYY‑MM‑DD format
    const today = new Date();
    // Adjust to Lisbon timezone by subtracting the timezone offset
    const tzOffset = today.getTimezoneOffset() * 60000;
    const localISO = new Date(today - tzOffset).toISOString();
    return localISO.split('T')[0];
  });
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  // Fetch the list of Portuguese teams on initial load. This allows
  // populating the dropdown with club and national teams. The API
  // endpoint returns an array of team objects as described in the
  // documentation【66957918526591†L121-L129】.
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('/api/teams');
        if (!res.ok) {
          throw new Error('Erro ao obter equipas');
        }
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err) {
        console.error(err);
        // Ignore team loading errors; user can still search by date
      }
    }
    fetchTeams();
  }, []);

  // Handler to fetch fixtures based on the current date and selected team
  async function handleFetchFixtures() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (date) params.set('date', date);
      if (selectedTeam) params.set('team', selectedTeam);
      const res = await fetch(`/api/fixtures?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro ao obter jogos');
      }
      const data = await res.json();
      setFixtures(data.fixtures || []);
    } catch (err) {
      console.error(err);
      setError('Falha ao obter jogos. Verifique a chave da API e os parâmetros.');
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Onde Bola Clone</h1>
      <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">Data</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="team" className="text-sm font-medium text-gray-700">Equipa (opcional)</label>
          <select
            id="team"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-60"
          >
            <option value="">Todas</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleFetchFixtures}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none"
        >
          Ver Jogos
        </button>
      </div>
      {loading && <p className="text-gray-700">A carregar jogos...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <section className="space-y-4">
        {fixtures.map((item) => {
          const { fixture, teams: matchTeams, broadcast } = item;
          // Determine the channel name if available. Some API responses
          // embed broadcast info under `broadcast`, while others may have
          // `fixture.tvStations` or `fixture.broadcast` – we attempt a few
          // common properties and fall back to "N/D" (não disponível).
          let channel = 'N/D';
          if (broadcast && broadcast.channel) {
            channel = broadcast.channel;
          } else if (fixture && fixture.tv) {
            // Some responses use a `tv` property inside fixture
            channel = fixture.tv.name || fixture.tv.channel || 'N/D';
          }
          // Format the kick‑off time in HH:MM format for Lisbon
          const kickOff = fixture?.date
            ? new Date(fixture.date).toLocaleTimeString('pt-PT', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';
          return (
            <div key={fixture.id} className="p-4 bg-white rounded-md shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">
                    {matchTeams.home.name} vs {matchTeams.away.name}
                  </p>
                  <p className="text-sm text-gray-600">{kickOff}</p>
                  {fixture?.venue?.name && (
                    <p className="text-sm text-gray-500">{fixture.venue.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">Canal TV</p>
                  <p>{channel}</p>
                </div>
              </div>
            </div>
          );
        })}
        {fixtures.length === 0 && !loading && !error && (
          <p className="text-gray-600">Nenhum jogo encontrado para os critérios seleccionados.</p>
        )}
      </section>
    </main>
  );
}