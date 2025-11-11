
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
      <section class="club-header">
        <div>
          <h1>${name}</h1>
          <p class="text-light">${description}</p>
        </div>
      </section>

      <!-- Audio element (hidden) -->
      <audio id="hiphop-audio" preload="none">
        <source src="audio/hiphopaudio.mp3" type="audio/mpeg">
        Din webbläsare stödjer inte audioelementet.
      </audio>

      <!-- Player (left, above About) -->
      <div class="player-left">
        <button
          class="play-btn"
          type="button"
          aria-pressed="false"
          title="Spela / pausa"
          onclick="(function(btn){const a=document.getElementById('hiphop-audio'); if(!a) return; if(a.paused){a.play(); btn.classList.add('playing'); btn.setAttribute('aria-pressed','true'); btn.innerText='⏸️ Pausa';} else {a.pause(); btn.classList.remove('playing'); btn.setAttribute('aria-pressed','false'); btn.innerText='▶️ Spela';}})(this)">
          ▶️ Spela
        </button>
      </div>

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
              <h3 class="special">🎤 ${name} <strong>(${date})</strong></h3>
              <p class="text-light">${description}</p>
            </article>
          `)
      .join('')}
      </section>
    </div>
  `;
}

