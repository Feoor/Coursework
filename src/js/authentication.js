// Вход через социальные сети
const googleButton = document.getElementById("googleAuthButton");
const appleButton = document.getElementById("appleAuthButton");

if (googleButton) {
    googleButton.addEventListener("click", function () {
        alert("Вход через Google");
    });
}
if (appleButton) {
    appleButton.addEventListener("click", function () {
        alert("Вход через Apple");
    });
}

// Для страницы входа
const signInForm = document.getElementById("signInForm");

if (signInForm) {
    const emailInput = document.getElementById("signInEmailInput");
    const passwordInput = document.getElementById("signInPasswordInput");

    signInForm.addEventListener("submit", function (event) {
        event.preventDefault();

        alert("Вы успешно вошли в систему");

        console.log("Форма входа отправлена", {
            email: emailInput.value,
            password: passwordInput.value
        });

        // Очистка полей
        emailInput.value = "";
        passwordInput.value = "";
    })
}

// Для страницы регистрации
const signUpForm = document.getElementById("signUpForm");

if (signUpForm) {
    const nameInput = document.getElementById("signUpNameInput");
    const emailInput = document.getElementById("signUpEmailInput");
    const passwordInput = document.getElementById("signUpPasswordInput");

    function validateName(name) {
        // Проверяем, что имя не пустое
        if (!name.trim()) {
            return { valid: false, message: "Введите имя и фамилию" };
        }

        // Проверяем минимальную длину имени
        if (name.trim().length < 3) {
            return { valid: false, message: "Имя и фамилия должны содержать не менее 3 символов" }
        }

        // Проверяем, что имя не содержит цифр
        const nameRegex = /^[а-яА-Яa-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            return { valid: false, message: "Имя и фамилия могут содержать только буквы" }
        }

        // Проверяем наличие как минимум двух слов(Имя и Фамилия)
        const words = name.trim().split(/\s+/);
        if (words.length < 2) {
            return { valid: false, message: "Введите и имя и фамилию" }
        }

        // Проверка пройдена
        return { valid: true, message: "" };
    }

    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameValidation = validateName(nameInput.value);

        if (!nameValidation.valid) {
            nameInput.setCustomValidity(nameValidation.message);
            nameInput.reportValidity();
            return;
        } else {
            nameInput.setCustomValidity("");
        }

        alert("Вы успешно зарегистрировались");

        console.log("Форма регистрации отправлена", {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        });

        // Очистка полей
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
    })
}

// Для страницы восстановления пароля
const forgetPasswordForm = document.getElementById("forgetPasswordForm");

if (forgetPasswordForm) {
    const emailInput = document.getElementById("forgetPasswordEmailInput");

    forgetPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        alert(`Ссылка для сброса пароля была отправлена на ${emailInput.value}`);
        emailInput.value = "";
    })
}