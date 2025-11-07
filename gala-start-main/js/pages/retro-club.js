import clubInfoAndEvents from "../utils/club-info-and-events";

export default async function retroClub() {
  const clubInfo = await (await fetch('http://localhost:3000/clubs/fg5i')).json();
  const events = await (await fetch('http://localhost:3000/events?clubId=fg5i')).json();

}