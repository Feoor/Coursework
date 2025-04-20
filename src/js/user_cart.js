class Dish {
    constructor(name, price, image, quantity = 1) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
    }

    getTotalPrice() {
        return this.price * this.quantity;
    }
}

class Restaurant {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.dishes = [];
    }

    // Методы
    addDish(product) {
        const existingProduct = this.dishes.find((p) => p.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            this.dishes.push(product);
        }
    }

    removeDish(name) {
        const existingProduct = this.dishes.find((p) => p.name === name);

        if (existingProduct) {
            if (existingProduct.quantity > 1) {
                existingProduct.quantity -= 1;
            } else {
                const index = this.dishes.indexOf(existingProduct);
                this.dishes.splice(index, 1);
            }
        }
    }
}

class Cart {
    constructor() {
        // Получаем корзину из localStorage
        const rawCart = JSON.parse(localStorage.getItem('cart'));
        console.log(rawCart)

        // Инициализируем массив блюд
        this.cart = [];
        if (rawCart) {
            // Загружаем из localStorage
            for (const rawRestaurant of rawCart) {
                const restaurant = new Restaurant(rawRestaurant.id, rawRestaurant.name);

                for (const dish of rawRestaurant.dishes) {
                    restaurant.dishes.push(new Dish(dish.name, dish.price, dish.image, dish.quantity));
                }

                this.cart.push(restaurant);
            }
        }

        this.cartButtons = document.querySelectorAll('.cart-btn');
        this.cartMenuContent = document.querySelector('#cartMenuContent');
        this.sidebarCartButtonsWrapper = document.querySelector('#sidebarCartButtons');

        // Обработчик события на кнопке корзины
        const sidebarCartMenu = sidebar.querySelector('.sidebar__menu-cart');

        for (const cartButton of this.cartButtons) {
            cartButton.addEventListener('click', function () {
                body.classList.toggle('lock')
                sidebar.classList.toggle('sidebar--with-close-btn-show')
                sidebarCartMenu.classList.toggle('sidebar__menu-cart--show');
            });
        }


        // Кнопка закрытия окна корзины
        const closeCartMenuButton = sidebarCartMenu.querySelector('#closeCartButton');

        closeCartMenuButton.addEventListener('click', function () {
            body.classList.toggle('lock')
            sidebar.classList.toggle('sidebar--with-close-btn-show')
            sidebarCartMenu.classList.toggle('sidebar__menu-cart--show');
        })

        // Обновляем корзину
        this.updateCartButtons();
        this.updateCartMenu();
    }

