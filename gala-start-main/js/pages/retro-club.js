export default async function hiphopClub() {
  // Hämta klubbdata och events från API
  const clubId = 'fg5i ';
  const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
  const events = await (await fetch('http://localhost:3000/events?clubId=' + clubId)).json();

  // Extrahera klubbinfo
  const { name, description } = clubData;

  return `
    <div class="retro-section">
      <!-- Navigation -->
 
      <!-- Club info -->
      <section>
        <h1>${name}</h1>
        <p>${description}</p>
      </section>
 
      <!-- About -->
      <section class="retro-about">
        <h2>Om oss</h2>
        <p>
          Välkommen till ${name}! Vi är en passionerad gemenskap som älskar
          musiken och kulturen från 80- och 90-talet. Vårt mål är att skapa en
          plats där nostalgi möter nutid, och där du kan dansa till de bästa
          retro-låtarna under neonljus.
        </p>
      </section>
 
      <!-- Events -->
      <section>
        <h2>Kommande Evenemang</h2>
        ${events
      .toSorted((a, b) => a.date > b.date ? 1 : -1)
      .map(({ date, name, description }) => `
            <article class="retro-event">
              <h3 class="special"><img src="path/to/microphone-icon.png" alt="Microphone Icon" style="width: 20px; height: 20px; margin-right: 5px;">${name} <small>(${date})</small></h3>
              <p class="text-light">${description}</p>
            </article>
          `)
      .join('')}
      </section>
    </div>
  `;
}