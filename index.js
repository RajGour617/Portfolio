// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Smooth scrolling + set active on click
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            // active on click (will be corrected by scroll listener as well)
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Update active nav link on scroll + back-to-top
const sections = Array.from(document.querySelectorAll('section[id]'));
const backToTop = document.getElementById('back-to-top');

const onScroll = () => {
    const scrollPos = window.scrollY + 100; // offset for sticky nav
    let currentId = '';

    for (const sec of sections) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            currentId = sec.id;
            break;
        }
    }

    if (currentId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) link.classList.add('active');
            else link.classList.remove('active');
        });
    }

    if (backToTop) {
        if (window.scrollY > 300) backToTop.classList.remove('hidden');
        else backToTop.classList.add('hidden');
    }
};
window.addEventListener('scroll', onScroll);

// Back to top button
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Animate skill bars when skills section enters view
const animateSkillBars = () => {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const triggerPoint = skillsSection.offsetTop - window.innerHeight + 200;
    if (window.scrollY > triggerPoint) {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => { bar.style.width = width; }, 100);
        });
        window.removeEventListener('scroll', animateSkillBars);
    }
};
window.addEventListener('scroll', animateSkillBars);
