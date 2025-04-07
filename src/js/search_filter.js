class Restaurant {
    constructor(id, name, categories, rating, popularity, avarageDeliveryTime) {
        this.id = id;
        this.name = name;
        this.categories = new Set(categories);
        this.rating = rating;
        this.popularity = popularity;
        this.avarageDeliveryTime = avarageDeliveryTime; // Время в секундах
    }

    // matchesCategories(categories) {
    //     return this.categories.includes(categories);
    // }
}

class Dish {
    constructor(id, name, categories, rating, popularity, price, averageDeliveryTime) {
        this.id = id;
        this.name = name;
        this.categories = new Set(categories);
        this.rating = rating;
        this.popularity = popularity;
        this.price = price;
        this.averageDeliveryTime = averageDeliveryTime; // Время в секундах
    }

    // matchesCategories(categories) {
    //     return this.categories.includes(categories);
    // }
}

class FilterManager {
    constructor() {
        this.restaurantsCollection = [];
        this.dishesCollection = [];
        this.activeCategoriesFilters = new Set();
    }

    toggleCategoryFilter(category) {
        if (this.activeCategoriesFilters.has(category)) {
            this.activeCategoriesFilters.delete(category);
        } else {
            this.activeCategoriesFilters.add(category);
        }
    }

    applyFilters() {
        // Фильтруем рестораны по категориям
        const filteredRestaurants = [];

        for (const restaurant of this.restaurantsCollection) {
            if (this.activeCategoriesFilters.size === 0 || this.activeCategoriesFilters.intersection(restaurant.categories).size > 0) {
                filteredRestaurants.push(restaurant);
            }
        }

        // Фильтруем блюда по категориям
        const filteredDishes = [];

        for (const dish of this.dishesCollection) {
            if (this.activeCategoriesFilters.size === 0 || this.activeCategoriesFilters.intersection(dish.categories).size > 0) {
                filteredDishes.push(dish);
            }
        }

        // ...

        // Обновляем отображение карточек ресторанов и блюд
        for (const restaurant of restaurants) {
            const restaurantId = restaurant.getAttribute('data-restaurant-id');

            if (filteredRestaurants.some((r) => r.id === restaurantId)) {
                restaurant.style.display = 'flex';
            } else {
                restaurant.style.display = 'none';
            }
        }
    }
}

// Карточки ресторанов
const restaurants = document.querySelectorAll('.our-restaurants__restaurant.card');

// Карточки блюд
const dishes = document.querySelectorAll('.our-dishes__dish.card');

// Кнопки фильтров
const categoryButtons = document.querySelectorAll('button.filter-panel__category-item');
const sortByButtons = document.querySelectorAll('input.filter-panel__sort-btn');
const priceRange = document.querySelector('input.filter-panel__price-slider');
const applyButton = document.querySelector('#applyFiltersButton');

const filterManager = new FilterManager();

for (const restaurant of restaurants) {
    const restaurantId = restaurant.getAttribute('data-restaurant-id');
    const restaurantName = restaurant.querySelector('h5.card-title').textContent;
    const restaurantCategories = restaurant.getAttribute('data-categories').split('|'); // Получаем атрибут data-categories и разбиваем его на массив
    // const restaurantRating = parseFloat(restaurant.querySelector('.card__rating').textContent);
    // const restaurantPopularity = parseInt(restaurant.querySelector('.card__popularity').textContent);
    // const restaurantAvarageDeliveryTime = parseInt(restaurant.querySelector('.card__delivery-time').textContent);

    filterManager.restaurantsCollection.push(new Restaurant(restaurantId, restaurantName, restaurantCategories, 4.8, 2, 1440));
}

for (const dish of dishes) {
    const dishId = dish.getAttribute('data-restaurant-id');
    const dishName = dish.querySelector('h5.card-title').textContent;
    const dishCategories = dish.getAttribute('data-categories').split('|'); // Получаем атрибут data-categories и разбиваем его на массив
    // const dishRating = parseFloat(dish.querySelector('.card__rating').textContent);
    // const dishPopularity = parseInt(dish.querySelector('.card__popularity').textContent);
    // const dishPrice = parseInt(dish.querySelector('.card__price').textContent);

    filterManager.dishesCollection.push(new Dish(dishId, dishName, dishCategories, 4.8, 2, 1799, 1440));
}


// Обработчик событий для кнопок фильтров
// Кнопки категорий
for (const categoryButton of categoryButtons) {
    categoryButton.addEventListener('click', () => {
        const category = categoryButton.getAttribute('data-category');
        filterManager.toggleCategoryFilter(category);
        filterManager.applyFilters(); // TODO: Можно добавить автоматическую фильтрацию при нажатии на кнопку, а можно убрать будет
    });
}