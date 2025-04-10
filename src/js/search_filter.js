class Restaurant {
    constructor(id, name, categories, rating, popularity, avarageDeliveryTime, image, href, badge) {
        this.id = id;
        this.name = name;
        this.categories = new Set(categories);
        this.rating = rating;
        this.popularity = popularity;
        this.avarageDeliveryTime = avarageDeliveryTime; // Время в секундах
        this.image = image;
        this.href = href;
        this.badge = { // Тег ресторана
            type: badge.type,
            text: badge.text
        }
    }

    createCard() {
        // Создаем карточку ресторана
        const restaurantCard = document.createElement('div');

        // Свойства карточки ресторана
        restaurantCard.classList.add('our-restaurants__restaurant', 'card', 'h-100');
        restaurantCard.setAttribute('data-restaurant-id', this.id);
        restaurantCard.setAttribute('data-delivery-time', this.avarageDeliveryTime);
        restaurantCard.setAttribute('data-popularity', this.popularity);
        restaurantCard.setAttribute('data-categories', Array.from(this.categories).join("|")); // Массив в строку с разделителем "|"
        restaurantCard.innerHTML = `
            <a href="${this.href}">
                <img src="${this.image}" alt="${this.name} Restaurant" class="card-img-top">
    
                <div class="card-body">
                    <span class="badge ${this.badge.type} mb-1">${this.badge.text}</span>
                    <h5 class="card-title mb-2">${this.name}</h5>
    
                    <div class="our-restaurants__restaurant-info d-flex align-items-center">
                        <span class="me-1 me-xl-2">${this.avarageDeliveryTime / 60}min •</span>
                        <img src="../icons/purple_star.svg" alt="Purple star">
                        <span class="ms-1">${this.rating}</span>
                    </div>
                </div>
            </a>
        `

        return restaurantCard;
    }
}

class Dish {
    constructor(id, name, categories, rating, popularity, price, averageDeliveryTime, restaurantHref, image, badge) {
        this.id = id;
        this.name = name;
        this.categories = new Set(categories);
        this.rating = rating;
        this.popularity = popularity;
        this.price = price;
        this.averageDeliveryTime = averageDeliveryTime; // Время в секундах
        this.restaurantHref = restaurantHref;
        this.image = image;
        this.badge = { // Тег ресторана
            type: badge.type,
            text: badge.text
        }
    }

    createCard() {
        // Создаем карточку ресторана
        const dishCard = document.createElement('div');

        // Свойства карточки ресторана
        dishCard.classList.add('our-dishes__dish', 'card', 'h-100');
        dishCard.setAttribute('data-dish-id', this.id);
        dishCard.setAttribute('data-delivery-time', this.averageDeliveryTime);
        dishCard.setAttribute('data-popularity', this.popularity);
        dishCard.setAttribute('data-categories', Array.from(this.categories).join("|")); // Массив в строку с разделителем "|"
        dishCard.innerHTML = `
            <a href="${this.restaurantHref}">
                
                <img src="${this.image}" alt="${this.name} Dish" class="card-img-top rounded-circle">
    
                <div class="card-body">
                    <span class="badge ${this.badge.type} mb-1">${this.badge.text}</span>
                    <h5 class="card-title mb-1">${this.name}</h5>
    
                    <div class="our-dishes__dish-info d-flex align-items-center mb-2">
                        <span class="me-1 me-xl-2">${this.averageDeliveryTime / 60}min •</span>
                        <img src="../icons/purple_star.svg" alt="Purple star">
                        <span class="ms-1">${this.rating}</span>
                    </div>
                    <h5 class="menu-section__dish-price">₸${this.price}</h5>
                </div>
            </a>
        `

        return dishCard;
    }
}

class FilterManager {
    constructor() {
        this.restaurantsCollection = [];
        this.dishesCollection = [];
        this.displayFilter = 'all' // 'all' | 'restaurants' | 'dishes'
        this.activeCategoriesFilters = new Set();
        this.sortByFilter = 'delivery'; // 'rating' | 'delivery' | 'popularity'
        this.maxPriceFilter = 15000; // 0 - 30000
    }

