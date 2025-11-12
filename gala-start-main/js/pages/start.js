import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function start() {
  // Hämta alla klubbar
  const clubsResponse = await fetch('http://localhost:3000/clubs');
  const clubs = await clubsResponse.json();

  const eventHtml = await clubInfoAndEvents();

  return `
    <div class="hero-section">
      <h1 class="main-title">Gala Emporium</h1>
      <p class="hero-subtitle"> Ultimate Nightlife Destination</p>
      <p class="hero-description">
        Välkommen till Gala Emporium – där fyra unika musikvärldar möts under ett tak. 
        Oavsett om du älskar intimt jazz, svensk pop, urban hiphop eller retro-nostalgi, 
        hittar du din perfekta kväll hos oss.
      </p>
    </div>

    <div class="clubs-showcase">
      <h2 class="section-title">Våra Klubbar</h2>
      <div class="clubs-grid">
        ${clubs.map(club => `
          <a href="#${getClubHash(club.id)}" class="club-card">
            <div class="club-icon">${getClubIcon(club.id)}</div>
            <h3>${club.name}</h3>
            <p>${club.description}</p>
            <span class="visit-link">Besök klubben →</span>
          </a>
        `).join('')}
      </div>
    </div>

    <div class="events-section">
      <h2 class="section-title">Kommande Events</h2>
      <p class="section-subtitle">Se alla kommande evenemang från våra klubbar</p>
      ${eventHtml}
    </div>
  `;
}

// Hjälpfunktioner
function getClubHash(clubId) {
  const hashMap = {
    'a37c': 'jazz-klubben',
    '1234': 'club-popfesten',
    'h1ph': 'hiphop-klubben',
    'fg5i': 'retro-klubben'
  };
  return hashMap[clubId] || 'start';
}

function getClubIcon(clubId) {
  const iconMap = {
    'a37c': '🎷',
    '1234': '🎤',
    'h1ph': '🎧',
    'fg5i': '🕹️'
  };
  return iconMap[clubId] || '🎵';
}