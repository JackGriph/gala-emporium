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

  // Generate booking ID
  function generateBookingId() {
    return 'POP' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Handle booking form submission
  async function handleBooking(e, eventDate, eventName) {
    e.preventDefault();
    const formData = new FormData(e.target);
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

    try {
      const response = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking)
      });

      if (response.ok) {
        const formWrapper = e.target.closest('.event-booking-form');
        formWrapper.innerHTML = `
          <div class="confirmation-box">
            <h4>Bokning bekräftad!</h4>
            <p><strong>Evenemang:</strong> ${eventName}</p>
            <p><strong>Datum:</strong> ${eventDate}</p>
            <p><strong>Namn:</strong> ${name}</p>
            <p><strong>Antal personer:</strong> ${antal}</p>
            <p><strong>Bokningsnummer:</strong> <span class="booking-id">${bookingId}</span></p>
            <p class="info-text">Spara ditt bokningsnummer! Du kommer att behöva det vid entrén.</p>
            <button class="btn-secondary close-confirmation">✕ Stäng</button>
          </div>
        `;

        // Add event listener for the close button
        const closeButton = formWrapper.querySelector('.close-confirmation');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            formWrapper.querySelector('.confirmation-box').remove();
            formWrapper.querySelector('details').open = false;
          });
        }
      }
    } catch (error) {
      alert('Något gick fel. Försök igen senare.');
      console.error('Booking error:', error);
    }
  }

  // Handle booking lookup
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

  // Setup event listeners after HTML is rendered
  setTimeout(() => {
    // Toggle button
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

    // Lookup form
    const lookupForm = document.querySelector('#lookup-form form');
    if (lookupForm) {
      lookupForm.addEventListener('submit', handleLookup);
    }

    // Event booking forms
    document.querySelectorAll('.event-booking-form form').forEach((form, index) => {
      const event = events.toSorted((a, b) => a.date > b.date ? 1 : -1)[index];
      if (event) {
        form.addEventListener('submit', (e) => handleBooking(e, event.date, event.name));
      }
    });
  }, 0);

  return `
    <section class="club-page">
      <div class="club-header">
        <!---<img class="club-image" src="pictures/logo-popfesten.jpg" alt="${club.name}">--->
        <h1>${club.name}</h1>
        <h2>${club.description}</h2>
        <p class="club-info">Club Popfesten är kvällsklubben där popälskare samlas för att fira den svenska musiken vi aldrig tröttnat på. Våra artister och DJ's bjuder på allt från tidlösa popklassiker till dagens största hits, med energifyllda liveframträdanden och välkända covers som får hela dansgolvet att sjunga med. Oavsett om du älskar ikoniska retrovibbar eller fräsch modern pop är Club Popfesten platsen där nostalgi möter nutid, och där festen aldrig stannar av. Älskar du svensk pop? Kom och studsa med oss.</p>
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
