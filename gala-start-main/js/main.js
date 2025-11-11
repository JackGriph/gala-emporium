import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import clubPopfesten from './pages/club-popfesten.js';
import hiphopClub from './pages/hiphop-club.js';
import createEvent from './pages/create-event.js';


const isAdmin = true; //resultat av en inlogging

// Our menu: label to display in menu and 
// function to run on menu choice
const menu = {
  "start": { label: 'Start', function: start },
  "jazz-klubben": { label: 'Jazz-klubben', function: jazzClub },
  "club-popfesten": { label: 'Club Popfesten', function: clubPopfesten },
  "hiphop-klubben": { label: 'Hiphop klubben', function: hiphopClub },
  "create-event": { label: 'Skapa evenemang', function: createEvent, isAdminPage: true }
};

function createMenu() {
  // Object.entries -> convert object to array
  // then map to create a-tags (links)
  // then join everything into one big string
  return Object.entries(menu)
    .map(([urlHash, { label, isAdminPage }]) => {
      if (isAdminPage && isAdmin) {
        return `<a href="#${urlHash}">${label}</a>`;
      }
      else if (!isAdminPage) {
        return `<a href="#${urlHash}">${label}</a>`;
      }
    })
    .join(' ');
}

async function loadPageContent() {
  // if no hash redirect to #start
  if (location.hash === '') { location.replace('#start'); }
  // add a class on body so that we can style differnt pages differently
  document.body.setAttribute('class', location.hash.slice(1));
  // get the correct function to run depending on location.hash
  const functionToRun = menu[location.hash.slice(1)].function;
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