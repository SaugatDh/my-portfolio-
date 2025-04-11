const toggleBtn = document.querySelector('.toggleBtn');
const navLinks = document.querySelector('.navlinks');
const body = document.body;

toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    body.classList.toggle('menu-open'); // Toggle body scroll
});

// Close menu when clicking a link
const navLinksItems = document.querySelectorAll('.navlinks a');
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggleBtn.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

var typed = new Typed('#element', {
    strings: ['Frontend Developer', 'Web Designer', 'UI/UX Designer'],
    typeSpeed: 70,
    backSpeed: 50,
    loop: true,
    backDelay: 1000,
    lineHeight: 1.2
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate skill bars
const skillBars = document.querySelectorAll('.progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.parentElement.getAttribute('data-progress') + '%';
        }
    });
}, { threshold: 0.2 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}