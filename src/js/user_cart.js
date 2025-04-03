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
    }

    addProduct(product) {
        const existingProduct = this.products.find(p => p.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            this.products.push(product);
        }
    }

    removeProduct(name) {
        // TODO: Сделать удаление по количеству, есть больше 1
        this.products = this.products.filter(product => product.name !== name);
    }

    getTotalPrice() {
        return this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
    }

    clearCart() {
        this.products = [];
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
        alert(`${product.name} добавлено в корзину!`);
        console.log(userCart);
    });

    // Нажатие на кнопку "Добавить в избранное"
    const addToFavoritesButton = dishCard.querySelector('.product__favorite-btn');
    addToFavoritesButton.addEventListener('click', () => {
        const product = new FoodProduct(dishName, dishPrice, dishImage);
        // userCart.addProduct(product);
        alert(`${product.name} добавлено в избранное!`);
    });
}