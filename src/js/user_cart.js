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

class Cart {
    constructor() {
        this.dishes = [];
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
        for (const product of this.dishes) {
            if (product.name === name) {
                if (product.quantity > 1) {
                    product.quantity -= 1;
                } else {
                    const index = this.dishes.indexOf(product);
                    this.dishes.splice(index, 1);
                }
            }
        }
    }

    getTotalPrice() {
        let total = 0;
        for (const product of this.dishes) {
            total += product.price * product.quantity;
        }
        return total;
    }

    getTotalCount() {
        let total = 0;
        for (const product of this.dishes) {
            total += product.quantity;
        }
        return total;
    }

    clearCart() {
        this.dishes = [];
    }

    updateCartButtons() {
        for (const cartButton of this.cartButtons) {
            const cartCount = cartButton.querySelector('.cart__count');
            const cartPrice = cartButton.querySelector('.cart__price');

            if (this.dishes.length > 0) {
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
            <h3 class="menu-cart__title mb-3">${this.dishes.length > 0 ? "Ваш заказ" : "Корзина пуста"}</h3>
            <div class="menu-cart__dishes-wrapper"></div>
        `; // очищаем содержимое корзины
        this.sidebarCartButtonsWrapper.innerHTML = ``;

        // Обертка для блюд
        const dishesWrapper = this.cartMenuContent.querySelector('.menu-cart__dishes-wrapper');

        if (this.dishes.length > 0) {
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

            // Карточки блюд с корзины
            for (const product of this.dishes) {
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
                    product.quantity += 1;
                    this.updateCartButtons();
                    this.updateCartMenu();
                });

                // Уменьшение количества блюда
                minusButton.addEventListener('click', () => {
                    this.removeDish(product.name);
                    this.updateCartButtons();
                    this.updateCartMenu();
                });

                dishesWrapper.appendChild(productElement);
            }
        }
    }
}

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
        console.log(product)
    });

    // Нажатие на кнопку "Добавить в избранное"
    const addToFavoritesButton = dishCard.querySelector('.product__favorite-btn');
    addToFavoritesButton.addEventListener('click', () => {
        const product = new Dish(dishName, dishPrice, dishImage);
        // userCart.addDish(product);
        alert(`${product.name} добавлено в избранное!`);
    });
}