const app = document.getElementById('app');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const areaFilter = document.getElementById('area-filter');
const sortFilter = document.getElementById('sort-filter');
const favoritesOnlyCheckbox = document.getElementById('favorites-only');

const KEY = 'mealsData'; // De sleutel voor localStorage
const EXPIRATION = 24 * 60 * 60 * 1000; // 24 uur (in milliseconden)

let allMeals = [];

async function fetchMeals() {
  const cachedData = localStorage.getItem(KEY);
  const cachedTimestamp = localStorage.getItem(KEY + '_timestamp');

  // Controleer of er gecachte gegevens zijn en of ze nog niet verlopen zijn
  if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp < EXPIRATION)) {
    console.log('Gebruik gecachte data');
    allMeals = JSON.parse(cachedData);
    updateMeals();
  } else {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
      const data = await response.json();
      allMeals = data.meals || [];

      // Sla de API-gegevens op in localStorage
      localStorage.setItem(KEY, JSON.stringify(allMeals));
      localStorage.setItem(KEY + '_timestamp', Date.now());

      updateMeals();
    } catch (error) {
      console.error('Fout bij ophalen meals:', error);
      app.textContent = 'Sorry, iets ging mis.';
    }
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favs) {
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const favs = getFavorites();
  if (favs.includes(id)) {
    saveFavorites(favs.filter(favId => favId !== id));
  } else {
    favs.push(id);
    saveFavorites(favs);
  }
}

function displayMeals(meals) {
  app.innerHTML = '';

  if (meals.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No meals found.';
    app.appendChild(message);
    return;
  }

  meals.forEach(meal => {
    const mealContainer = document.createElement('div');
    mealContainer.classList.add('meal');

    const title = document.createElement('h2');
    title.textContent = meal.strMeal;

    const img = document.createElement('img');
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;

    const category = document.createElement('p');
    category.textContent = `Category: ${meal.strCategory}`;

    const area = document.createElement('p');
    area.textContent = `Area: ${meal.strArea}`;

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('meal-content');

    const instructionsDiv = document.createElement('div');
    instructionsDiv.classList.add('instructions');

    const instructionsTitle = document.createElement('h3');
    instructionsTitle.textContent = 'Instructions:';

    const instructions = document.createElement('p');
    instructions.textContent = meal.strInstructions;

    const video = document.createElement('a');
    video.href = meal.strYoutube;
    video.target = '_blank';
    video.textContent = 'Watch video';

    instructionsDiv.append(instructionsTitle, instructions, video);

    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('ingredients');

    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'Ingredients:';

    const ingredientsList = document.createElement('ul');
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        const li = document.createElement('li');
        li.textContent = `${ing} - ${measure}`;
        ingredientsList.appendChild(li);
      }
    }

    ingredientsDiv.append(ingredientsTitle, ingredientsList);

    contentWrapper.append(instructionsDiv, ingredientsDiv);
    mealContainer.append(title, img, category, area, contentWrapper);
    
    app.appendChild(mealContainer);

    const favButton = document.createElement('button');
    favButton.textContent = isFavorite(meal.idMeal) ? '★ Favorite' : '☆ Add to favorites';
    favButton.classList.add('fav-button');

    favButton.addEventListener('click', () => {
      toggleFavorite(meal.idMeal);
      updateMeals(); // herteken zodat knop wijzigt
    });

    mealContainer.appendChild(favButton);
  });
}

function updateMeals() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedArea = areaFilter.value;
  const sortBy = sortFilter.value;
  const showOnlyFavorites = favoritesOnlyCheckbox.checked;

  let filteredMeals = allMeals.filter(meal => {
    const nameMatch = meal.strMeal.toLowerCase().includes(search);
    const categoryMatch = selectedCategory ? meal.strCategory === selectedCategory : true;
    const areaMatch = selectedArea ? meal.strArea === selectedArea : true;

    return nameMatch && categoryMatch && areaMatch;
  });

  if (showOnlyFavorites) {
    const favIds = getFavorites();
    filteredMeals = filteredMeals.filter(meal => favIds.includes(meal.idMeal));
  }

  if (sortBy) {
    filteredMeals.sort((a, b) => {
      let keyA, keyB;

      if (sortBy === "name") {
        keyA = a.strMeal.toLowerCase();
        keyB = b.strMeal.toLowerCase();
      } else if (sortBy === "category") {
        keyA = a.strCategory.toLowerCase();
        keyB = b.strCategory.toLowerCase();
      } else if (sortBy === "area") {
        keyA = a.strArea.toLowerCase();
        keyB = b.strArea.toLowerCase();
      }

      return keyA.localeCompare(keyB); 
    });
  }

  displayMeals(filteredMeals);
}

searchInput.addEventListener('input', updateMeals);
categoryFilter.addEventListener('change', updateMeals);
areaFilter.addEventListener('change', updateMeals);
sortFilter.addEventListener('change', updateMeals);
favoritesOnlyCheckbox.addEventListener('change', updateMeals);

fetchMeals();
