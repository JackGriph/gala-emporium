import clubInfoAndEvents from "../utils/club-info-and-events.js";
import { getUserRole, authenticateUser, logoutUser, isAdmin } from "../utils/user-roles.js";

export default async function start() {
  // Hämta alla klubbar
  const clubsResponse = await fetch('http://localhost:3000/clubs');
  const clubs = await clubsResponse.json();

  const eventHtml = await clubInfoAndEvents();

  // Setup event listeners after HTML is rendered
  setTimeout(() => {
    // Login form handling
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#login-email').value;
        const password = document.querySelector('#login-password').value;
        
        const result = authenticateUser(email, password);
        if (result.success) {
          alert(`Inloggad som ${result.role}`);
          location.reload(); // Reload to update menu
        } else {
          alert(result.message);
        }
      });
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logoutUser();
        location.reload();
      });
    }
  }, 0);

  return `
    <div class="hero-section">
      <h1 class="main-title">Gala Emporium</h1>
      <p class="hero-subtitle"> Ultimate Nightlife Destination</p>
      <p class="hero-description">
        Välkommen till Gala Emporium – där fyra unika musikvärldar möts under ett tak. 
        Oavsett om du älskar intimt jazz, svensk pop, urban hiphop eller retro-nostalgi, 
        hittar du din perfekta kväll hos oss.
      </p>
      
      ${!isAdmin() ? `
        <div class="login-section">
          <h3>Logga in</h3>
          <form id="login-form">
            <div class="form-group">
              <input type="email" id="login-email" placeholder="E-post" required>
            </div>
            <div class="form-group">
              <input type="password" id="login-password" placeholder="Lösenord" required>
            </div>
            <button type="submit" class="login-btn">Logga in</button>
          </form>
          <p class="login-info">Admin-konto: admin@gala.se / admin123</p>
        </div>
      ` : `
        <div class="user-info">
          <p>Inloggad som: <strong>${getUserRole()}</strong></p>
          <button class="logout-btn">Logga ut</button>
        </div>
      `}
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