class FoodProduct {
    constructor(name, price, image, quantity = 1) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
    }
}

class Cart {
    constructor() {
        this.products = [];
        this.cartButton = document.querySelector('#cartButton');
        this.cartCount = this.cartButton.querySelector('.cart__count');
        this.cartPrice = this.cartButton.querySelector('.cart__price');

        // Обработчик события на кнопке корзины
        const sidebarCartMenu = sidebar.querySelector('.sidebar__menu-cart');

        this.cartButton.addEventListener('click', function () {
            body.classList.toggle('lock')
            sidebar.classList.toggle('sidebar--with-close-btn-show')
            sidebarCartMenu.classList.toggle('sidebar__menu-cart--show');
        });

        // Кнопка закрытия окна корзины
        const closeCartMenuButton = sidebarCartMenu.querySelector('#closeCartButton');

        closeCartMenuButton.addEventListener('click', function () {
            body.classList.toggle('lock')
            sidebar.classList.toggle('sidebar--with-close-btn-show')
            sidebarCartMenu.classList.toggle('sidebar__menu-cart--show');
        })
    }

    // Методы
    addProduct(product) {
        const existingProduct = this.products.find((p) => p.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            this.products.push(product);
        }
    }

    removeProduct(name) {
        for (const product of this.products) {
            if (product.name === name) {
                if (product.quantity > 1) {
                    product.quantity -= 1;
                } else {
                    const index = this.products.indexOf(product);
                    this.products.splice(index, 1);
                }
            }
        }
    }

    getTotalPrice() {
        let total = 0;
        for (const product of this.products) {
            total += product.price * product.quantity;
        }
        return total;
    }

    clearCart() {
        this.products = [];
    }

    updateCartButton() {
        if (this.products.length > 0) {
            if (this.cartCount > 99) this.cartCount.textContent = '99+'
            else this.cartCount.textContent = this.products.length

            this.cartPrice.textContent = this.getTotalPrice() + ' ₸';
        } else {
            this.cartCount.textContent = '0';
            this.cartPrice.textContent = '0 ₸';
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
        const product = new FoodProduct(dishName, dishPrice, dishImage);
        userCart.addProduct(product);
        userCart.updateCartButton();
        console.log(userCart.products);
    });

    // Нажатие на кнопку "Добавить в избранное"
    const addToFavoritesButton = dishCard.querySelector('.product__favorite-btn');
    addToFavoritesButton.addEventListener('click', () => {
        const product = new FoodProduct(dishName, dishPrice, dishImage);
        // userCart.addProduct(product);
        alert(`${product.name} добавлено в избранное!`);
    });
}