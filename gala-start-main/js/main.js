import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import clubPopfesten from './pages/club-popfesten.js';
import hiphopClub from './pages/hiphop-club.js';
import createEvent from './pages/create-event.js';
import retroClub from './pages/retro-club.js';
import { isAdmin } from './utils/user-roles.js';


const menu = {
  "start": { label: 'Start', function: start },
  "jazz-klubben": { label: 'Jazz-klubben', function: jazzClub },
  "club-popfesten": { label: 'Club Popfesten', function: clubPopfesten },
  "hiphop-klubben": { label: 'Hiphop klubben', function: hiphopClub },
  "retro-klubben": { label: 'Retro-klubben', function: retroClub },
  "create-event": { label: 'Skapa evenemang', function: createEvent, isAdminPage: true }
};

function createMenu() {
  // Konvertera menu-objektet till en array och skapa HTML-länkar
  return Object.entries(menu)
    .filter(([, menuItem]) => {
      // Visa sidan om den INTE är en admin-sida, eller om användaren ÄR admin
      return !menuItem.isAdminPage || isAdmin();
    })
    .map(([urlHash, menuItem]) => {
      // Skapa en länk för varje menyalternativ
      return `<a href="#${urlHash}">${menuItem.label}</a>`;
    })
    .join(' '); // Kombinera alla länkar med mellanslag
}

async function loadPageContent() {
  // if no hash redirect to #start
  if (location.hash === '') { location.replace('#start'); }
  // add a class on body so that we can style differnt pages differently
  document.body.setAttribute('class', location.hash.slice(1));
  // get the correct function to run depending on location.hash
  const pageKey = location.hash.slice(1);
  const menuItem = menu[pageKey];
  
  // Check if page exists
  if (!menuItem) {
    location.replace('#start');
    return;
  }
  
  // Check admin access
  if (menuItem.isAdminPage && !isAdmin()) {
    alert('Du måste vara inloggad som club-admin för att komma åt denna sida.');
    location.replace('#start');
    return;
  }
  
  const functionToRun = menuItem.function;
  // run the function and expect it return a html string
  const html = await functionToRun();
  // replace the contents of the main element
  document.querySelector('main').innerHTML = html;
}

// call loadPageContent once on page load
loadPageContent();

// and then on every hash change of the url/location
window.onhashchange = loadPageContent;

// create the menu and display it
document.querySelector('header nav').innerHTML = createMenu();

// funktion för att inte menyn ska ligga över annan text på någon sida.
function adjustMainPadding() {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  if (!header || !main) return; // säkerhetskoll

  const headerHeight = header.offsetHeight;
  main.style.paddingTop = `${headerHeight + 10}px`; // 10px extra luft
}

// Kör funktionen när sidan laddas
window.addEventListener('load', adjustMainPadding);

// Kör igen om användaren ändrar fönsterstorlek
window.addEventListener('resize', adjustMainPadding);