document.addEventListener('DOMContentLoaded', function () {
  // === Mobile Navigation Toggle ===
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // === Smooth Scrolling ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // === Animated Feature Strip ===
  const animateFeatureStrip = () => {
    const stripItems = document.querySelectorAll('.strip-item');
    stripItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 * (index + 1));
    });
  };

  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .form-container, .calculator-form, .calculator-results');
    elements.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight / 1.2) {
        el.classList.add('animate');
      }
    });
  };

  // Apply scroll animations
  const style = document.createElement('style');
  style.textContent = `
    .feature-card, .service-card, .testimonial-card, .form-container, .calculator-form, .calculator-results {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .feature-card.animate, .service-card.animate, .testimonial-card.animate, .form-container.animate, .calculator-form.animate, .calculator-results.animate {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
  animateFeatureStrip();
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);

  // === Auto-select loan type if provided in URL ===
  const urlParams = new URLSearchParams(window.location.search);
  const loanType = urlParams.get('type');
  if (loanType && document.getElementById('loan-type')) {
    const select = document.getElementById('loan-type');
    const exists = Array.from(select.options).some(opt => opt.value === loanType);
    if (exists) select.value = loanType;
  }

  // === Newsletter Form Submission ===
  const form = document.getElementById('subscribe-form');
  const inner = document.getElementById('subscribe-inner');

  if (form && inner) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const agree = form.querySelector('input[name="agree"]').checked;

      if (!name || !email || !agree) {
        alert("Please complete all required fields.");
        return;
      }

      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("agree", agree);

      fetch("php/newsletter.php", {
        method: "POST",
        body: data
      })
      .then(res => res.text())
      .then(response => {
        inner.innerHTML = `
          <div style="text-align:center; padding:20px; color:#000;">
            <i class="fas fa-check-circle" style="font-size:48px; color:#28a745;"></i>
            <h2>Thank You!</h2>
            <p>Your subscription has been submitted successfully.</p>
            <p><strong>${email}</strong></p>
          </div>
        `;
      })
      .catch(error => {
        console.error("Newsletter error:", error);
        alert("Submission failed. Please try again.");
      });
    });
  }

  // === Track contact button clicks (optional) ===
  const callBtn = document.querySelector('.call-btn');
  const whatsappBtn = document.querySelector('.whatsapp-btn');

  if (callBtn) {
    callBtn.addEventListener('click', () => {
      console.log('Call button clicked');
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      console.log('WhatsApp button clicked');
    });
  }
});
