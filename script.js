/* ==========================================================
   UDITA HOMESTAY
   script.js
   Safe, incremental update: wrap DOM logic in DOMContentLoaded and ensure .fade elements become visible immediately as a fallback.
========================================================== */

"use strict";

document.addEventListener('DOMContentLoaded', function () {

    /* ==========================================================
       DOM ELEMENTS
    ========================================================== */

    const header = document.getElementById("header");
    const navigationLinks = document.querySelectorAll('nav a');
    const animatedElements = document.querySelectorAll(".fade");

    // Ensure fade elements are visible immediately as a safety fallback
    animatedElements.forEach(function (el) {
        el.classList.add('show');
    });

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
       SCROLL REVEAL (non-blocking)
    ========================================================== */

    try {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.15 }
        );

        animatedElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } catch (e) {
        // IntersectionObserver not available or failed — elements already shown by fallback above
        console.warn('Scroll reveal unavailable:', e);
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
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSection = section.id;
            }
        });

        navigationLinks.forEach(function (link) {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === "#" + currentSection) link.classList.add("active");
        });
    }

    window.addEventListener("scroll", updateActiveNavigation);
    updateActiveNavigation();

    /* ==========================================================
       BOOKING FORM - WHATSAPP INTEGRATION
    ========================================================== */

    const bookingForm = document.querySelector(".booking form");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const checkIn = document.getElementById("checkin");
            const checkOut = document.getElementById("checkout");
            const roomCount = document.getElementById("room-count");
            const adults = document.getElementById("adults");
            const children = document.getElementById("children");

            // Get today's date
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Validation 1: Check if both dates are selected
            if (!checkIn.value || !checkOut.value) {
                alert("Please select both Check-In and Check-Out dates.");
                return;
            }

            // Validation 2: Check if check-in date is not in the past
            const checkInDate = new Date(checkIn.value);
            checkInDate.setHours(0, 0, 0, 0);
            if (checkInDate < today) {
                alert("Check-In date cannot be in the past. Please select today or a future date.");
                checkIn.value = "";
                checkOut.value = "";
                return;
            }

            // Validation 3: Check if check-out date is after check-in date
            const checkOutDate = new Date(checkOut.value);
            checkOutDate.setHours(0, 0, 0, 0);
            if (checkOutDate <= checkInDate) {
                alert("Check-Out date must be after Check-In date.");
                return;
            }

            // Format dates for display
            const checkInFormatted = checkInDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            const checkOutFormatted = checkOutDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

            // Create WhatsApp message with booking details
            const message = `Hello Udita Homestay! 🏠\n\nI would like to book a room with the following details:\n\n✓ Check-In: ${checkInFormatted}\n✓ Check-Out: ${checkOutFormatted}\n✓ Number of Rooms: ${roomCount.value}\n✓ Adults: ${adults.value}\n✓ Children: ${children.value}\n\nPlease confirm availability and send me the pricing details. Thank you!`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);

            // WhatsApp phone number (with country code +91 for India, no + sign in URL)
            const phoneNumber = "913369029448";

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Open WhatsApp in new tab
            window.open(whatsappUrl, "_blank");
        });
    }

    /* ==========================================================
       CURRENT YEAR - FIXED
    ========================================================== */

    const yearElement = document.getElementById("current-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    /* ==========================================================
       IMAGE LAZY LOADING
    ========================================================== */

    const images = document.querySelectorAll("img");
    images.forEach(function (image) { image.setAttribute("loading", "lazy"); });

    /* ==========================================================
       PREVENT PAST DATE SELECTION + CHECKOUT MIN/MAX
    ========================================================== */

    const checkInInput = document.getElementById("checkin");
    const checkOutInput = document.getElementById("checkout");

    function formatISODate(d) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function addDays(dateStrOrDate, days) {
        const d = (typeof dateStrOrDate === 'string') ? new Date(dateStrOrDate) : new Date(dateStrOrDate);
        d.setDate(d.getDate() + days);
        return d;
    }

    if (checkInInput && checkOutInput) {
        const todayISO = new Date().toISOString().split('T')[0];
        checkInInput.min = todayISO;
        if (!checkInInput.value) checkInInput.value = todayISO;

        function updateCheckoutConstraints() {
            if (!checkInInput.value) return;
            const minCo = addDays(checkInInput.value, 1);
            const maxCo = addDays(checkInInput.value, 30);
            checkOutInput.min = formatISODate(minCo);
            checkOutInput.max = formatISODate(maxCo);
            if (!checkOutInput.value) { checkOutInput.value = formatISODate(minCo); return; }
            const currentCo = new Date(checkOutInput.value);
            if (currentCo < minCo) checkOutInput.value = formatISODate(minCo);
            else if (currentCo > maxCo) checkOutInput.value = formatISODate(maxCo);
        }

        updateCheckoutConstraints();

        checkInInput.addEventListener('change', function () {
            const today = new Date().toISOString().split('T')[0];
            if (this.value < today) this.value = today;
            updateCheckoutConstraints();
        });

        checkOutInput.addEventListener('change', function () { updateCheckoutConstraints(); });
    }

    /* ==========================================================
       BUTTON RIPPLE EFFECT
    ========================================================== */

    const buttons = document.querySelectorAll(".btn, button");
    buttons.forEach(function (button) { button.addEventListener("mouseenter", function () { button.style.transition = ".3s ease"; }); });

    /* ==========================================================
       BACK TO TOP BUTTON
    ========================================================== */

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        const showAfter = 300;
        function checkScrollForTopBtn() { backToTopBtn.hidden = !(window.scrollY > showAfter); }
        checkScrollForTopBtn();
        window.addEventListener('scroll', checkScrollForTopBtn, { passive: true });
        backToTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

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
       ROOM CARD & GALLERY ENHANCEMENTS
    ========================================================== */

    const rooms = document.querySelectorAll(".room");
    rooms.forEach(function (room) { room.addEventListener("mouseenter", function () { room.style.transition = ".35s ease"; }); });

    const galleryImages = document.querySelectorAll(".gallery img");
    galleryImages.forEach(function (image) { image.addEventListener("click", function () { window.open(image.src, "_blank"); }); });

    /* ==========================================================
       EXTERNAL LINKS
    ========================================================== */

    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(function (link) { link.setAttribute("rel", "noopener noreferrer"); });

    /* ==========================================================
       SCROLL TO TOP ON PAGE REFRESH
    ========================================================== */

    window.addEventListener("beforeunload", function () { window.scrollTo(0, 0); });

    console.log("%cUdita Homestay Website Loaded Successfully", "color:#3E5A49;font-size:14px;font-weight:bold;");

});
