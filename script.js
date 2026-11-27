document.addEventListener("DOMContentLoaded", function () {

    /* NAVBAR SCROLL EFFECT */
    const navShell = document.querySelector(".nav-shell");

    window.addEventListener("scroll", function () {
        if (!navShell) return;

        const scrolled = window.scrollY > 20;
        navShell.style.background = scrolled
            ? "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,0.82)";
        navShell.style.boxShadow = scrolled
            ? "0 14px 40px rgba(0,0,0,0.08)"
            : "0 12px 34px rgba(0,0,0,0.08)";
        navShell.classList.toggle("scrolled", scrolled);
    });

    /* HERO CAROUSEL */
    const heroCarousel = document.querySelector("#heroCarousel");

    if (heroCarousel && window.bootstrap) {
        new bootstrap.Carousel(heroCarousel, {
            interval: 4000,
            ride: "carousel",
            pause: false,
            wrap: true,
            touch: true
        });

        const indicators = document.querySelectorAll(".hero-indicators button");

        heroCarousel.addEventListener("slid.bs.carousel", function (event) {
            indicators.forEach((btn, index) => {
                btn.classList.remove("active");
                btn.removeAttribute("aria-current");

                if (index === event.to) {
                    btn.classList.add("active");
                    btn.setAttribute("aria-current", "true");
                }
            });
        });
    }

    /* REVEAL ANIMATION */
    const reveals = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        const windowHeight = window.innerHeight;

        reveals.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                element.classList.add("active");
            }
        });
    }

    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll);

    /* PORTRAIT / PROJECT GALLERIES */
    const galleries = {
        gallery1: {
            title: "Penzion Bellet",
            photos: [
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8703-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8384-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8276-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8840-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8402-HDR.jpg?ver=0"
            ]
        },
        gallery2: {
            title: "Byt Vinohradská - Praha",
            photos: [
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_4975-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_5017-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_4981-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_4999-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_4966-HDR.jpg?ver=0"
            ]
        },
        gallery3: {
            title: "Penzion U Osičků",
            photos: [
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8873-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8918-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8870-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8936-HDR.jpg?ver=0",
                "https://img43.rajce.idnes.cz/d4302/19/19864/19864657_681ea3faf3f983f24a2ae4b5e2a65928/images/IMG_8879-HDR.jpg?ver=0"
            ]
        }
    };

    const modal = document.querySelector("#glassGallery");
    const title = document.querySelector("#glassTitle");
    const image = document.querySelector("#glassImage");
    const counter = document.querySelector("#glassCounter");
    const progress = document.querySelector("#glassProgress");
    const closeButton = document.querySelector("#glassClose");
    const nextButton = document.querySelector("#glassNext");
    const prevButton = document.querySelector("#glassPrev");
    const stage = document.querySelector("#glassStage");

    if (!modal || !title || !image || !counter || !progress) return;

    let activePhotos = [];
    let activeIndex = 0;
    let touchStartX = 0;

    function updatePhoto() {
        if (!activePhotos.length) return;

        image.src = activePhotos[activeIndex];
        counter.textContent = `${activeIndex + 1} / ${activePhotos.length}`;
        progress.style.width = `${((activeIndex + 1) / activePhotos.length) * 100}%`;

        const showArrows = activePhotos.length > 1;
        if (prevButton) prevButton.hidden = !showArrows;
        if (nextButton) nextButton.hidden = !showArrows;
    }

    function openGallery(name) {
        const selected = galleries[name];
        if (!selected || !selected.photos.length) return;

        activePhotos = selected.photos;
        activeIndex = 0;
        title.textContent = selected.title;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("gallery-active");
        updatePhoto();
    }

    function closeGallery() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("gallery-active");
    }

    function nextPhoto() {
        if (!activePhotos.length) return;
        activeIndex = (activeIndex + 1) % activePhotos.length;
        updatePhoto();
    }

    function previousPhoto() {
        if (!activePhotos.length) return;
        activeIndex = (activeIndex - 1 + activePhotos.length) % activePhotos.length;
        updatePhoto();
    }

    document.querySelectorAll(".portrait-card").forEach(card => {
        card.addEventListener("click", () => openGallery(card.dataset.gallery));
    });

    if (closeButton) closeButton.addEventListener("click", closeGallery);

    modal.querySelectorAll("[data-close-gallery]").forEach(element => {
        element.addEventListener("click", closeGallery);
    });

    if (nextButton) nextButton.addEventListener("click", nextPhoto);
    if (prevButton) prevButton.addEventListener("click", previousPhoto);

    document.addEventListener("keydown", event => {
        if (!modal.classList.contains("open")) return;
        if (event.key === "Escape") closeGallery();
        if (event.key === "ArrowRight") nextPhoto();
        if (event.key === "ArrowLeft") previousPhoto();
    });

    if (stage) {
        stage.addEventListener("touchstart", event => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        stage.addEventListener("touchend", event => {
            const delta = event.changedTouches[0].clientX - touchStartX;
            if (Math.abs(delta) > 50) {
                delta < 0 ? nextPhoto() : previousPhoto();
            }
        }, { passive: true });
    }
});
