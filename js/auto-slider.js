document.addEventListener('DOMContentLoaded', function() {
    console.log('Auto slider script loaded');
    
    // Get all slides
    const slides = document.querySelectorAll('.service-slide');
    if (!slides.length) {
        console.log('No slides found');
        return;
    }
    
    console.log('Found ' + slides.length + ' slides');
    
    // Current slide index
    let currentSlide = 0;
    
    // Dots for navigation
    const dots = document.querySelectorAll('.service-slider-dot');
    
    // Navigation buttons
    const prevButton = document.querySelector('.prev-service');
    const nextButton = document.querySelector('.next-service');
    
    // Show slide function
    function showSlide(index) {
        console.log('Showing slide ' + index);
        
        // Hide all slides
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.classList.remove('active');
        });
        
        // Show selected slide
        slides[index].style.opacity = '1';
        slides[index].style.visibility = 'visible';
        slides[index].classList.add('active');
        
        // Update dots
        if (dots.length) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }
        
        // Update current slide
        currentSlide = index;
    }
    
    // Next slide function
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }
    
    // Previous slide function
    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    }
    
    // Initialize slider
    showSlide(0);
    
    // Auto slide timer
    let slideTimer;
    
    // Start auto sliding
    function startAutoSlide() {
        console.log('Starting auto slide');
        // Clear any existing timer
        if (slideTimer) {
            clearInterval(slideTimer);
        }
        // Set new timer
        slideTimer = setInterval(function() {
            nextSlide();
        }, 5000);
    }
    
    // Stop auto sliding
    function stopAutoSlide() {
        console.log('Stopping auto slide');
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }
    
    // Start auto sliding immediately
    startAutoSlide();
    
    // Add click events to navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Add click events to dots
    if (dots.length) {
        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });
    }
    
    // Pause on hover
    const sliderContainer = document.querySelector('.service-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Force start after a delay to ensure everything is loaded
    setTimeout(function() {
        console.log('Force starting auto slide');
        stopAutoSlide();
        startAutoSlide();
        
        // Show visual indicator
        const slider = document.querySelector('.service-slider');
        if (slider) {
            slider.classList.add('sliding');
        }
    }, 1000);
});

// Add another event listener to ensure autostart even if DOMContentLoaded already fired
window.addEventListener('load', function() {
    console.log('Window loaded - ensuring slider is running');
    
    // Trigger next slide to ensure animation is visible
    setTimeout(function() {
        const nextButton = document.querySelector('.next-service');
        if (nextButton) {
            console.log('Simulating button click to ensure slider is running');
            nextButton.click();
        }
    }, 2000);
});