    // Методы
    addDish(product, restId = restaurantId, restName = restaurantName) {
        const existingRestaurant = this.cart.find((rest) => rest.id === restId);
        if (existingRestaurant) {
            existingRestaurant.addDish(product);
        } else {
            const restaurant = new Restaurant(restId, restName);
            restaurant.addDish(product);
            this.cart.push(restaurant);
        }

        // Сохраняем в localStorage
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    removeDish(name, restId = restaurantId) {
        const existingRestaurant = this.cart.find((rest) => rest.id === restId);
        if (existingRestaurant) {
            existingRestaurant.removeDish(name);

            // Удаление ресторана из корзины, если блюд нет
            if (existingRestaurant.dishes.length === 0) {
                const index = this.cart.indexOf(existingRestaurant);
                this.cart.splice(index, 1);
            }
        } else {
            console.error('Ресторан не найден в корзине');
            return;
        }

        // Сохраняем в localStorage
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    getTotalPrice() {
        let total = 0;
        for (const restaurant of this.cart) {
            for (const product of restaurant.dishes) {
                total += product.getTotalPrice();
            }
        }
        return total;
    }

    getTotalCount() {
        let total = 0;
        for (const restaurant of this.cart) {
            for (const product of restaurant.dishes) {
                total += product.quantity;
            }
        }
        return total;
    }

    clearCart() {
        this.cart = [];
    }

    updateCartButtons() {
        for (const cartButton of this.cartButtons) {
            const cartCount = cartButton.querySelector('.cart__count');
            const cartPrice = cartButton.querySelector('.cart__price');

            if (this.cart.length > 0) {
                if (this.getTotalCount() > 99) cartCount.textContent = '99+'
                else cartCount.textContent = `${this.getTotalCount()}`;

                cartPrice.textContent = this.getTotalPrice() + ' ₸';
            } else {
                cartCount.textContent = '0';
                cartPrice.textContent = '0 ₸';
            }
        }
    }

    updateCartMenu() {
        this.cartMenuContent.innerHTML = `
            <h3 class="menu-cart__title mb-3">${this.cart.length > 0 ? "Ваш заказ" : "Корзина пуста"}</h3>
            <div class="menu-cart__dishes-wrapper"></div>
        `; // очищаем содержимое корзины
        this.sidebarCartButtonsWrapper.innerHTML = ``;

        // Обертка для блюд
        const dishesWrapper = this.cartMenuContent.querySelector('.menu-cart__dishes-wrapper');

        if (this.cart.length > 0) {
            // Перейти к оплате
            const cartCheckoutButton = document.createElement('a');

            // Свойства кнопки "Перейти к оплате"
            cartCheckoutButton.classList.add('sidebar__checkout-btn', 'w-100', 'd-flex', 'align-items-center');
            cartCheckoutButton.href = '#';
            cartCheckoutButton.innerHTML = `
              <span class="cart__count me-3 badge rounded-pill bg-danger">${this.getTotalCount()}</span>
              Перейти к оплате
              <span class="cart__price ms-auto">${this.getTotalPrice()} ₸</span>
            `
            this.sidebarCartButtonsWrapper.appendChild(cartCheckoutButton);

            // Перебор
            for (const restaurant of this.cart) {
                // Разделитель между ресторанами
                const separator = document.createElement('div');
                separator.classList.add('menu-cart__separator');
                dishesWrapper.appendChild(separator);

                // Название ресторана
                const restaurantElement = document.createElement('h4');
                restaurantElement.classList.add('menu-cart__restaurant-name', 'my-3');
                restaurantElement.textContent = restaurant.name;
                dishesWrapper.appendChild(restaurantElement);

                // Карточки блюд с корзины
                for (const product of restaurant.dishes) {
                    const productElement = document.createElement('div');
                    productElement.classList.add('menu-cart__dish', 'd-flex', 'justify-content-between', 'align-items-center');

                    productElement.innerHTML = `
                    <!-- Краткая информация об блюде -->
                    <div class="cart-dish__info d-flex align-items-center">
                      <img src="${product.image}" alt="${product.name} Dish" class="cart-dish__image">
                      <div class="cart-dish__details">
                        <h5 class="cart-dish__name">${product.name}</h5>
                        <span class="cart-dish__price">${product.price} ₸</span>
                      </div>
                    </div>
    
                    <!-- Кнопки управления количеством -->
                    <div class="cart-dish__controls d-flex flex-column align-items-center">
                      <div class="cart-dish__qty d-flex align-items-center">
                        <button class="cart-dish__minus-btn"></button>
                        <span class="cart-dish__count">${product.quantity}</span>
                        <button class="cart-dish__plus-btn"></button>
                      </div>
                      <div class="cart-dish__total-price">
                        <span class="cart-dish__total">${product.getTotalPrice()} ₸</span>
                      </div>
                    </div>
                `;

                    const minusButton = productElement.querySelector('.cart-dish__minus-btn');
                    const plusButton = productElement.querySelector('.cart-dish__plus-btn');

                    // Увеличение количества блюда
                    plusButton.addEventListener('click', () => {
                        this.addDish(product, restaurant.id, restaurant.name);
                        this.updateCartButtons();
                        this.updateCartMenu();
                    });

                    // Уменьшение количества блюда
                    minusButton.addEventListener('click', () => {
                        this.removeDish(product.name, restaurant.id);
                        this.updateCartButtons();
                        this.updateCartMenu();
                    });

                    dishesWrapper.appendChild(productElement);
                }
            }
        }
    }
}
// Получаем данные ресторана
const restaurantId = document.querySelector('section.restaurant-hero').getAttribute('data-restaurant-id');
const restaurantName = document.querySelector('.card-title').textContent;

// Инициализация корзины
const userCart = new Cart();
const dishesCards = document.querySelectorAll('.menu-section__dish');

// Добавление обработчиков событий на карточки блюд
for (const dishCard of dishesCards) {
    const dishName = dishCard.querySelector('.product__name').textContent;
    // parseFloat(), для будущего расширения компании где есть другие валюты с десятой точкой
    const dishPrice = parseFloat(dishCard.querySelector('.product__price').textContent.replace('₸', '').trim());
    const dishImage = dishCard.querySelector('.product__image').src;

    // Нажатие на кнопку "Добавить в корзину"
    const addToCartButton = dishCard.querySelector('.product__cart-btn');
    addToCartButton.addEventListener('click', () => {
        const product = new Dish(dishName, dishPrice, dishImage);
        userCart.addDish(product);
        userCart.updateCartButtons();
        userCart.updateCartMenu();
    });

    // Нажатие на кнопку "Добавить в избранное"
    const addToFavoritesButton = dishCard.querySelector('.product__favorite-btn');
    addToFavoritesButton.addEventListener('click', () => {
        const product = new Dish(dishName, dishPrice, dishImage);
        // userCart.addDish(product);
        alert(`${product.name} добавлено в избранное!`);
    });
}