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
    lineHeight: 1.2 // Add this line
});