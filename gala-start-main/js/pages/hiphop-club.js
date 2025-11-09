
export default async function hiphopClub() {
  // Hämta klubbdata och events från API
  const clubId = 'h1ph';
  const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
  const events = await (await fetch(`http://localhost:3000/events?clubId=${clubId}`)).json();

  // Extrahera klubbinfo
  const { name, description } = clubData;

  return `
    <div class="hiphop-section">
      <!-- Navigation -->
 
      <!-- Club info -->
      <section>
        <h1>${name}</h1>
        <p class="text-light">${description}</p>
      </section>
 
      <!-- About -->
      <section class="hiphop-about">
        <h2 class="special">Om oss</h2>
        <p class="text-lighter">
          Välkommen till ${name}! Vi är en passionerad gemenskap som älskar rytmen,
          dansen och kulturen inom hiphop. Vårt mål är att skapa en kreativ plats
          där musik, rörelse och gemenskap möts.
        </p>
      </section>
 
      <!-- Events -->
      <section>
        <h2>Kommande Evenemang</h2>
        ${events
      .toSorted((a, b) => a.date > b.date ? 1 : -1)
      .map(({ date, name, description }) => `
            <article class="hiphop-event">
              <h3 class="special"><img src="path/to/microphone-icon.png" alt="Microphone Icon" style="width: 20px; height: 20px; margin-right: 5px;">${name} <small>(${date})</small></h3>
              <p class="text-light">${description}</p>
            </article>
          `)
      .join('')}
      </section>
    </div>
  `;
}

