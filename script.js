/* script.js - Shared JavaScript for EcoSense
   Handles mobile navigation toggle, back-to-top, smooth scrolling
   Page-specific JS is inline in HTML files for simplicity (beginner-friendly)
*/

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      // Animate hamburger lines
      const lines = hamburger.querySelectorAll('span');
      lines.forEach((line, index) => {
        line.style.transform = navMenu.classList.contains('active') ? 
          (index === 1 ? 'rotate(45deg)' : 'rotate(-45deg)') : 'none';
      });
    });
    
    // Close menu when clicking on a link or button
    document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
  
  // Back to Top Button (if exists)
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.style.display = 'block';
      } else {
        backToTop.style.display = 'none';
      }
    });
    
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Fade in animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe cards for animation
  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
});

/* Utility Functions - Used in page-specific inline JS */

/* Form Validation Helper */
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#f44336';
    } else {
      input.style.borderColor = '#ddd';
    }
    
    // Email validation
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        input.style.borderColor = '#f44336';
      }
    }
  });
  
  return isValid;
}

/* Show Alert/Message */
function showMessage(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 10px;
    color: white;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  if (type === 'success') alertDiv.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
  if (type === 'error') alertDiv.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
}

// CSS for alerts will be added inline if needed

