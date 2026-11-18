// Script minimalista para funcionalidades básicas

document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    if (navToggle && navLinks && navOverlay) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
        });

        // Fechar menu ao clicar no overlay
        navOverlay.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    }

    // Smooth scroll para links internos
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Offset para compensar header fixo

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Fechar menu mobile após navegação
                if (navToggle && navLinks && navOverlay) {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    navOverlay.classList.remove('active');
                }
            }
        });
    });

    // Animação sutil ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Animação especial para cards do blog
    const blogObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 150); // Stagger animation
            }
        });
    }, { threshold: 0.1 });

    // Observar cards do blog
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        blogObserver.observe(card);
    });

    // Adicionar classe para animação
    const style = document.createElement('style');
    style.textContent = `
        .section {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.9s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .blog-card {
            opacity: 0;
            transform: translateY(12px);
            transition: opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        @media (prefers-reduced-motion: reduce) {
            .section, .blog-card { opacity: 1; transform: none; transition: none; }
        }

        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sem suporte
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

    // Destaque do link ativo no menu baseado na seção visível
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Destaque inicial
    highlightNavLink();

    // Destaque durante scroll
    window.addEventListener('scroll', highlightNavLink);

    // Performance: debounce para resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recalcular posições se necessário
            highlightNavLink();
        }, 250);
    });

    
// Vídeo do topo só depois da página carregar: a foto (poster) aparece primeiro e o vídeo não disputa a banda com ela
window.addEventListener('load', function() {
    const video = document.querySelector('.hero-video');
    const fonte = video && video.querySelector('source[data-src]');
    const economia = navigator.connection && navigator.connection.saveData;
    if (!fonte || economia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    fonte.src = fonte.dataset.src;
    video.load();
    const tocando = video.play();
    if (tocando && tocando.catch) tocando.catch(function() {});
});

// Refino (18/11/2026): barra de leitura no menu e luz que segue o mouse nos cartões
(function() {
    const barra = document.createElement('div');
    barra.className = 'barra-leitura';
    barra.setAttribute('aria-hidden', 'true');
    const nav = document.querySelector('.main-nav');
    if (nav) nav.appendChild(barra);
    let pendente = false;
    function atualiza() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        barra.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
        if (nav) nav.classList.toggle('rolou', window.scrollY > 24);
        pendente = false;
    }
    window.addEventListener('scroll', function() { if (!pendente) { pendente = true; requestAnimationFrame(atualiza); } }, { passive: true });
    atualiza();

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('.oferta-card, .gp-item, .depoimento, .hero-cta, .ebook-link, .blog-cta-button').forEach(function(el) {
        el.addEventListener('pointermove', function(e) {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });
})();
