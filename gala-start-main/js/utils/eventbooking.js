// eventbooking.js - Module for handling event bookings

// Generate a unique booking ID
export function generateBookingId() {
  return 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Handle booking form submission
export async function handleBooking(e, eventId, eventName, eventDate, clubId) {
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
    eventId: eventId,
    eventName: eventName,
    eventDate: eventDate,
    clubId: clubId,
    createdAt: new Date().toISOString()
  };

  // Show confirmation first
  const formWrapper = e.target.closest('.event-booking-form');
  const originalForm = formWrapper.innerHTML;

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

  // Scroll to confirmation
  formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Add event listener for close button
  const closeBtn = formWrapper.querySelector('.close-confirmation-btn');
  let bookingSaved = false;

  closeBtn.addEventListener('click', async () => {
    if (!bookingSaved) {
      bookingSaved = true;
      try {
        await fetch('http://localhost:3000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking)
        });
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    }

    formWrapper.innerHTML = originalForm;
    // Reattach event listener for the new form
    const newForm = formWrapper.querySelector('form');
    newForm.addEventListener('submit', (e) => handleBooking(e, eventId, eventName, eventDate, clubId));
  });
}

// Handle booking lookup
export async function handleLookup(e) {
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

// Toggle booking menu visibility
export function toggleBookingMenu() {
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