    toggleCategoryFilter(category) {
        if (this.activeCategoriesFilters.has(category)) {
            this.activeCategoriesFilters.delete(category);
        } else {
            this.activeCategoriesFilters.add(category);
        }
    }

    sortBy() {
        switch (this.sortByFilter) {
            case null:
                break;
            case 'rating':
                this.restaurantsCollection.sort((a, b) => b.rating - a.rating);
                this.dishesCollection.sort((a, b) => b.rating - a.rating);
                break;
            case 'popularity':
                this.restaurantsCollection.sort((a, b) => b.popularity - a.popularity);
                this.dishesCollection.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'delivery':
                this.restaurantsCollection.sort((a, b) => a.avarageDeliveryTime - b.avarageDeliveryTime);
                this.dishesCollection.sort((a, b) => a.averageDeliveryTime - b.averageDeliveryTime);
                break;
        }
    }

    displayFilteredCards(filteredRestaurants, filteredDishes) {
        // Отображаем карточки ресторанов
        // очищаем предыдущие карточки
        restaurantsWrapper.innerHTML = '';

        // Скрываем секцию "Наши рестораны", если нет активных категорий
        if (filteredRestaurants.length === 0 || this.displayFilter === 'dishes') {
            document.querySelector('.our-restaurants').style.display = 'none';
        } else {
            document.querySelector('.our-restaurants').style.display = 'block';

            for (const restaurant of this.restaurantsCollection) {
                // Проверяем, что ресторан относится к активным категориям
                if (filteredRestaurants.some(rest => rest.id === restaurant.id)) {
                    // Создаем карточку ресторана и добавляем ее в контейнер
                    restaurantsWrapper.appendChild(restaurant.createCard());
                }
            }
        }

        // Отображаем карточки блюд
        // очищаем предыдущие карточки
        dishesWrapper.innerHTML = '';

        // Скрываем секцию "Наши блюда", если нет активных категорий
        if (filteredDishes.length === 0 || this.displayFilter === 'restaurants') {
            document.querySelector('.our-dishes').style.display = 'none';
        } else if (this.displayFilter === 'all' || this.displayFilter === 'dishes') {
            document.querySelector('.our-dishes').style.display = 'block';

            for (const dish of this.dishesCollection) {
                // Проверяем, что блюдо относится к активным категориям
                if (filteredDishes.some(d => d.id === dish.id)) {
                    console.log('dish', dish);
                    // Создаем карточку блюда и добавляем ее в контейнер
                    dishesWrapper.appendChild(dish.createCard());
                }
            }
        }
    }

    applyFilters() {
        // Фильтруем рестораны по категориям
        let filteredRestaurants = [];

        for (const restaurant of this.restaurantsCollection) {
            // Фильтруем по категориям
            if (this.activeCategoriesFilters.size === 0 || this.activeCategoriesFilters.intersection(restaurant.categories).size > 0) {
                filteredRestaurants.push(restaurant);
            }
        }

        // Фильтруем блюда по категориям
        let filteredDishes = [];

        for (const dish of this.dishesCollection) {
            // Фильтруем по категориям
            if (this.activeCategoriesFilters.size === 0 || this.activeCategoriesFilters.intersection(dish.categories).size > 0) {
                // Фильтруем по цене
                if (this.maxPriceFilter === null || dish.price <= this.maxPriceFilter) {
                    filteredDishes.push(dish);
                }
            }
        }

        console.log(filteredRestaurants)
        console.log(filteredDishes);

        // Сортировка
        this.sortBy();

        // Обновляем отображение карточек ресторанов и блюд
        this.displayFilteredCards(filteredRestaurants, filteredDishes)
    }
}

// Карточки ресторанов
const restaurants = document.querySelectorAll('.our-restaurants__restaurant.card');
// Контейнер для карточек ресторанов
const restaurantsWrapper = document.querySelector('.our-restaurants__restaurants-wrapper');

// Карточки блюд
const dishes = document.querySelectorAll('.our-dishes__dish.card');
// Контейнер для карточек блюд
const dishesWrapper = document.querySelector('.our-dishes__dishes-wrapper');


