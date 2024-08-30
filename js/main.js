document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navItems = document.querySelector('.nav-items');

    mobileMenuButton.addEventListener('click', function() {
        navItems.classList.toggle('show');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar color change on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('bg-opacity-90', window.scrollY > 0);
        }
    });

    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section > div > *').forEach(el => {
        observer.observe(el);
    });

    // Animate team members on scroll
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                teamObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('#our-team .team-member').forEach(el => {
        el.classList.add('opacity-0');
        teamObserver.observe(el);
    });

    // Form submission handling with Formspree and security measures
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Sanitize and encode form inputs
            const sanitizedFormData = new FormData();
            for (let [key, value] of new FormData(form)) {
                // Sanitize input
                const sanitizedValue = DOMPurify.sanitize(value);
                
                // Encode for XSS prevention
                const encodedValue = filterXSS(sanitizedValue);
                
                // Add to sanitized FormData
                sanitizedFormData.append(key, encodedValue);
            }
            
            // URL encode the form action
            const encodedAction = encodeURI(form.action);
            
            // Submit the form using Fetch API
            fetch(encodedAction, {
                method: form.method,
                body: sanitizedFormData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Sanitize and encode the success message
                    const successMessage = DOMPurify.sanitize('Thank you for your message. We will get back to you soon!');
                    alert(filterXSS(successMessage));
                    form.reset();
                } else {
                    // Sanitize and encode the error message
                    const errorMessage = DOMPurify.sanitize('Oops! There was a problem submitting your form. Please try again.');
                    alert(filterXSS(errorMessage));
                }
            })
            .catch(error => {
                // Sanitize and encode the error message
                const errorMessage = DOMPurify.sanitize('Oops! There was a problem submitting your form. Please try again.');
                alert(filterXSS(errorMessage));
                console.error('Error:', error);
            });
        });
    }

    // Parallax effect for the background
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const movingBackground = document.querySelector('.moving-background');
        if (movingBackground) {
            movingBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('#services .bg-opacity-10');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('scale-105', 'shadow-2xl');
        });
        card.addEventListener('mouseleave', function() {
            this.classList.remove('scale-105', 'shadow-2xl');
        });
    });
});

// Function to safely insert content into the DOM
function safeInsertHTML(element, content) {
    const sanitizedContent = DOMPurify.sanitize(content);
    element.innerHTML = sanitizedContent;
}

// URL encoding function for query parameters
function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

// Utility function to sanitize and encode a string
function sanitizeAndEncode(str) {
    return filterXSS(DOMPurify.sanitize(str));
}

// Function to safely update text content
function safeSetTextContent(element, content) {
    element.textContent = DOMPurify.sanitize(content);
}