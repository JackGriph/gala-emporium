import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function clubPopfesten() {
  const clubId = '1234';

  // Hämta klubbinformation
  const clubRes = await fetch('http://localhost:3000/clubs/' + clubId);
  const club = await clubRes.json();

  // Hämta events för klubben
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


  return `
    <section class="club-page">

      <div class="club-header">
        <img class="club-image" src="../../pictures/logo-popfesten.jpg" alt="${club.name}">
        <h1>${club.name}<br>
        ${club.description}</h1>
        <p class="club-info">Club Popfesten är kvällsklubben där popälskare samlas för att fira den svenska musiken vi aldrig tröttnat på. Våra artister och DJ's bjuder på allt från tidlösa popklassiker till dagens största hits, med energifyllda liveframträdanden och välkända covers som får hela dansgolvet att sjunga med. Oavsett om du älskar ikoniska retrovibbar eller fräsch modern pop är Club Popfesten platsen där nostalgi möter nutid, och där festen aldrig stannar av. Älskar du svensk pop? Kom och studsa med oss.</p>
      </div>

<div class="club-content">
    <div class="events-column">
      <h1>Kommande event:</h1>
      Olika DJ's spelar varje dag blandad svensk popmusik.<br>
      <ul class="event-list">
        ${events.map(event => `
          <li class="event-card">
            <h3> ${event.date}<br>
            ${event.name}<br>
            ${event.description}</h3>
          </li>`).join("")}
      </ul>
    </div>

  <div class="extra-info">
  <h1>Öppettider:</h1>
    <ul>
      ${Object.keys(club.openingHours).map(day => `
        <li>${daysSwedish[day]}: ${club.openingHours[day]}</li>
      `).join("")}<br>
  <h1>Prislista:</h1> 
      Entré vid event: 200 kr<br>
      Entré Övriga dagar: 100 kr<br>
      Drycker: 90 - 180 kr.<br>
      Snacks: 50 - 100 kr
    </ul>
  </div>
  </div>
    </section>
  `;
}
