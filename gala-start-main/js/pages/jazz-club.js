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

  // Generate a simple booking ID
  function generateBookingId() {
    return 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
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

  // Handle booking form submission
  async function handleBooking(e, eventId, eventName, eventDate) {
    e.preventDefault(); // Stoppar vanlig formulär-submit
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const antal = formData.get('antal');

    // Hämtar data och kollar så att alla fällt är ifyllda
    if (!name || !antal || antal < 1) {
      alert('Vänligen fyll i alla fält korrekt.');
      return;
    }

    // Genererar bokningsnummer och skapar objekt med bokningsinformation
    const bookingId = generateBookingId();
    const booking = {
      id: bookingId,
      name: name,
      antal: parseInt(antal),
      eventId: eventId,
      eventName: eventName,
      eventDate: eventDate,
      clubId: 'a37c',
      createdAt: new Date().toISOString()
    };

    // Visa bekräftelsen FÖRST (VIKTIGT) (innan vi postar till servern)
    const formWrapper = e.target.closest('.event-booking-form');
    const originalForm = formWrapper.innerHTML; // Spara originalformuläret

    formWrapper.innerHTML = `
      <div class="confirmation-box">
        <h4>✅ Bokning bekräftad!</h4>
        <p><strong>Evenemang:</strong> ${eventName}</p>
        <p><strong>Datum:</strong> ${eventDate}</p>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>Antal personer:</strong> ${antal}</p>
        <p><strong>Bokningsnummer:</strong> <span class="booking-id">${bookingId}</span></p>
        <p class="info-text">Spara ditt bokningsnummer! Du kommer att behöva det vid entrén.</p>
        <button class="btn-primary close-confirmation-btn">Stäng & Spara</button>
      </div>
    `;

    // Scrolla till bekräftelsen
    formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Lägg till event listener för stäng-knappen
    const closeBtn = formWrapper.querySelector('.close-confirmation-btn');
    let bookingSaved = false;

    closeBtn.addEventListener('click', async () => {
      // Spara till servern när användaren klickar på stäng (om inte redan sparat)
      if (!bookingSaved) {
        bookingSaved = true;
        try {
          // Nu sparar vi till servern
          await fetch('http://localhost:3000/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking)
          });
        } catch (error) {
          console.error('Booking error:', error);
        }
      }
      // Återställ event listener för det nya formuläret
      formWrapper.innerHTML = originalForm;
      // Event listeners återställs för nya bokningar
      const newForm = formWrapper.querySelector('form');
      newForm.addEventListener('submit', (e) => handleBooking(e, eventId, eventName, eventDate));
    });
  }

  // Söker efter bokningar med det angivna ID:t
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
            <h4>📋 Din bokning</h4>
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
            <p>❌ Ingen bokning hittades med detta nummer.</p>
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
      toggleBtn.addEventListener('click', toggleBookingMenu);
    }

    // Lookup form
    const lookupForm = document.querySelector('#lookup-form form');
    if (lookupForm) {
      lookupForm.addEventListener('submit', handleLookup);
    }

    // Event booking forms
    document.querySelectorAll('.event-booking-form form').forEach((form) => {
      const eventId = form.dataset.eventId;
      const eventName = form.dataset.eventName;
      const eventDate = form.dataset.eventDate;

      form.addEventListener('submit', (e) => handleBooking(e, eventId, eventName, eventDate));
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
          ${clubInfo.specialFeatures.map(feature => `<li><strong>${feature}</strong></li>`).join('')}
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
              <form data-event-id="${id}" data-event-name="${name}" data-event-date="${date}">
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