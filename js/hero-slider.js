document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  const heroSection = document.querySelector('.hero');

  // Exit early if any required slider elements are missing
  if (!slides.length || !dots.length || !prevBtn || !nextBtn || !heroSection) {
    console.warn("⚠️ Hero slider skipped: elements not found.");
    return;
  }

  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 5000;

  function initSlider() {
    slides[0].classList.add('active');
    dots[0].classList.add('active');

    startSlideInterval();

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    dots.forEach(dot => {
      dot.addEventListener('click', function () {
        const slideIndex = parseInt(this.getAttribute('data-slide'), 10);
        goToSlide(slideIndex);
      });
    });

    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', startSlideInterval);
  }

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    resetAnimations(slides[index]);

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function prevSlide() {
    let index = currentSlide - 1;
    if (index < 0) index = slides.length - 1;
    goToSlide(index);
  }

  function nextSlide() {
    let index = currentSlide + 1;
    if (index >= slides.length) index = 0;
    goToSlide(index);
  }

  function startSlideInterval() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function resetAnimations(slide) {
    const heading = slide.querySelector('h1');
    const paragraph = slide.querySelector('p');
    const button = slide.querySelector('.btn');

    [heading, paragraph, button].forEach(el => {
      if (el) {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = null;
      }
    });
  }

  initSlider();
});
