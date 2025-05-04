const app = document.getElementById('app');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const areaFilter = document.getElementById('area-filter');
const sortFilter = document.getElementById('sort-filter');

let allMeals = []; 


async function fetchMeals() {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    const data = await response.json();
    allMeals = data.meals || [];
    updateMeals();
  } catch (error) {
    console.error('Fout bij ophalen meals:', error);
    app.textContent = 'Sorry, iets ging mis.';
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
  });
}


function updateMeals() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedArea = areaFilter.value;
  const sortBy = sortFilter.value;

  let filteredMeals = allMeals.filter(meal => {
    const nameMatch = meal.strMeal.toLowerCase().includes(search);
    const categoryMatch = selectedCategory ? meal.strCategory === selectedCategory : true;
    const areaMatch = selectedArea ? meal.strArea === selectedArea : true;

    return nameMatch && categoryMatch && areaMatch;
  });

  
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




function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


searchInput.addEventListener('input', updateMeals);
categoryFilter.addEventListener('change', updateMeals);
areaFilter.addEventListener('change', updateMeals);
sortFilter.addEventListener('change', updateMeals);


fetchMeals();
