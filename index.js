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

// Intersection Observer for fade-in animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe project cards, tool cards, education cards, and assignment cards for animations
document.querySelectorAll('.project-card, .tool-card, .education-card, .assignment-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Contact form handling with email functionality
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const form = contactForm.querySelector('form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validate inputs
        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            showContactResponse('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showContactResponse('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Using FormSubmit.co service (free, no signup required)
            const response = await fetch('https://formsubmit.co/ajax/rajgour617@gmail.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: new FormData(form)
            });

            if (response.ok) {
                showContactResponse('✓ Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            // Fallback: Construct a mailto link with proper formatting
            try {
                const subject = encodeURIComponent(subjectInput.value);
                const body = encodeURIComponent(`Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\nMessage:\n${messageInput.value}`);
                const mailtoLink = `mailto:rajgour617@gmail.com?subject=${subject}&body=${body}`;
                
                // Create a temporary link and trigger it
                const a = document.createElement('a');
                a.href = mailtoLink;
                a.click();
                
                showContactResponse('✓ Email client opened. Your message details are ready to send!', 'success');
                setTimeout(() => form.reset(), 1500);
            } catch (err) {
                showContactResponse('Error: Please try emailing me directly at rajgour617@gmail.com', 'error');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Show contact form response message
function showContactResponse(message, type) {
    const formContainer = document.querySelector('.contact-form');
    let responseDiv = formContainer.querySelector('.contact-form-response');
    
    if (!responseDiv) {
        responseDiv = document.createElement('div');
        responseDiv.className = `contact-form-response ${type}`;
        const form = formContainer.querySelector('form');
        form.parentNode.insertBefore(responseDiv, form.nextSibling);
    } else {
        responseDiv.className = `contact-form-response ${type}`;
    }
    
    responseDiv.textContent = message;
    responseDiv.style.display = 'block';
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
        responseDiv.style.opacity = '0';
        responseDiv.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            responseDiv.style.display = 'none';
            responseDiv.style.opacity = '1';
            responseDiv.style.transition = 'opacity 0.3s ease-in';
        }, 500);
    }, 6000);
}