// Кнопки фильтров
const displayFiltersButtons = document.querySelectorAll('.food-filter__display-filter');
const categoryButtons = document.querySelectorAll('button.filter-panel__category-item');
const sortByButtons = document.querySelectorAll('input.filter-panel__sort-btn');
const priceRange = document.querySelector('input.filter-panel__price-slider');
const applyButton = document.querySelector('#applyFiltersButton');

const filterManager = new FilterManager();

for (const restaurant of restaurants) {
    const restaurantId = restaurant.getAttribute('data-restaurant-id');
    const restaurantName = restaurant.querySelector('h5.card-title').textContent;
    const restaurantCategories = restaurant.getAttribute('data-categories').split('|'); // Получаем атрибут data-categories и разбиваем его на массив
    const restaurantRating = parseFloat(restaurant.querySelector('.restaurant__rating').textContent);
    const restaurantPopularity = parseInt(restaurant.getAttribute('data-popularity'));
    const restaurantAvarageDeliveryTime = parseInt(restaurant.getAttribute('data-delivery-time'));
    const restaurantImage = restaurant.querySelector('img.card-img-top').getAttribute('src');
    const restaurantHref = restaurant.querySelector('a').getAttribute('href');
    const restaurantBadgeSpan = restaurant.querySelector('span.badge');
    const restaurantBadge = {
        type: restaurantBadgeSpan.classList[1],
        text: restaurantBadgeSpan.textContent
    };

    filterManager.restaurantsCollection.push(new Restaurant(restaurantId, restaurantName, restaurantCategories, restaurantRating, restaurantPopularity, restaurantAvarageDeliveryTime, restaurantImage, restaurantHref, restaurantBadge));
}

for (const dish of dishes) {
    const dishId = dish.getAttribute('data-dish-id');
    const dishName = dish.querySelector('h5.card-title').textContent;
    const dishCategories = dish.getAttribute('data-categories').split('|'); // Получаем атрибут data-categories и разбиваем его на массив
    const dishRating = parseFloat(dish.querySelector('.dish__rating').textContent);
    const dishPopularity = parseInt(dish.getAttribute('data-popularity'));
    const dishAvarageDeliveryTime = parseInt(dish.getAttribute('data-delivery-time'));
    const dishPrice = parseFloat(dish.querySelector('h5.menu-section__dish-price').textContent.slice(1)); // Удаляем знак тенге в начале строки
    const dishImage = dish.querySelector('img.card-img-top').getAttribute('src');
    const dishRestaurantHref = dish.querySelector('a').getAttribute('href');
    const restaurantBadgeSpan = dish.querySelector('span.badge');
    const restaurantBadge = {
        type: restaurantBadgeSpan.classList[1],
        text: restaurantBadgeSpan.textContent
    };

    filterManager.dishesCollection.push(new Dish(dishId, dishName, dishCategories, dishRating, dishPopularity, dishPrice, dishAvarageDeliveryTime, dishRestaurantHref, dishImage, restaurantBadge));
}


// Обработчик событий для кнопок фильтров.
// Кнопки отображения ресторанов и блюд
for (const displayFilter of displayFiltersButtons) {
    displayFilter.addEventListener('click', () => {
        filterManager.displayFilter = displayFilter.getAttribute('data-filter');
        filterManager.applyFilters();
    })
}

// Кнопки категорий
for (const categoryButton of categoryButtons) {
    categoryButton.addEventListener('click', () => {
        const category = categoryButton.getAttribute('data-category');
        filterManager.toggleCategoryFilter(category);
        filterManager.applyFilters();
    });
}

// Кнопки сортировки по
for (const sortByButton of sortByButtons) {
    sortByButton.addEventListener('click', () => {
        filterManager.sortByFilter = sortByButton.getAttribute('data-sort');
        filterManager.applyFilters();
    });
}

// Ползунок максимальной цены
priceRange.addEventListener('change', () => {
    filterManager.maxPriceFilter = parseInt(priceRange.value);
    filterManager.applyFilters();
})

// Кнопка "Применить фильтры", на случай если не все фильтры применяются автоматически
applyButton.addEventListener('click', () => {
    filterManager.applyFilters();
});