export default async function createEvent() {
  // Fetch all clubs for dropdown
  const clubs = await (await fetch('http://localhost:3000/clubs')).json();

  return `
    <h1>Skapa ett nytt evenemang för din klubb</h1>
    
    <div id="event-form" class="form-container">
      <form>
        <div class="form-group">
          <label for="event-name">Evenemangsnamn:</label>
          <input type="text" id="event-name" name="event-name" required placeholder="T.ex. Jazz Night">
        </div>

        <div class="form-group">
          <label for="description">Beskrivning:</label>
          <textarea id="description" name="description" required placeholder="Beskriv eventet..." rows="4"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Datum:</label>
            <input type="date" id="date" name="date" required>
          </div>

          <div class="form-group">
            <label for="time">Tid:</label>
            <input type="time" id="time" name="time" required>
          </div>
        </div>

        <div class="form-group">
          <label for="club-id">Välj klubb:</label>
          <select id="club-id" name="club-id" required>
            <option value="">-- Välj en klubb --</option>
            ${clubs.map(club => `<option value="${club.id}">${club.name}</option>`).join('')}
          </select>
        </div>

        <button type="submit" class="btn-submit">Skapa evenemang</button>
      </form>
    </div>

    <div id="confirmation" style="display: none;"></div>
  `;
}

// Event delegation för create event form
document.body.addEventListener('submit', async (event) => {
  if (!event.target.closest('#event-form form')) { return; }

  console.log('🎯 Form submit intercepted!');
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const formData = new FormData(event.target);

  const eventName = formData.get('event-name');
  const description = formData.get('description');
  const date = formData.get('date');
  const time = formData.get('time');
  const clubId = formData.get('club-id');

  if (!eventName || !description || !date || !time || !clubId) {
    alert('Vänligen fyll i alla fält.');
    return;
  }

  const eventId = Math.random().toString(36).substr(2, 4);
  const dateTime = `${date} ${time}`;

  const newEvent = {
    id: eventId,
    date: dateTime,
    name: eventName,
    description: description,
    clubId: clubId
  };

  // Visa bekräftelsen FÖRST (innan vi postar till servern)
  const eventFormContainer = document.querySelector('#event-form');
  const confirmationContainer = document.querySelector('#confirmation');

  // Spara originalformuläret för återställning
  const originalForm = eventFormContainer.innerHTML;

  eventFormContainer.style.display = 'none';
  confirmationContainer.innerHTML = `
    <div class="success-message">
      <h3>✅ Evenemang skapat!</h3>
      <p><strong>Namn:</strong> ${eventName}</p>
      <p><strong>Datum:</strong> ${dateTime}</p>
      <p><strong>Beskrivning:</strong> ${description}</p>
      <p><strong>Event ID:</strong> ${eventId}</p>
      <button class="btn-submit close-confirmation-btn">Stäng & Spara</button>
    </div>
  `;
  confirmationContainer.style.display = 'block';

  // Scrolla till bekräftelsen
  if (confirmationContainer) confirmationContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Lägg till event listener för stäng-knappen
  const closeBtn = confirmationContainer.querySelector('.close-confirmation-btn');
  let eventSaved = false;

  closeBtn.addEventListener('click', async () => {
    // Spara till servern när användaren klickar på stäng (om inte redan sparat)
    if (!eventSaved) {
      eventSaved = true;
      try {
        await fetch('http://localhost:3000/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent)
        });
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }

    // Återställ formuläret
    confirmationContainer.style.display = 'none';
    confirmationContainer.innerHTML = '';
    eventFormContainer.innerHTML = originalForm;
    eventFormContainer.style.display = 'block';
  });

  return false; // Extra säkerhet för att förhindra formulär-submit
});
