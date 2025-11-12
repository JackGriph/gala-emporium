import { handleBooking, handleLookup, toggleBookingMenu } from '../utils/eventbooking.js';

export default async function hiphopClub() {
  // Hämta klubbdata och events från API
  const clubId = 'h1ph';
  const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
  const events = await (await fetch(`http://localhost:3000/events?clubId=${clubId}`)).json();

  // Extrahera klubbinfo
  const { name, description } = clubData;

  // Setup listeners after HTML renders
  setTimeout(() => {
    const toggleBtn = document.querySelector('.booking-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleBookingMenu);
    }

    const lookupForm = document.querySelector('#lookup-form form');
    if (lookupForm) lookupForm.addEventListener('submit', handleLookup);

    document.querySelectorAll('.event-booking-form form').forEach((form, index) => {
      const event = events.toSorted((a, b) => a.date > b.date ? 1 : -1)[index];
      if (event) {
        form.addEventListener('submit', (e) => handleBooking(e, event.id, event.name, event.date, clubId));
      }
    });
  }, 0);

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
 
      <div id="booking-menu" class="booking-menu">
        <div class="booking-menu-content">
          <h3>Hantera din bokning</h3>
          <div class="booking-lookup-section">
            <h4>Visa befintlig bokning</h4>
            <div id="lookup-form">
              <form>
                <div class="form-group">
                  <input type="text" id="lookupId" name="lookupId" required placeholder="Ange bokningsnummer">
                </div>
                <button type="submit" class="btn-secondary">Visa bokning</button>
              </form>
            </div>
            <div id="lookup-result" style="display: none;"></div>
          </div>
        </div>
      </div>

      <div class="club-content">
        <div class="events-column">
          <h2>Kommande Evenemang:</h2>
          <ul class="event-list">
            ${events.toSorted((a, b) => a.date > b.date ? 1 : -1).map(event => `
              <li class="event-card">
                <h3>${event.date}<br>
                ${event.name}</h3>
                ${event.description}
                
                <div class="event-booking-form">
                  <details>
                    <summary>Boka till detta event</summary>
                    <form>
                      <div class="form-group">
                        <label for="name-${event.id}">Namn:</label>
                        <input type="text" id="name-${event.id}" name="name" required placeholder="Ditt namn">
                      </div>
                      <div class="form-group">
                        <label for="antal-${event.id}">Antal personer:</label>
                        <input type="number" id="antal-${event.id}" name="antal" min="1" max="10" required placeholder="1-10">
                      </div>
                      <button type="submit" class="btn-primary">Boka nu</button>
                    </form>
                  </details>
                </div>
              </li>`).join("")}
          </ul>
        </div>

        <div class="extra-info">
          <h2>Öppettider:</h2>
        <ul>
           ${Object.keys(clubData.openingHours || {}).map(day => `
          <li>${day}: ${clubData.openingHours[day]}</li>
    `).join("")}
        </ul>

          <h2>Prislista:</h2>
        <ul>
          ${Object.keys(clubData.priceList || {}).map(item => `
          <li>${item}: ${clubData.priceList[item]}</li>
    `).join("")}
        </ul>

          <h2>Atmosfär:</h2> 
          <p>${clubData.atmosphere || ''}</p>
      </div>
      </div>
      <button class="booking-toggle-btn">Din bokning</button>
    </div>
  `;
}

