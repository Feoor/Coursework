body = document.body;

// Открываем меню при нажатии на кнопку
const headerButton = document.getElementById('headerMenuButton');
const sidebar = document.getElementById('sidebar');

headerButton.addEventListener('click', () => {
    body.classList.toggle('lock')
    headerButton.classList.toggle('header__menu--toggle');
    sidebar.classList.toggle('sidebar--show')
});


// FAQ кнопки
const faqBlocks = document.querySelectorAll(".faq__question")

for (const faqBlock of faqBlocks) {
    // FAQ Блок -> div.faq__question-header -> button
    const faqBlockButton = faqBlock.children[0].children[0];
    console.dir(faqBlockButton);

    faqBlockButton.addEventListener("click", () => {
        faqBlock.classList.toggle("faq__question--active");
    });
}