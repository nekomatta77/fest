document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Анимация при скролле (Fade In) ---
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // --- 2. Плавный скролл по якорям ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню при переходе
                if(nav.classList.contains('nav-active')){
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });

    // --- 3. Эффект параллакса для Hero ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && window.innerWidth > 768) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - scrolled / 700;
        }
    });

    // --- 4. Мобильное меню (Burger) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeInLink 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        burger.classList.toggle('toggle');
    });

    // --- 5. Изменение стиля шапки при скролле ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 6. Модальное окно (Билеты) ---
    const modal = document.getElementById('ticketModal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.close-btn');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // --- 7. Анимация Логотипа при Клике (Медленная, без свечения) ---
    const logoImg = document.querySelector('.logo-img');
    if(logoImg) {
        logoImg.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Сброс анимации для повторного клика
            this.classList.remove('logo-animate');
            void this.offsetWidth; // Магический трюк для перезапуска CSS анимации
            
            this.classList.add('logo-animate');

            // Таймер 2000ms соответствует новой длительности анимации в CSS (2s)
            setTimeout(() => {
                this.classList.remove('logo-animate');
            }, 2000); 
        });
    }
});

// Динамическое добавление стилей для мобильной анимации
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeInLink {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
}
`;
document.head.appendChild(styleSheet);
