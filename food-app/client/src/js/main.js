//elementen (zoekvak en filters) ophalen uit index.html en opslaan in variabelen 
const app = document.getElementById('app');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const areaFilter = document.getElementById('area-filter');
const sortFilter = document.getElementById('sort-filter');
const favoritesOnlyCheckbox = document.getElementById('favorites-only');



//KEY: naam van de plek in de browser (localStorage) waar de recepten worden opgeslagen
//EXPIRATION: na 24 uur (24 x 60 minutes x 60 seconden x 1000 milliseconden) is de bewaarde data verlopen en moet deze opnieuw worden opgehaald
const KEY = 'mealsData'; 
const EXPIRATION = 24 * 60 * 60 * 1000; 



//is een lege array die later gevuld wordt met de maaltijden (uit de array 'meals') via de API
let allMeals = [];



//deze functie haalt de maaltijden op van het internet. async betekent dat we wachten tot het klaar is
async function fetchMeals() {
  // staat er al data in de browser en hoe oud is die data?
  const cachedData = localStorage.getItem(KEY);  //zoekt in de browser of er recepten zijn opgeslagen
  //je krijgt dan terug de recepten of null indien er niets gevonden werd
  const cachedTimestamp = localStorage.getItem(KEY + '_timestamp'); //kijkt wanneer recepten voor het laatst werden opgeslagen


  // als er data is, er een tijdstip is waarop die data is opgeslagen en het is nog geen 24 uur geleden...
  if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp < EXPIRATION)) {
    console.log('Gebruik gecachte data'); // .. dan gebruiken we de oude data uit de browser
    allMeals = JSON.parse(cachedData); //verandert JSON tekst in maaltijden
    updateMeals(); // toont maaltijden op basis van wat de gebruiker heeft gekozen (filter, sorteren) of ingetikt


    // als er geen cache is, wordt de data opgehaald via de API
  } else {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`); 
      // fetch functie maakt een verbinding met deze website en 
      const data = await response.json(); // zet de inhoud van response om naar een object
      allMeals = data.meals; // de array 'meals' met alle maaltijden uit het object worden hierin opgeslaan 

      // Sla de API-gegevens op in localStorage
      localStorage.setItem(KEY, JSON.stringify(allMeals));//zet maaltijden om naar tekst en bewaar deze in de browser onder de naam KEY
      localStorage.setItem(KEY + '_timestamp', Date.now()); //en bewaar tijdstip van nu

      updateMeals(); //toont de maaltijden


      // als er misgaat (bv. geen internet) vangt deze catch-blok de fout op
    } catch (error) {
      console.error('Fout bij ophalen meals:', error); // toont de foutmelding in de browserconsole
      app.textContent = 'Sorry, iets ging mis.'; //toont de foutmelding aan de gebruiker op de webpagina
    }
  }
}






function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || []; // haalt de favorieten op uit de browser. JSON.parse ze deze om naar een array. Indien niets in de favorieten, geeft lege array terug.
}

function saveFavorites(favs) {
  localStorage.setItem('favorites', JSON.stringify(favs)); // JSON.stringify zet de lijst favorieten om naar tekst en slaat deze op in de browser 
}

function isFavorite(id) {
  return getFavorites().includes(id); // haalt de lijst favorieten op, controleert of de gegeven maaltijd-id al in favorieten zit en returnt true or false. 
}

function toggleFavorite(id) {
  const favs = getFavorites(); // haalt de lijst van huidige favorieten op
  if (favs.includes(id)) { // if deze maaltijd een favoriet is:
    saveFavorites(favs.filter(favId => favId !== id)); // verwijder deze dan uit de lijst en sla nieuwe lijst op
  } else { 
    favs.push(id); // else voeg deze maaltijd toe aan de lijst 
    saveFavorites(favs); // sla de nieuwe lijst op
  }
}






// deze functie zorgt voor het tonen van de maaltijden op de webpagina
function displayMeals(meals) {
  app.innerHTML = ''; //dit verwijdert alle elementen die zich binnen de app container bevinden

// als de lijst maaltijden leeg is, wordt een bericht getoond 'No meals found.""
  if (meals.length === 0) { // 
    const message = document.createElement('p'); // maakt nieuwe <p> element aan 
    message.textContent = 'No meals found.'; // bericht die gebruiker ziet indien de lijst maaltijden leeg is
    app.appendChild(message); // voegt bericht toe aan app-container 
    return;
  }

  
  meals.forEach(meal => { // loop door alle maaltijden in de array 'meals'

    // HTML opbouw
    const mealContainer = document.createElement('div'); // per maaltijd een div container aanmaken 
    mealContainer.classList.add('meal'); // <div> container krijgt een css-klasse 'meal'

    const title = document.createElement('h2'); // <h2> element aanmaken voor naam van de maaltijd
    title.textContent = meal.strMeal; // titel vullen met naam van maaltijd

    const favButton = document.createElement('button'); //knop aanmaken om een maaltijd als favoriet te markeren of te verwijderen van favoriet
    favButton.textContent = isFavorite(meal.idMeal) ? '★ Favorite' : '☆ Add to favorites'; // tekst van de knop verandert afhankelijk van isFavorite of niet
    favButton.classList.add('fav-button'); // button krijgt een css-klasse  'fav-button'
    favButton.addEventListener('click', () => {  //als iemand op de button klikt...
      toggleFavorite(meal.idMeal); // ...favoriet wordt aan- of uitgezet
      updateMeals(); //functie (zie lijn 200) die maaltijdweergave ververst zodat de tekst op de knop verandert (van 'add to favorites' naar 'favorite' of omgekeerd)
    });



    const contentWrapper = document.createElement('div'); //<div> container aanmaken voor alle inhoud van de maaltijden
    contentWrapper.classList.add('meal-content'); //container krijgt CSS-klasse 'meal-content'

    const imageWrapper = document.createElement('div'); //<div> container aanmaken voor de afbeelding
    imageWrapper.classList.add('image-wrapper'); // container krijgt CSS-klasse 'image'wrapper

    const img = document.createElement('img'); // <img> element aangemaakt voor de afbeelding
    img.src = meal.strMealThumb; // bron van afbeelding toevoegen. meal.strMealThumb bevat de URL van de foto
    img.alt = meal.strMeal; // korte beschrijving van de afbeelding toevoegen. meal.strMeal bevat de naam van de maaltijd. alt-tekst wordt gebruikt als de afbeelding niet laadt

    const categoryArea = document.createElement('div'); // <div> container aanmaken voor categorie en gebied
    categoryArea.classList.add('category-area'); // container krijgt CSS-klasse 'category-area'

    const category = document.createElement('p'); //<p> element aanmaken voor categorie 
    category.textContent = `Category: ${meal.strCategory}`; // paragraaf vullen met de tekst 'Category: + category'

    const area = document.createElement('p'); //<p> element aanmaken voor area
    area.textContent = `Area: ${meal.strArea}`;// paragraaf vullen met de tekst 'Area: + area'

    categoryArea.append(category, area);//beide paragrafen (category en area) in een categoryArea-div steken
    imageWrapper.append(img, categoryArea);//afbeelding (img) en categoryArea-div aan de container imageWrapper toevoegen



    const instructionsDiv = document.createElement('div'); //<div> container aanmaken voor de bereidingsinstructies
    instructionsDiv.classList.add('instructions'); //container krijgt CSS-klasse 'instructions'

    const instructionsTitle = document.createElement('h3'); //<h3> element aanmaken voor de titel 'Instructions'
    instructionsTitle.textContent = 'Instructions:'; //tekst van het h3 kopje. Titel die zichtbaar wordt boven de uitleg

    const instructions = document.createElement('p'); //<p> element aanmaken voor de instructies
    instructions.textContent = meal.strInstructions; //instructies in de paragraaf zetten 


    //youtubevideo met het recept
    const video = document.createElement('a'); //hyperlinkelement <a> aanmaken
    video.href = meal.strYoutube; //meal.strYoutube (bevat de link van de video) toevoegen aan de href attribuut
    video.target = '_blank'; //link in een nieuw tabblad openen
    video.textContent = 'Watch video';//tekst die je op het scherm ziet en die de link van de video toont

    instructionsDiv.append(instructionsTitle, instructions, video);//voegt de 3 elementen samen in de <div> gemaakt op lijn 149



    const ingredientsDiv = document.createElement('div');//<div> element die de ingrediënten zal bevatten
    ingredientsDiv.classList.add('ingredients');//container krijgt CSS-klasse 'ingredients'

    const ingredientsTitle = document.createElement('h3');//<h3> element aanmaken voor de titel 'Ingredients'
    ingredientsTitle.textContent = 'Ingredients:'; //tekst van het h3 kopje. Titel wordt zichtbaar boven alle ingrediënten

    const ingredientsList = document.createElement('ul');//ongeordende lijst <ul> aanmaken 
    for (let i = 1; i <= 20; i++) { //loop over 20 ingrediënten en hoeveelheden. Elk ingrediënt zit in een aparte eigenschap (bv. strIngredient1, strIngredient2)
      const ing = meal[`strIngredient${i}`]; //opvragen van deze eigenschappen ingredients uit het object 'meal'
      const measure = meal[`strMeasure${i}`];//opvragen van eigenschappen hoeveelheden
      if (ing && ing.trim()) { //controleert of er wel iets bestaat
        const li = document.createElement('li'); //maakt dan een nieuwe lijstitem <li> aan
        li.textContent = `${ing} - ${measure}`; // zichtbare tekst: ingrediënt - hoeveelheid
        ingredientsList.appendChild(li); //voegt dit lijstitem <li> aan ingrediëntenlijst
      }
    }

    ingredientsDiv.append(ingredientsTitle, ingredientsList);//voegt titel ("Ingredients") en de lijst toe aan de <div> gemaakt op lijn 169


    //voegt alle onderdelen samen in de juist volgorde 
    contentWrapper.append(imageWrapper, instructionsDiv, ingredientsDiv); //voegt de 3 blokken toe aan contentWrapper
    mealContainer.append(title, favButton, contentWrapper);//grote <div> die alles bevat wat bij één maaltijd hoort
    app.appendChild(mealContainer);// voegt de complete maaltijdcontainer toe aan de app in de pagina
  });
}




//functie die wordt opgeroepen wanneer je de lijst met maaltijden wilt updaten bijvoorbeeld als:
// - je iets intypt in het zoekveld
// - je een categorie kiest
// - alleen favorieten wilt tonen
function updateMeals() {
  const search = searchInput.value.trim().toLowerCase(); //zoekterm van de gebruiker ophalen
  const selectedCategory = categoryFilter.value; // gekozen categorie van de gebruiker ophalen 
  const selectedArea = areaFilter.value; // gekozen regio van de gebruiker ophalen 
  const sortBy = sortFilter.value; // gekozen sorteervolgorde van de gebruiker ophalen 
  const showOnlyFavorites = favoritesOnlyCheckbox.checked; // bepaalt of je alle maaltijden toont of enkel de favoriete


  //maakt een nieuwe lijst, alleen met maaltijden die voldoen aan onderstaande voorwaarden
  let filteredMeals = allMeals.filter(meal => {
    const nameMatch = meal.strMeal.toLowerCase().includes(search); //naam van de maaltijd omzetten naar kleine letter en kijken of de zoekterm van gebruiker overeenkomt in de naam
    const categoryMatch = selectedCategory ? meal.strCategory === selectedCategory : true; //als er een categorie gekozen is, kijken of de maaltijd diezelfde categorie heeft
    const areaMatch = selectedArea ? meal.strArea === selectedArea : true; // idem maar met area 

    return nameMatch && categoryMatch && areaMatch; // alle voorwaarden moeten true zijn: dan komt maaltijd in de gefilterde lijst terecht
  });


  //alleen favorieten zien
  if (showOnlyFavorites) { //is true als het vinkje "show favorites only" aan staat (uit regel 208)
    const favIds = getFavorites(); //functie (zie lijn 66) die de lijst van favoriete maaltijden ophaalt uit localStorage  
    filteredMeals = filteredMeals.filter(meal => favIds.includes(meal.idMeal)); //pakt de gefilterde maaltijden en filter nog een keer om maaltijden te tonen die voorkomen in favorieten
  }

  if (sortBy) { //als er iets geselecteerd is (zie lijn 207), dan wordt de lijst gesorteerd
    filteredMeals.sort((a, b) => {  // lijst van filteredMeals sorteren met een vergelijkingsfunctie 
      let keyA = '', keyB = ''; // lege variabelen die gevuld zullen worden met sorteerwaarden
    
      if (sortBy === "name") { //sorteren op naam van de maaltijd 
        keyA = (a.strMeal || '').toLowerCase(); //als strMeal null is, wordt het een lege string
        keyB = (b.strMeal || '').toLowerCase();//toLowerCase zorgt ervoor dat hoofdletters geen invloed hebben op volgorde 
      } else if (sortBy === "category") { //sorteren op categorie
        keyA = (a.strCategory || '').toLowerCase();
        keyB = (b.strCategory || '').toLowerCase();
      } else if (sortBy === "area") { //sorteren op area 
        keyA = (a.strArea || '').toLowerCase();
        keyB = (b.strArea || '').toLowerCase();
      }
    
      return keyA.localeCompare(keyB); //vergelijkt keyA en keyB op alfabetische volgorde 
    });
    
  }

  //toont alle maaltijden die overblijven na filteren en sorteren 
  displayMeals(filteredMeals); //roept displayMeals functie (zie lijn 94) op met als argument de gefilterde en gesorteerde lijst 
}

searchInput.addEventListener('input', updateMeals); //rept updateMeals() op om de lijst maaltijden aan te passen op basis van de getypte zoekterm
categoryFilter.addEventListener('change', updateMeals); // maaltijden worden gefilterd op basis van gekozen categorie
areaFilter.addEventListener('change', updateMeals); // maaltijden worden gefilterd op basis van gezkozen regio
sortFilter.addEventListener('change', updateMeals); //maaltijden worden alfabetisch gesorteerd 
favoritesOnlyCheckbox.addEventListener('change', updateMeals); //toont alleen favorieten indien aangevinkt 

fetchMeals(); // haalt alle maaltijden op van de API en steekt ze in de array allMeals.