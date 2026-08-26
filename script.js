// Navigation bar and multi-brand hero slider interaction script.

document.addEventListener('DOMContentLoaded', () => {
    const navLogo = document.getElementById('nav-logo');
    const navExploreBtn = document.getElementById('nav-explore-btn');
    const btnLogin = document.getElementById('btn-login');

    // Handles Explore dropdown button click.
    if (navExploreBtn) {
        navExploreBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('[Navbar] Explore dropdown trigger clicked.');
        });
    }

    // Navigates to the authentication page if the user is not logged in.
    if (btnLogin) {
        btnLogin.addEventListener('click', (event) => {
            if (typeof isLoggedIn === 'function' && isLoggedIn()) {
                return;
            }
            window.location.href = 'auth/login.html';
        });
    }

    // Updates aria-expanded attribute on Explore button hover.
    if (navExploreBtn) {
        navExploreBtn.addEventListener('mouseenter', () => {
            navExploreBtn.setAttribute('aria-expanded', 'true');
        });

        navExploreBtn.addEventListener('mouseleave', () => {
            navExploreBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Hero slider elements and initialization.
    const sliderTrack = document.getElementById('hero-slider-track');
    const slides = document.querySelectorAll('.hero-slide');

    if (sliderTrack && slides.length > 0) {
        console.log(`[Hero Slider] Initialized architecture with ${slides.length} slides.`);
    }

    if (typeof brands !== 'undefined') {
        console.log('[Data Layer] Brands configuration:', brands);
    }

    // Render initial brand content.
    renderBrand(currentBrand);
});

// State variables for hero slider brand selection and animation tracking.
let currentBrand = 0;
let isAnimating = false;
const ANIMATION_DURATION = 700;

// Renders brand hero content dynamically using data from brands.js.
function renderBrand(index) {
    if (typeof brands === 'undefined' || !brands[index]) {
        console.warn(`[renderBrand] Invalid brand index: ${index}`);
        return;
    }

    const brand = brands[index];

    const heroHeading = document.getElementById('hero-heading');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroButton = document.getElementById('hero-button');
    const heroImage = document.getElementById('hero-image');
    const heroBackground = document.getElementById('hero-background');

    if (heroHeading) {
        if (brand.heading.includes(' ')) {
            const parts = brand.heading.split(' ');
            heroHeading.innerHTML = `${parts[0]}<br>${parts.slice(1).join(' ')}`;
        } else {
            heroHeading.textContent = brand.heading;
        }
    }

    if (heroSubtitle) {
        heroSubtitle.textContent = brand.subtitle;
    }

    if (heroButton) {
        const arrowSpan = heroButton.querySelector('.btn-arrow');
        if (arrowSpan) {
            heroButton.innerHTML = `<span>${brand.buttonText}</span> <span class="btn-arrow">&rarr;</span>`;
        } else {
            heroButton.textContent = brand.buttonText;
        }
        heroButton.href = brand.url || '#';
    }

    if (heroImage) {
        heroImage.src = brand.image;
        heroImage.alt = brand.heading;
    }

    if (brand.color) {
        document.documentElement.style.setProperty('--color-brand-orange', brand.color);
        if (heroBackground) {
            heroBackground.style.setProperty('--color-brand-orange', brand.color);
        }
    }

    currentBrand = index;
}

// Animates smooth transition when switching between brands.
function changeBrand(index) {
    if (isAnimating) return;
    isAnimating = true;

    const contentLeft = document.querySelector('.slide-content-left');
    const heroImage = document.getElementById('hero-image');

    if (contentLeft) contentLeft.classList.add('hero-content-exit');
    if (heroImage) heroImage.classList.add('hero-image-exit');

    setTimeout(() => {
        renderBrand(index);

        if (contentLeft) contentLeft.classList.remove('hero-content-exit');
        if (heroImage) heroImage.classList.remove('hero-image-exit');

        if (contentLeft) contentLeft.classList.add('hero-content-enter-prep');
        if (heroImage) heroImage.classList.add('hero-image-enter-prep');

        if (contentLeft) contentLeft.offsetHeight;

        if (contentLeft) {
            contentLeft.classList.remove('hero-content-enter-prep');
            contentLeft.classList.add('hero-content-enter');
        }
        if (heroImage) {
            heroImage.classList.remove('hero-image-enter-prep');
            heroImage.classList.add('hero-image-enter');
        }

        setTimeout(() => {
            if (contentLeft) contentLeft.classList.remove('hero-content-enter');
            if (heroImage) heroImage.classList.remove('hero-image-enter');
            isAnimating = false;
        }, 400);

    }, 300);
}

// Advances to the next brand in the hero slider.
function nextBrand() {
    if (isAnimating || typeof brands === 'undefined' || brands.length === 0) return;
    let targetIndex = currentBrand + 1;
    if (targetIndex >= brands.length) {
        targetIndex = 0;
    }
    changeBrand(targetIndex);
}

// Switches to the previous brand in the hero slider.
function previousBrand() {
    if (isAnimating || typeof brands === 'undefined' || brands.length === 0) return;
    let targetIndex = currentBrand - 1;
    if (targetIndex < 0) {
        targetIndex = brands.length - 1;
    }
    changeBrand(targetIndex);
}

// Handles left and right arrow key presses for brand navigation.
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        nextBrand();
    } else if (event.key === 'ArrowLeft') {
        previousBrand();
    }
});
