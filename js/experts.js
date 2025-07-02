document.addEventListener('DOMContentLoaded', function() {
    // Play button functionality for expert talks
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const talkTitle = this.closest('.talk-card').querySelector('h3').textContent;
            
            // In a real application, this would open a video player
            // For this example, we'll just show an alert
            alert(`Now playing: ${talkTitle}`);
        });
    });
    
    // Animate expert cards on scroll
    const expertCards = document.querySelectorAll('.expert-card');
    const talkCards = document.querySelectorAll('.talk-card');
    
    // Set initial styles for animation
    expertCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    talkCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to animate elements when they're in viewport
    function animateOnScroll() {
        expertCards.forEach((card, index) => {
            if (isInViewport(card)) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            }
        });
        
        talkCards.forEach((card, index) => {
            if (isInViewport(card)) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            }
        });
    }
    
    // Run animation on scroll and on load
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});
