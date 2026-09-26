/* ==========================================================
   UDITA HOMESTAY
   script.js
========================================================== */

"use strict";

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const header = document.getElementById("header");
const navigationLinks = document.querySelectorAll("nav a");
const animatedElements = document.querySelectorAll(".fade");
const sections = document.querySelectorAll("section");
const backToTopBtn = document.getElementById("backToTop");
const hero = document.querySelector(".hero");

/* ==========================================================
   BLOGS NAVIGATION
   Adds one unobtrusive menu item without changing the
   existing social buttons or page layout.
========================================================== */

(function addBlogsNavigation() {
    if (!header) return;

    const nav = header.querySelector(".social-nav");
    if (!nav || nav.querySelector(".blogs-nav-link")) return;

    const link = document.createElement("a");
    link.className = "blogs-nav-link";
    link.href = "blogs.html";
    link.innerHTML = '<i class="fas fa-book-open" aria-hidden="true"></i><span>Blogs</span>';
    link.setAttribute("aria-label", "Read the Udita Homestay blog");

    const style = document.createElement("style");
    style.textContent = `
        .social-nav .blogs-nav-link {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            min-height:46px;
            padding:0 18px;
            border:1px solid rgba(140,90,60,.22);
            border-radius:24px;
            background:rgba(255,255,255,.92);
            color:#3E5A49;
            font-family:'Poppins',sans-serif;
            font-size:14px;
            font-weight:600;
            letter-spacing:.01em;
            box-shadow:0 4px 15px rgba(0,0,0,.06);
            transition:transform .3s ease, box-shadow .3s ease, background .3s ease, color .3s ease;
        }
        .social-nav .blogs-nav-link:hover {
            transform:translateY(-3px);
            background:#8C5A3C;
            color:#fff;
            box-shadow:0 8px 24px rgba(0,0,0,.14);
        }
        @media(max-width:600px){
            .social-nav { gap:10px; flex-wrap:wrap; }
            .social-nav .blogs-nav-link { min-height:42px; padding:0 14px; font-size:13px; }
            .social-nav .social-btn { width:44px; height:44px; font-size:18px; }
        }
    `;

    document.head.appendChild(style);
    nav.insertBefore(link, nav.firstChild);
})();

/* ==========================================================
   STICKY HEADER + ACTIVE NAVIGATION + BACK TO TOP
========================================================== */

function updateScrollUI() {
    const scrollY = window.scrollY;

    if (header) {
        const scrolled = scrollY > 80;
        header.style.padding = scrolled ? "12px 8%" : "18px 8%";
        header.style.boxShadow = scrolled ? "0 8px 24px rgba(0,0,0,.12)" : "none";
        header.style.background = scrolled
            ? "rgba(255,255,255,.95)"
            : "rgba(255,255,255,.75)";
    }

    if (backToTopBtn) {
        backToTopBtn.hidden = scrollY <= 300;
    }

    if (hero) {
        hero.style.backgroundPosition = `center ${scrollY * 0.35}px`;
    }

    let currentSection = "";
    sections.forEach(function (section) {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach(function (link) {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
}

let scrollTicking = false;
window.addEventListener("scroll", function () {
    if (scrollTicking) return;

    scrollTicking = true;
    requestAnimationFrame(function () {
        updateScrollUI();
        scrollTicking = false;
    });
}, { passive: true });

updateScrollUI();

/* ==========================================================
   SCROLL REVEAL
========================================================== */

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(function (element) {
        revealObserver.observe(element);
    });
} else {
    animatedElements.forEach(function (element) {
        element.classList.add("show");
    });
}

/* ==========================================================
   SMOOTH SCROLL
========================================================== */

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) return;

        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        event.preventDefault();
        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ==========================================================
   BOOKING ENGINE
========================================================== */

(function () {
    const BOOKING_URL = "https://uditahomestay.keyio.ai";

    window.KeyIOBooking = {
        url: BOOKING_URL,
        book: function (params) {
            if (!params || !params.checkIn || !params.checkOut) {
                console.error("[KeyIOBooking] checkIn and checkOut are required.");
                return;
            }

            const query = new URLSearchParams({
                checkIn: params.checkIn,
                checkOut: params.checkOut,
                adults: String(parseInt(params.adults, 10) || 1),
                children: String(parseInt(params.children, 10) || 0),
                infants: String(parseInt(params.infants, 10) || 0)
            });

            window.location.href = `${BOOKING_URL}?${query.toString()}`;
        }
    };
})();

/* ==========================================================
   IMAGE LAZY LOADING
========================================================== */

document.querySelectorAll("img").forEach(function (image) {
    image.loading = image.classList.contains("hero-fallback") ? "eager" : "lazy";
});

/* ==========================================================
   BOOKING DATE CONSTRAINTS
========================================================== */

const checkInInput = document.getElementById("checkin");
const checkOutInput = document.getElementById("checkout");

function formatISODate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

if (checkInInput && checkOutInput) {
    const todayISO = formatISODate(new Date());
    checkInInput.min = todayISO;

    if (!checkInInput.value) {
        checkInInput.value = todayISO;
    }

    function updateCheckoutConstraints() {
        if (!checkInInput.value) return;

        const checkInDate = new Date(`${checkInInput.value}T00:00:00`);
        const minCheckout = addDays(checkInDate, 1);
        const maxCheckout = addDays(checkInDate, 30);

        checkOutInput.min = formatISODate(minCheckout);
        checkOutInput.max = formatISODate(maxCheckout);

        if (!checkOutInput.value) {
            checkOutInput.value = formatISODate(minCheckout);
            return;
        }

        if (checkOutInput.value < checkOutInput.min) {
            checkOutInput.value = checkOutInput.min;
        } else if (checkOutInput.value > checkOutInput.max) {
            checkOutInput.value = checkOutInput.max;
        }
    }

    updateCheckoutConstraints();

    checkInInput.addEventListener("change", function () {
        if (this.value < this.min) {
            this.value = this.min;
        }
        updateCheckoutConstraints();
    });

    checkOutInput.addEventListener("change", updateCheckoutConstraints);
}

/* ==========================================================
   BUTTON / ROOM HOVER ENHANCEMENTS
========================================================== */

document.querySelectorAll(".btn, button, .room").forEach(function (element) {
    element.addEventListener("mouseenter", function () {
        element.style.transition = ".3s ease";
    });
});

/* ==========================================================
   GALLERY
========================================================== */

document.querySelectorAll(".gallery img").forEach(function (image) {
    image.addEventListener("click", function () {
        window.open(image.src, "_blank", "noopener,noreferrer");
    });
});

/* ==========================================================
   EXTERNAL LINKS
========================================================== */

document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    link.rel = "noopener noreferrer";
});

/* ==========================================================
   CURRENT YEAR
========================================================== */

const yearElement = document.getElementById("current-year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* ==========================================================
   CONSOLE MESSAGE
========================================================== */

console.log(
    "%cUdita Homestay Website Loaded Successfully",
    "color:#3E5A49;font-size:14px;font-weight:bold;"
);
