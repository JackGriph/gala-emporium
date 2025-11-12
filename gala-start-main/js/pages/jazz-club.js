import { handleBooking, handleLookup } from '../utils/eventbooking.js';

export default async function jazzClub() {
  // Fetch club info and events for jazz club
  const clubInfo = await (await fetch('http://localhost:3000/clubs/a37c')).json();
  const events = await (await fetch('http://localhost:3000/events?clubId=a37c')).json();

  // Jazz-specific formatting function
  function formatOpeningHours(hours) {
    const days = {
      monday: 'Måndag',
      tuesday: 'Tisdag',
      wednesday: 'Onsdag',
      thursday: 'Torsdag',
      friday: 'Fredag',
      saturday: 'Lördag',
      sunday: 'Söndag'
    };

    return Object.entries(hours)
      .map(([day, time]) => `<div class="opening-hour"><strong>${days[day]}:</strong> ${time}</div>`)
      .join('');
  }

  // Toggle booking menu visibility
  function toggleBookingMenu() {
    const menu = document.querySelector('#booking-menu');
    const btn = document.querySelector('.booking-toggle-btn');
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      btn.textContent = '🎫 Din bokning';
    } else {
      menu.classList.add('show');
      btn.textContent = '✕ Stäng bokning';
    }
  }

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

    // Event booking forms - använd handleBooking från eventbooking.js
    document.querySelectorAll('.event-booking-form form').forEach((form, index) => {
      const event = events.toSorted((a, b) => a.date > b.date ? 1 : -1)[index];
      if (event) {
        form.addEventListener('submit', (e) =>
          handleBooking(e, event.id, event.name, event.date, 'a37c')
        );
      }
    });
  }, 0);

  // Jazz club specific detailed layout
  return `
    <h1>${clubInfo.name}</h1>
    <p class="club-description">${clubInfo.description}</p>
    
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
    
    <div class="club-details">
      <div class="club-info-section">
        <h3>📍 Kontaktuppgifter</h3>
        <p><strong>Adress:</strong> ${clubInfo.address}</p>
        <p><strong>Telefon:</strong> ${clubInfo.phone}</p>
        <p><strong>Email:</strong> <a href="mailto:${clubInfo.email}">${clubInfo.email}</a></p>
      </div>
      
      <div class="club-info-section">
        <h3>🕐 Öppettider</h3>
        <div class="opening-hours">
          ${formatOpeningHours(clubInfo.openingHours)}
        </div>
      </div>
      
      <div class="club-info-section">
        <h3>🎭 Atmosfär & Miljö</h3>
        <p>${clubInfo.atmosphere}</p>
      </div>
      
      <div class="club-info-section"> 
        <h3>ℹ️ Praktisk Information</h3>
        <p><strong>Kapacitet:</strong> ${clubInfo.capacity}</p>
        <p><strong>Åldersgräns:</strong> ${clubInfo.ageLimit}</p>
        <p><strong>Klädkod:</strong> ${clubInfo.dressCode}</p>
        <p><strong>Priskllass:</strong> ${clubInfo.priceRange}</p>
      </div>
      
      <div class="club-info-section">
        <h3>✨ Specialiteter</h3>
        <ul class="special-features">
          ${clubInfo.specialFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <h2>🎵 Kommande Events</h2>
    ${events
      .toSorted((a, b) => a.date > b.date ? 1 : -1)
      .map(({ id, date, name, description }) => `
        <article class="event">
          <h3>${name} <span class="event-date">${date}</span></h3>
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
      .join('')
    }
  `;
}