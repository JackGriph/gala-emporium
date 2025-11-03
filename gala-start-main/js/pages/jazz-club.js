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

  // Jazz club specific detailed layout
  return `
    <h1>${clubInfo.name}</h1>
    <p class="club-description">${clubInfo.description}</p>
    
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
      .map(({ date, name, description }) => `
        <article class="event">
          <h3>${name} <span class="event-date">${date}</span></h3>
          <p>${description}</p>
        </article>
      `)
      .join('')
    }
  `;
}