const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

// Toggle Menu
menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    menuToggle.classList.toggle("active");

    const expanded =
        menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", !expanded);

});

// Close menu after clicking any menu item
navItems.forEach(item => {

    item.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

    });

});
