import { handleBooking as ebHandleBooking, handleLookup as ebHandleLookup, toggleBookingMenu } from '../utils/eventbooking.js';

export default async function clubPopfesten() {
  const clubId = '1234';

  // Fetch club info and events
  const clubRes = await fetch('http://localhost:3000/clubs/' + clubId);
  const club = await clubRes.json();
  const eventsRes = await fetch('http://localhost:3000/events?clubId=' + clubId);
  const events = await eventsRes.json();

  const daysSwedish = {
    monday: "Måndag",
    tuesday: "Tisdag",
    wednesday: "Onsdag",
    thursday: "Torsdag",
    friday: "Fredag",
    saturday: "Lördag",
    sunday: "Söndag"
  };

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
      lookupForm.addEventListener('submit', ebHandleLookup);
    }

    // Event booking forms
    document.querySelectorAll('.event-booking-form form').forEach((form, index) => {
      const event = events.toSorted((a, b) => a.date > b.date ? 1 : -1)[index];
      if (event) {
        form.addEventListener('submit', (e) => ebHandleBooking(e, event.id, event.name, event.date, clubId));
      }
    });
  }, 0);

  return `
    <section class="club-page">
      <div class="club-header">
        <!---<img class="club-image" src="pictures/logo-popfesten.jpg" alt="${club.name}">--->
        <h1>${club.name}</h1>
        <h2>${club.description}</h2>
        <p class="club-info">Club Popfesten är kvällsklubben där popälskare samlas för att fira den svenska musiken vi aldrig tröttnat på. Våra artister och DJ's bjuder på allt från tidlösa popklassiker till dagens största hits, med energifyllda liveframträdanden och välkända covers som för hela dansgolvet att sjunga med. Oavsett om du älskar ikoniska retrovibbar eller fräsch modern pop är Club Popfesten platsen där nostalgi möter nutid, och där festen aldrig stannar av. Älskar du svensk pop? Kom och studsa med oss.</p>
      </div>

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
          <h2>Kommande event:</h2>
          Olika DJ's spelar varje dag blandad svensk popmusik.<br>
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
           ${Object.keys(club.openingHours).map(day => `
          <li>${daysSwedish[day]}: ${club.openingHours[day]}</li>
    `).join("")}
        </ul>
  
          <h2>Prislista:</h2>
        <ul>
          ${Object.keys(club.priceList).map(item => `
          <li>${item}: ${club.priceList[item]}</li>
    `).join("")}
        </ul>

          <h2>Atmosfär:</h2> 
          ${club.atmosphere}</p>
      </div>
      </div>
      <button class="booking-toggle-btn">Din bokning</button>
    </section>
  `;
}

