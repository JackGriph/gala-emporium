# Gala Emporium

En interaktiv webbplats för musikklubbar där besökare kan utforska olika klubbar, lyssna på musik och boka evenemang.

## Funktioner

### 🎵 Klubbsidor
- **Hip-Hop Klubben** - Urban kultur med fresh beats
- **Jazz Klubben** - Elegant jazzupplevelse
- **Retro-klubben** - Nostalgiska synthar och neonljus
- **Club Popfesten** - Popmusik och feststämning

### ✨ Huvudfunktioner

**Musikspelare**
- Inbyggd HTML5 audiospelare med custom play/pause-knapp
- Förhandsvisning av klubbens musikstil

**Bokningssystem**
- Boka platser till kommande evenemang
- Tvåstegs-bekräftelse med synligt boknings-ID
- Sök upp dina bokningar med boknings-ID
- Bokningar sparas i JSON-databas

**Evenemangsinformation**
- Visa kommande evenemang med datum och beskrivning
- Prislista för entré och drycker
- Atmosfärsbeskrivningar för varje klubb

**Responsiv Design**
- Moderna CSS-gradienter och glow-effekter
- Anpassad färgtematik för varje klubb (Hip-Hop: ljusgrön, Jazz: guld, Metal: röd/svart)
- Raleway-typsnitt för elegant look

## Teknisk Struktur

### Frontend
- **HTML5** - Semantisk struktur
- **CSS3** - Modulär styling med klubb-specifika teman
- **JavaScript ES6** - Modulär arkitektur med imports/exports

### Backend
- **JSON Server** - RESTful API på `localhost:3000`
- Endpoints: `/clubs`, `/events`, `/bookings`

### Filstruktur
```
├── index.html              # Startsida
├── css/
│   ├── pages/             # Klubb-specifik styling
│   │   ├── hiphop-club.css
│   │   ├── jazz-club.css
│   │   ├── retro-club.css
│   │   └── club-popfesten.css
│   └── utils/             # Global styling
├── js/
│   ├── pages/             # Klubb-specifik logik
│   │   ├── hiphop-club.js
│   │   └── ...
│   └── utils/             # Delade utilities
│       ├── eventbooking.js    # Bokningssystem
│       └── club-info-and-events.js
└── json/
    └── db.json            # Databas för klubbar, events, bokningar
```

## Installation & Körning

1. **Installera dependencies:**
```powershell
npm install
```

2. **Starta JSON Server:**
```powershell
cd json
json-server --watch db.json --port 3000
```

3. **Öppna webbplatsen:**
Öppna `index.html` i en webbläsare eller använd en live server.

## Utveckling

### Bokningssystem
Bokningslogiken är modulariserad i `eventbooking.js` med funktioner:
- `generateBookingId()` - Genererar unikt ID med 'BK'-prefix
- `handleBooking()` - Hanterar bokningsflödet
- `handleLookup()` - Söker upp befintliga bokningar
- `toggleBookingMenu()` - Växlar bokningsvy

### Färgteman
Varje klubb har sitt unika färgtema:
- **Hip-Hop:** Ljusgrön (#00ff88, #00cc66, #66ffaa)
- **Jazz:** Guld/Orange (#ffd700, #ff8c00)
- **Retro:** Röd/Blå
- **Popfesten:** Custom tema

## Senaste Uppdateringar

- ✅ Implementerat komplett bokningssystem
- ✅ Refaktorerat till modulär kod (eventbooking.js)
- ✅ Lagt till prislista och atmosfärsbeskrivningar
- ✅ Migrerat Hip-Hop klubben till ljusgrön färgtematik
- ✅ Custom audiospelare med styled play/pause-knapp
- ✅ Raleway-typsnitt för modern känsla

## Framtida Utveckling

- Lägg till fler klubbar och genrer
- Implementera användarautentisering
- Lägg till betalningssystem
- Mobil app-version