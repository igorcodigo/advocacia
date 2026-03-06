/* ===================================================
   ADVOCACIA — script.js
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- ELEMENTS ---- */
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const scrollTopBtn = document.getElementById('scrollTop');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    const contactForm = document.getElementById('contactForm');

    /* ===================================================
       NAV — scroll effect & active link
    =================================================== */
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        /* Sticky header */
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        /* Scroll-to-top button */
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        /* Active nav link */
        let current = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            if (window.scrollY >= sectionTop) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });

        /* Reveal on scroll */
        revealElements();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    /* ===================================================
       SCROLL-TO-TOP
    =================================================== */
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===================================================
       SMOOTH SCROLL for anchor links
    =================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });

            /* Close mobile nav if open */
            if (mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('open');
            }
        });
    });

    /* ===================================================
       HAMBURGER MENU
    =================================================== */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });

    /* ===================================================
       REVEAL ON SCROLL (Intersection Observer)
    =================================================== */
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));

    function revealElements() { /* kept for scroll fallback — IO handles most */ }

    /* ===================================================
       CONTACT FORM VALIDATION
    =================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;

            /* Helper */
            function setError(fieldId, msgId, show) {
                const field = document.getElementById(fieldId);
                const msg = document.getElementById(msgId);
                if (show) {
                    field.classList.add('error');
                    msg.classList.add('show');
                    valid = false;
                } else {
                    field.classList.remove('error');
                    msg.classList.remove('show');
                }
            }

            /* Name */
            const name = document.getElementById('nome').value.trim();
            setError('nome', 'nome-error', name.length < 3);

            /* Email */
            const email = document.getElementById('email').value.trim();
            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            setError('email', 'email-error', !emailOk);

            /* Phone */
            const phone = document.getElementById('telefone').value.trim();
            const phoneOk = /^[\d\s\(\)\-\+]{8,}$/.test(phone);
            setError('telefone', 'telefone-error', !phoneOk);

            /* Message */
            const msg = document.getElementById('mensagem').value.trim();
            setError('mensagem', 'mensagem-error', msg.length < 10);

            /* Submit */
            const status = document.getElementById('formStatus');
            if (valid) {
                /* Simulate send */
                const btn = contactForm.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.textContent = 'Enviando…';

                setTimeout(() => {
                    status.className = 'form-status success';
                    status.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    contactForm.reset();
                    btn.disabled = false;
                    btn.textContent = 'Enviar Mensagem';
                }, 1200);
            } else {
                status.className = 'form-status error-msg';
                status.textContent = '⚠️ Por favor, corrija os campos destacados antes de enviar.';
            }
        });

        /* Live clear on input */
        contactForm.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => {
                el.classList.remove('error');
                const errEl = document.getElementById(`${el.id}-error`);
                if (errEl) errEl.classList.remove('show');
                document.getElementById('formStatus').className = 'form-status';
            });
        });
    }

    /* ===================================================
       PHONE MASK
    =================================================== */
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
            if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
            phoneInput.value = v;
        });
    }

});
