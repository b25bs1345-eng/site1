/* ==========================================================
   UDITA HOMESTAY
   script.js
   Part 1
========================================================== */

"use strict";

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const header = document.getElementById("header");

const navigationLinks = document.querySelectorAll('nav a');

const animatedElements = document.querySelectorAll(".fade");

/* ==========================================================
   STICKY HEADER
========================================================== */

function updateHeader() {

    if (!header) return;

    if (window.scrollY > 80) {

        header.style.padding = "12px 8%";
        header.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)";
        header.style.background = "rgba(255,255,255,.95)";

    } else {

        header.style.padding = "18px 8%";
        header.style.boxShadow = "none";
        header.style.background = "rgba(255,255,255,.75)";

    }

}

window.addEventListener("scroll", updateHeader);

updateHeader();

/* ==========================================================
   SCROLL REVEAL
========================================================== */

const revealObserver = new IntersectionObserver(

    function (entries, observer) {

        entries.forEach(function (entry) {

            if (!entry.isIntersecting) {

                return;

            }

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

        });

    },

    {

        threshold: 0.15

    }

);

animatedElements.forEach(function (element) {

    revealObserver.observe(element);

});

/* ==========================================================
   SMOOTH SCROLL
========================================================== */

navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (!targetId.startsWith("#")) {

            return;

        }

        const targetSection = document.querySelector(targetId);

        if (!targetSection) {

            return;

        }

        event.preventDefault();

        targetSection.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    });

});

/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

const sections = document.querySelectorAll("section");

function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(function (section) {

        const top = section.offsetTop - 120;

        const height = section.offsetHeight;

        if (

            window.scrollY >= top &&
            window.scrollY < top + height

        ) {

            currentSection = section.id;

        }

    });

    navigationLinks.forEach(function (link) {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === "#" + currentSection) {

            link.classList.add("active");

        }

    });

}

window.addEventListener("scroll", updateActiveNavigation);

updateActiveNavigation();

/* ==========================================================
   BOOKING FORM VALIDATION
========================================================== */

const bookingForm = document.querySelector(".booking form");

if (bookingForm) {

    bookingForm.addEventListener("submit", function (event) {

        const checkIn = document.getElementById("checkin");

        const checkOut = document.getElementById("checkout");

        if (!checkIn.value || !checkOut.value) {

            event.preventDefault();

            alert("Please select both Check-In and Check-Out dates.");

            return;

        }

        const checkInDate = new Date(checkIn.value);

        const checkOutDate = new Date(checkOut.value);

        if (checkOutDate <= checkInDate) {

            event.preventDefault();

            alert("Check-Out date must be after Check-In date.");

            return;

        }

    });

}

/* ==========================================================
   CURRENT YEAR - FIXED
========================================================== */

const yearElement = document.getElementById("current-year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}

/* ==========================================================
   UDITA HOMESTAY
   script.js
   Part 2
========================================================== */

/* ==========================================================
   IMAGE LAZY LOADING
========================================================== */

const images = document.querySelectorAll("img");

images.forEach(function (image) {

    image.setAttribute("loading", "lazy");

});

/* ==========================================================
   PREVENT PAST DATE SELECTION
========================================================== */

const checkInInput = document.getElementById("checkin");
const checkOutInput = document.getElementById("checkout");

if (checkInInput) {

    const today = new Date().toISOString().split("T")[0];

    checkInInput.min = today;

    checkInInput.addEventListener("change", function () {

        checkOutInput.min = this.value;

        if (checkOutInput.value < this.value) {

            checkOutInput.value = "";

        }

    });

}

/* ==========================================================
   BUTTON RIPPLE EFFECT
========================================================== */

const buttons = document.querySelectorAll(".btn, button");

buttons.forEach(function (button) {

    button.addEventListener("mouseenter", function () {

        button.style.transition = ".3s ease";

    });

});

/* ==========================================================
   SIMPLE PARALLAX HERO
========================================================== */

const hero = document.querySelector(".hero");

window.addEventListener("scroll", function () {

    if (!hero) return;

    const offset = window.pageYOffset;

    hero.style.backgroundPosition = "center " + (offset * 0.35) + "px";

});

/* ==========================================================
   ROOM CARD HOVER ENHANCEMENT
========================================================== */

const rooms = document.querySelectorAll(".room");

rooms.forEach(function (room) {

    room.addEventListener("mouseenter", function () {

        room.style.transition = ".35s ease";

    });

});

/* ==========================================================
   GALLERY HOVER ENHANCEMENT
========================================================== */

const galleryImages = document.querySelectorAll(".gallery img");

galleryImages.forEach(function (image) {

    image.addEventListener("click", function () {

        window.open(image.src, "_blank");

    });

});

/* ==========================================================
   EXTERNAL LINKS
========================================================== */

const externalLinks = document.querySelectorAll(
    'a[target="_blank"]'
);

externalLinks.forEach(function (link) {

    link.setAttribute(
        "rel",
        "noopener noreferrer"
    );

});

/* ==========================================================
   SCROLL TO TOP ON PAGE REFRESH
========================================================== */

window.addEventListener("beforeunload", function () {

    window.scrollTo(0, 0);

});

/* ==========================================================
   CONSOLE MESSAGE
========================================================== */

console.log(
    "%cUdita Homestay Website Loaded Successfully",
    "color:#3E5A49;font-size:14px;font-weight:bold;"
);
