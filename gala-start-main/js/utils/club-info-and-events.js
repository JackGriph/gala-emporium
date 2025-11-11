export default async function clubInfoAndEvents(clubId) {
  let name = '', description = '';
  // if there is a clubId -> fetch the info about the club
  // and calculate the correct url for fetching filtered events
  let url = 'http://localhost:3000/events';
  if (clubId) {
    const { name: clubName, description: clubDescription } =
      await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
    name = clubName;
    description = clubDescription;
    url += '?clubId=' + clubId;

    // Visa enskild klubb med events
    const events = await (await fetch(url)).json();
    return `
      <h1>${name}</h1>
      <p>${description}</p>
      <h2>Events</h2>
      ${events
        .toSorted((a, b) => a.date > b.date ? 1 : -1)
        .map(({ date, name, description }) => `
      <article class="event">
          <h3>${name} <span class="event-date">${date}</span></h3>
          <p>${description}</p>
      </article>
        `)
        .join('')
      }
    `;
  }

  // Startsida - visa alla klubbar med sina events
  const clubs = await (await fetch('http://localhost:3000/clubs')).json();
  const allEvents = await (await fetch(url)).json();

  // Gruppera events per klubb
  const eventsByClub = {};
  clubs.forEach(club => {
    eventsByClub[club.id] = {
      name: club.name,
      events: allEvents
        .filter(event => event.clubId === club.id)
        .toSorted((a, b) => a.date > b.date ? 1 : -1)
    };
  });

  // Generera HTML för varje klubb-sektion
  return clubs.map(club => `
    <section class="club-section club-section-${club.id}">
      <h2 class="club-section-title">🎵 ${club.name}</h2>
      ${eventsByClub[club.id].events.length > 0 ? `
        <div class="club-events">
          ${eventsByClub[club.id].events.map(({ date, name, description }) => `
            <article class="event">
              <h3>${name} <span class="event-date">${date}</span></h3>
              <p>${description}</p>
            </article>
          `).join('')}
        </div>
      ` : `
        <p class="no-events">Inga kommande events för tillfället</p>
      `}
    </section>
  `).join('');
}