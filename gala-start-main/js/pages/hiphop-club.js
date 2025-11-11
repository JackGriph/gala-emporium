
export default async function hiphopClub() {
  // Hämta klubbdata och events från API
  const clubId = 'h1ph';
  const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
  const events = await (await fetch(`http://localhost:3000/events?clubId=${clubId}`)).json();

  // Extrahera klubbinfo
  const { name, description } = clubData;

  // Booking helpers (copied/adapted from club-popfesten)
  function generateBookingId() {
    return 'HIP' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  async function handleBooking(e, eventDate, eventName) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const antal = formData.get('antal');

    if (!name || !antal || antal < 1) {
      alert('Vänligen fyll i alla fält korrekt.');
      return;
    }

    const bookingId = generateBookingId();
    const booking = {
      id: bookingId,
      name: name,
      antal: parseInt(antal),
      eventDate: eventDate,
      eventName: eventName,
      clubId: clubId,
      createdAt: new Date().toISOString()
    };

    // Show a confirmation box first; only save when user clicks "Spara bokning"
    const formWrapper = form.closest('.event-booking-form');
    if (!formWrapper) return;

    // Save original HTML so we can restore if user cancels
    formWrapper.dataset.orig = formWrapper.innerHTML;
    // Store booking data safely
    formWrapper.dataset.booking = encodeURIComponent(JSON.stringify(booking));

    formWrapper.innerHTML = `
      <div class="confirmation-box pending-confirmation">
        <h4>Bekräfta din bokning</h4>
        <p><strong>Evenemang:</strong> ${eventName}</p>
        <p><strong>Datum:</strong> ${eventDate}</p>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>Antal personer:</strong> ${antal}</p>
        <p class="info-text">Klicka "Spara bokning" för att faktiskt spara din bokning. Klicka "Stäng" för att ångra.</p>
        <div style="display:flex; gap:10px; margin-top:10px;">
          <button class="btn-primary save-booking">Spara bokning</button>
          <button class="btn-secondary close-confirmation">Stäng</button>
        </div>
      </div>
    `;

    const saveBtn = formWrapper.querySelector('.save-booking');
    const closeBtn = formWrapper.querySelector('.close-confirmation');

    // Cancel - restore original form and reattach listener
    closeBtn.addEventListener('click', () => {
      const orig = formWrapper.dataset.orig || '';
      formWrapper.innerHTML = orig;
      delete formWrapper.dataset.orig;
      delete formWrapper.dataset.booking;
      const restoredForm = formWrapper.querySelector('form');
      if (restoredForm) {
        restoredForm.addEventListener('submit', (ev) => handleBooking(ev, eventDate, eventName));
      }
    });

    // Save - POST to API
    saveBtn.addEventListener('click', async () => {
      const bookingStr = formWrapper.dataset.booking;
      if (!bookingStr) return alert('Ingen bokningsdata hittades.');
      const b = JSON.parse(decodeURIComponent(bookingStr));
      try {
        const response = await fetch('http://localhost:3000/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(b)
        });

        if (response.ok) {
          // Store booking ID in the details element
          const detailsElement = formWrapper.closest('.event-card')?.querySelector('details');
          if (detailsElement) {
            detailsElement.dataset.bookingId = b.id;
            // Keep details open
            detailsElement.setAttribute('open', 'open');
          }
          
          formWrapper.innerHTML = `
            <div class="confirmation-box success-confirmation">
              <h4>✅ Bokning sparad!</h4>
              <p><strong>Evenemang:</strong> ${b.eventName}</p>
              <p><strong>Datum:</strong> ${b.eventDate}</p>
              <p><strong>Namn:</strong> ${b.name}</p>
              <p><strong>Antal personer:</strong> ${b.antal}</p>
              <p style="margin-top: 20px; font-size: 1.2em;"><strong>Bokningsnummer:</strong></p>
              <p><span class="booking-id">${b.id}</span></p>
              <p class="info-text">⚠️ Spara ditt bokningsnummer! Du kommer att behöva det vid entrén.</p>
              <button class="btn-secondary close-confirmation" style="margin-top: 20px;">✕ Stäng och återgå till formuläret</button>
            </div>
          `;

          const closeAfterSave = formWrapper.querySelector('.close-confirmation');
          if (closeAfterSave) {
            closeAfterSave.addEventListener('click', (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              // Restore the original form
              const orig = formWrapper.dataset.orig || '';
              formWrapper.innerHTML = orig;
              delete formWrapper.dataset.orig;
              delete formWrapper.dataset.booking;
              const restoredForm = formWrapper.querySelector('form');
              if (restoredForm) {
                restoredForm.addEventListener('submit', (e) => handleBooking(e, eventDate, eventName));
              }
            });
          }
        } else {
          alert('Kunde inte spara bokningen. Försök igen.');
        }
      } catch (err) {
        console.error('Booking save error:', err);
        alert('Ett fel uppstod vid sparande av din bokning.');
      }
    });
  }

  async function handleLookup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingId = formData.get('lookupId');

    if (!bookingId) {
      alert('Vänligen ange ett bokningsnummer.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/bookings?id=${bookingId}`);
      const bookings = await response.json();

      if (bookings.length > 0) {
        const booking = bookings[0];
        document.querySelector('#lookup-result').innerHTML = `
          <div class="confirmation-box">
            <h4>Din bokning</h4>
            <p><strong>Evenemang:</strong> ${booking.eventName}</p>
            <p><strong>Datum:</strong> ${booking.eventDate}</p>
            <p><strong>Namn:</strong> ${booking.name}</p>
            <p><strong>Antal personer:</strong> ${booking.antal}</p>
            <p><strong>Bokningsnummer:</strong> <span class="booking-id">${booking.id}</span></p>
            <p class="info-text">Visa detta vid entrén.</p>
          </div>
        `;
        document.querySelector('#lookup-result').style.display = 'block';
      } else {
        document.querySelector('#lookup-result').innerHTML = `
          <div class="error-box">
            <p>Ingen bokning hittades med detta nummer.</p>
          </div>
        `;
        document.querySelector('#lookup-result').style.display = 'block';
      }
    } catch (error) {
      alert('Något gick fel. Försök igen senare.');
      console.error('Lookup error:', error);
    }
  }

  // Setup listeners after HTML renders
  setTimeout(() => {
    const toggleBtn = document.querySelector('.booking-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const menu = document.querySelector('#booking-menu');
        const btn = document.querySelector('.booking-toggle-btn');
        if (menu.classList.contains('show')) {
          menu.classList.remove('show');
          btn.textContent = 'Din bokning';
        } else {
          menu.classList.add('show');
          btn.textContent = '✕ Stäng bokning';
        }
      });
    }

    const lookupForm = document.querySelector('#lookup-form form');
    if (lookupForm) lookupForm.addEventListener('submit', handleLookup);

    document.querySelectorAll('.event-booking-form form').forEach((form, index) => {
      const event = events.toSorted((a, b) => a.date > b.date ? 1 : -1)[index];
      if (event) {
        form.addEventListener('submit', (e) => handleBooking(e, event.date, event.name));
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
          ${clubData.atmosphere || ''}</p>
      </div>
      </div>
      <button class="booking-toggle-btn">Din bokning</button>
    </div>
  `;
}

