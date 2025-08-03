document.addEventListener('DOMContentLoaded', () => {

    // --- Expand/Collapse for Job Experience ---
    const jobHeaders = document.querySelectorAll('.job-header.toggle-details');

    jobHeaders.forEach(header => {
        const details = header.nextElementSibling;
        if (!details || !details.classList.contains('job-details')) return;

        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('tabindex', '0');

        const toggleDetails = () => {
            const isHidden = details.classList.contains('hidden');
            details.classList.toggle('hidden');
            header.classList.toggle('active', !isHidden);
            header.setAttribute('aria-expanded', !isHidden);
            
            if (!isHidden) {
                details.style.maxHeight = null;
            } else {
                details.style.maxHeight = details.scrollHeight + "px";
            }
        };
        
        header.addEventListener('click', toggleDetails);
        header.addEventListener('keydown', (event) => {
             if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDetails();
            }
        });
    });

    // --- Fade-in Animation on Scroll ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Update Footer Year ---
     const yearSpan = document.getElementById('year');
     if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
     }

});
