export default async function createEvent() {
  // Fetch all clubs for dropdown
  const clubs = await (await fetch('http://localhost:3000/clubs')).json();

  // Generate a random event ID
  function generateEventId() {
    return Math.random().toString(36).substr(2, 4);
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const eventName = formData.get('event-name');
    const description = formData.get('description');
    const date = formData.get('date');
    const time = formData.get('time');
    const clubId = formData.get('club-id');

    if (!eventName || !description || !date || !time || !clubId) {
      alert('Vänligen fyll i alla fält.');
      return;
    }

    const eventId = generateEventId();
    const dateTime = `${date} ${time}`;

    const newEvent = {
      id: eventId,
      date: dateTime,
      name: eventName,
      description: description,
      clubId: clubId
    };

    try {
      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent)
      });

      if (response.ok) {
        document.querySelector('#event-form').style.display = 'none';
        document.querySelector('#confirmation').innerHTML = `
          <div class="success-message">
            <h3>✅ Evenemang skapat!</h3>
            <p><strong>Namn:</strong> ${eventName}</p>
            <p><strong>Datum:</strong> ${dateTime}</p>
            <p><strong>Beskrivning:</strong> ${description}</p>
            <p><strong>Event ID:</strong> ${eventId}</p>
            <button onclick="location.reload()">Skapa ett nytt evenemang</button>
          </div>
        `;
        document.querySelector('#confirmation').style.display = 'block';
      }
    } catch (error) {
      alert('Något gick fel. Försök igen senare.');
      console.error('Event creation error:', error);
    }
  }

  // Setup event listener after HTML is rendered
  setTimeout(() => {
    const form = document.querySelector('#event-form form');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
  }, 0);

  return `
    <h1>Skapa evenemang</h1>
    <p class="page-description"> <strong>Skapa ett nytt evenemang för din klubb</strong></p>
    
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
