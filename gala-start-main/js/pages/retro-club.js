import { handleBooking, handleLookup, toggleBookingMenu } from '../utils/eventbooking.js';

export default async function retroClub() {
  // Hämta klubbdata och events från API
  const clubId = 'fg5i';
  const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
  const events = await (await fetch('http://localhost:3000/events?clubId=' + clubId)).json();

  // Extrahera klubbinfo
  const { name, description } = clubData;

  // Setup event listeners after HTML is rendered
  setTimeout(() => {
    // Toggle button
    const toggleBtn = document.querySelector('.booking-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleBookingMenu);
    }

    // Lookup form
    const lookupForm = document.querySelector('#lookup-form form');
    if (lookupForm) {
      lookupForm.addEventListener('submit', handleLookup);
    }

    // Event booking forms
    document.querySelectorAll('.event-booking-form form').forEach((form, index) => {
      const event = events.toSorted((a, b) => a.date > b.date ? 1 : -1)[index];
      if (event) {
        form.addEventListener('submit', (e) => handleBooking(e, event.id, event.name, event.date, clubId));
      }
    });
  }, 0);

  return `
    <button class="booking-toggle-btn">🎫 Din bokning</button>
    
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

    <div class="retro-section">
      <section>
        <h1>${name}</h1>
        <p>${description}</p>
      </section>
 
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
      .map(({ id, date, name, description }) => `
            <article class="retro-event">
              <h3>${name} <small>(${date})</small></h3>
              <p>${description}</p>
              
              <div class="event-booking-form">
                <details>
                  <summary>🎫 Boka till detta event</summary>
                  <form>
                    <div class="form-group">
                      <label for="name-${id}">Namn:</label>
                      <input type="text" id="name-${id}" name="name" required placeholder="Ditt namn">
                    </div>
                    <div class="form-group">
                      <label for="antal-${id}">Antal personer:</label>
                      <input type="number" id="antal-${id}" name="antal" min="1" max="10" required placeholder="1-10">
                    </div>
                    <button type="submit" class="btn-primary">Boka nu</button>
                  </form>
                </details>
              </div>
            </article>
          `)
      .join('')}
      </section>
    </div>
  `;
}