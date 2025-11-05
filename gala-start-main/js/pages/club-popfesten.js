import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function clubPopfesten() {
  const clubId = '1234';

  // Hämta klubbinformation
  const clubRes = await fetch('http://localhost:3000/clubs/' + clubId);
  const club = await clubRes.json();

  // Hämta events för klubben
  const eventsRes = await fetch('http://localhost:3000/events?clubId=' + clubId);
  const events = await eventsRes.json();

  return `
    <section class="club-page">

      <div class="club-header">
        <img class="club-image" src="../pictures/logo-popfesten.jpg" alt="${club.name}">
        <h1>${club.name}<br>
        ${club.description}</h1>
        <p class="club-info">Club Popfesten är kvällsklubben där popälskare samlas för att fira den svenska musiken vi aldrig tröttnat på. Våra artister och DJ's bjuder på allt från tidlösa popklassiker till dagens största hits, med energifyllda liveframträdanden och välkända covers som får hela dansgolvet att sjunga med. Oavsett om du älskar ikoniska retrovibbar eller fräsch modern pop är Club Popfesten platsen där nostalgi möter nutid, och där festen aldrig stannar av. Älskar du svensk pop? Kom och studsa med oss.</p>
      </div>

<div class="club-content">
    <div class="events-column">
      <h3>Kommande event</h3>
      DJ'n "Mr Music" spelar varje Torsdag-lördag blandad svensk popmusik.<br>
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
      <h3>Om klubben</h3>
      <p>
        Här kan du skriva valfri text om klubben, biljettinfo,
        öppettider, VIP, eller annan information.
      </p>
    </div>
  </div>
    </section>
  `;
}
