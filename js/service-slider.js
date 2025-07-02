document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.service-slide');
    const dots = document.querySelectorAll('.service-slider-dot');
    const prevBtn = document.querySelector('.prev-service');
    const nextBtn = document.querySelector('.next-service');

    let currentIndex = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i]?.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index]?.classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Controls
    nextBtn?.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    prevBtn?.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Pause on hover (optional, works on desktop)
    const sliderContainer = document.querySelector('.service-slider');
    sliderContainer?.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer?.addEventListener('mouseleave', startAutoSlide);

    // Initialize
    showSlide(0);
    startAutoSlide();
});
