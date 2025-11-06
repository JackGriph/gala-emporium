export default async function clubInfoAndEvents(clubId) {
  let name = '', description = '';
  let url = 'http://localhost:3000/events';

  // Hämta klubbinfo om clubId finns
  if (clubId) {
    const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
    name = clubData.name;
    description = clubData.description;
    url += '?clubId=' + clubId;
  }

  // Hämta events
  const events = await (await fetch(url)).json();

  // Generera "Om oss"-text
  const aboutText = name
    ? `Välkommen till ${name}! Vi är en passionerad gemenskap som älskar rytmen, dansen och kulturen inom ${name.toLowerCase()}. 
       Vårt mål är att skapa en kreativ plats där musik, rörelse och gemenskap möts. Oavsett om du är nybörjare eller erfaren 
       entusiast – här är alla välkomna att uttrycka sig.`
    : '';

  // Kolla om klubben är hiphop (matchar namn oavsett versaler)
  const isHiphop = name.toLowerCase().includes('hiphop');

  // Returnera HTML
  const events = await (await fetch(url)).json();

  // Generic club/event display
  return `
    <div class="page" style="
      font-family: Arial, sans-serif;
      background-color: #1a0f0a; /* mörkbrun/svart ton */
      color: #fff;
      min-height: 100vh;
      padding: 2rem;
    ">
      ${isHiphop ? `
        <!-- Meny -->
        <nav class="menu-box" style="
          border: 1px solid #3b2b24;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2rem;
          background: #2a1a14;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        ">
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; gap: 1.5rem;">
            <li><a href="/" style="color: #fff; text-decoration: none;">Hem</a></li>
            <li><a href="/clubs" style="color: #fff; text-decoration: none;">Klubbar</a></li>
            <li><a href="/events" style="color: #fff; text-decoration: none;">Evenemang</a></li>
            <li><a href="/about" style="color: #fff; text-decoration: none;">Om oss</a></li>
          </ul>
        </nav>

        <!-- Klubbinfo -->
        <section class="club-info" style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">${name}</h1>
          <p style="color: #ddd;">${description}</p>
        </section>

        <!-- Om oss -->
        <section class="about" style="
          border: 1px solid #3b2b24;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          background: #2a1a14;
        ">
          <h2 style="margin-bottom: 0.5rem;">Om oss</h2>
          <p style="color: #eee;">${aboutText}</p>
        </section>

        <!-- Evenemang -->
        <section class="events">
          <h2 style="margin-bottom: 1rem;">Kommande Evenemang</h2>
          ${events
            .toSorted((a, b) => a.date > b.date ? 1 : -1)
            .map(({ date, name, description }) => `
              <article class="event" style="
                border: 1px solid #3b2b24;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                background: #22130f;
              ">
                <h3 style="color: #fff; margin-bottom: 0.3rem;">${name} <small style="color:#bbb;">(${date})</small></h3>
                <p style="color: #ddd;">${description}</p>
              </article>
            `)
            .join('')}
        </section>
      ` : `
        <!-- Om man inte är på hiphop-klubben -->
        <section style="text-align:center; margin-top: 5rem;">
          <h1 style="color: #fff;">${name || 'Klubbinformation'}</h1>
          <p style="color: #ccc;">${description || 'Besök vår hiphopsektion för att se evenemang och mer innehåll.'}</p>
        </section>
      `}
    </div>
  `;
}
