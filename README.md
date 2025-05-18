# Food-app - WebAdvanced Project

Een interactieve single-page webapplicatie waarin gebruikers recepten kunnen opzoeken, filteren, sorteren en opslaan als favoriet. De applicatie is gebouwd met HTML, CSS en JavaScript (met Vite als bundler), en maakt gebruik van een externe recepten-API. 

Deze repository bevat de volledige broncode, inclusief codecommentaar, responsive design via media queries en styling via CSS modules.

---

## Functionaliteiten

- Recepten zoeken op naam
- Filteren op categorie en regio
- Alfabetisch sorteren op naam, categorie en regio 
- Weergave van recepten met ingrediënten, instructies en afbeeldingen 
- Toevoegen en beheren van favorieten via localStorage
- Responsief ontwerp voor verschillende schermformaten

---

## Gebruikte API

**TheMealDB API**

- [TheMealDB API](https://www.themealdb.com/api.php)  

  Deze API levert onder andere:
  - Ingrediënten
  - Instructies
  - Afbeeldingen
  - Categoriën
  - Regio
  - Youtube-links met bereidingsvideo's

---

## Technische implementatie

### 1. DOM manipulatie  
- Elementen selecteren : lijnen 2-7, 204-208
- Elementen manipuleren : lijnen 99-101, 117-175, 180-192 
- Events aan elementen koppelen: lijnen 118-120 

### 2. Modern JavaScript
- Gebruik van constanten: lijnen 2-7, 13-14, 26-28, 41-43, 79, 99, 109, 112, 125, 128, 131, 135, 138, 141, 149, 152, 155, 160, 169, 172, 175, 177, 178, 180, 204-208, 213-215, 223
- Template literals : lijnen 139, 142, 181
- Iteratie over arrays: lijn 106
- Array methodes: lijnen 75, 80, 81, 83, 106, 212, 213, 224, 228
- Arrow functions: lijnen  106, 118, 212, 224, 228
- Conditional (ternary) operator (moderne if..else): lijn 116
- Callback functions: lijnen 118, 212, 224
- Promises: lijnen 41, 54
- Async & Await: lijnen 24, 41, 43

### 3. Data & API
- Fetch om data op te halen: lijnen 24 - 59
- JSON manipuleren: lijnen 34, 43, 47, 67, 71 en weergeven: lijnen 113, 132, 133, 139, 142, 156, 161, 177, 178, 213 - 215, 232-239

### 4. Opslag & validatie
- Gebruik van LocalStorage: lijnen 26-28, 47-48

### 5. Styling & layout 
- Basis HTML layout 
- Basis CSS
- Gebruiksvriendelijke elementen
### 6. Tooling & structuur: 
- Project is opgezet met Vite 

 ---

## Installatiehandleiding+

Volg deze stappen om de food-app lokaal op je computer te draaien. 

1. **Project clonen**
Open je terminal en voer het volgende commando uit om de repository te kopiëren naar je computer:

git clone https://github.com/lauraSchets/food-app.git

2. **Map openen**
Ga naar de map van het project:

cd food-app

3. **Dependencies installeren**
Installeer alle nodige dependencies via npm:

npm install

Dit zal de Vite modules downloaden die nodig zijn om de app te laten werken. 

4. **Applicatie starten**
Start de ontwikkelserver met:

npm run dev

Hiermee wordt applicatie gestart

---

## Demo
Bekijk een korte demo van de werking van de applicatie:
https://youtu.be/xS-4vwsSPyI

---

## Gebruikte bronnen 
- TheMealDB API




