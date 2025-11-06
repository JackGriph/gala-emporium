

export default async function createClub() {
  return `
  <h2>Skapa en klubb</h2>
  <form method = "post">
    <input type = "text" name="club-name">
    <input type = "text" name="description">
    <input type ="submit" value = "Skapa"> 
  </form>

  `;

}

async function submitForm(event) {
  event.preventDefault();
  const target = event.target;
  const clubName = target.querySelector('input[name="club-name"]').value;
  const description = target.querySelector('input[name="description"]').value;
  console.log("clubName", clubName, description);

  // Skicka datan till servern med POST
  await fetch('http://localhost:3000/clubs', {
    method: 'post',
    headers: { 'ContentType': 'application/json' },
    body: JSON.stringify({ name: clubName, description })
  });

}



window.submitForm = submitForm;