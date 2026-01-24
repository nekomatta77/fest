document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Анимация появления при скролле ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


    // --- 2. Логика Меню (Оптимизировано) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        overlay.classList.toggle('active'); 
        
        if (nav.classList.contains('nav-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    burger.addEventListener('click', toggleMenu);
    
    overlay.addEventListener('click', () => {
        if(nav.classList.contains('nav-active')) toggleMenu();
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(nav.classList.contains('nav-active')) toggleMenu();
        });
    });


    // --- 3. Плавный скролл ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // --- 4. Параллакс ---
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768 && heroContent) {
            const scrolled = window.scrollY;
            heroContent.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
        }
    });


    // --- 5. Шапка ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });


    // --- 6. Модальные окна (Билеты) ---
    const ticketModal = document.getElementById('ticketModal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.close-btn, .close-modal-action');
    const ticketForm = document.getElementById('ticketForm');
    const formContainer = document.getElementById('modalFormContainer');
    const successContainer = document.getElementById('modalSuccessContainer');
    const submitBtn = document.getElementById('submitBtn');

    function openTicketModal() {
        ticketModal.style.display = 'flex';
        formContainer.style.display = 'block';
        successContainer.style.display = 'none';
        ticketForm.reset();
    }

    function closeTicketModal() {
        ticketModal.style.display = 'none';
    }

    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openTicketModal();
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', closeTicketModal));
    
    window.addEventListener('click', (e) => {
        if (e.target == ticketModal) closeTicketModal();
    });

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Обработка...';
        setTimeout(() => {
            submitBtn.innerText = originalText;
            formContainer.style.display = 'none';
            successContainer.style.display = 'block';
        }, 1500);
    });


    // --- 7. СКАНЕР ФОТОГРАФИЙ ---
    const galleryPath = 'assets/galery/';
    let totalPhotosDetected = 0;
    const track = document.getElementById('galleryTrack');
    const fullGrid = document.getElementById('fullGalleryGrid');
    const openGalleryBtn = document.getElementById('openGalleryBtn');

    function loadGalleryImages(index) {
        const img = new Image();
        img.src = `${galleryPath}photo${index}.png`;
        
        img.onload = () => {
            totalPhotosDetected = index;
            if(track && index <= 10) {
                track.appendChild(createImgElement(index, 'gallery-img-thumb'));
            }
            if(fullGrid) {
                fullGrid.appendChild(createImgElement(index, 'gallery-grid-img'));
            }
            loadGalleryImages(index + 1);
        };
        
        img.onerror = () => {
            if(openGalleryBtn) {
                openGalleryBtn.innerText = `Смотреть все фото (${totalPhotosDetected})`;
            }
        };
    }

    function createImgElement(index, className) {
        const imgEl = document.createElement('img');
        imgEl.src = `${galleryPath}photo${index}.png`;
        imgEl.alt = `Фото ${index}`;
        imgEl.classList.add(className);
        imgEl.loading = "lazy";
        imgEl.ondragstart = () => false;
        return imgEl;
    }
    
    loadGalleryImages(1);


    // --- 8. МОДАЛЬНОЕ ОКНО ГАЛЕРЕИ ---
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryBtn = document.querySelector('.close-gallery-btn');
    
    if(openGalleryBtn) {
        openGalleryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if(closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });


    // --- 9. LIGHTBOX (СВОБОДНЫЙ ЗУМ + ВОЗВРАТ) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.querySelector('.close-lightbox');

    // Состояние трансформации
    let state = {
        scale: 1,
        panning: false,
        pointX: 0,
        pointY: 0,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0
    };

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        resetState();
    }

    function closeLightboxFunc() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }

    function resetState() {
        state = { scale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0, x: 0, y: 0 };
        updateTransform();
    }

    function updateTransform() {
        lightboxImg.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;
    }

    function attachLightboxEvents(container) {
        container.addEventListener('click', (e) => {
            if(e.target.tagName === 'IMG') openLightbox(e.target.src);
        });
    }

    if(track) attachLightboxEvents(track);
    if(fullGrid) attachLightboxEvents(fullGrid);
    if(closeLightbox) closeLightbox.addEventListener('click', closeLightboxFunc);

    // Функция возврата (Snap-back Logic)
    function constrainState() {
        if (state.scale <= 1.05) {
            state.scale = 1;
            state.x = 0;
            state.y = 0;
        } else {
            const w = lightboxImg.offsetWidth * state.scale;
            const h = lightboxImg.offsetHeight * state.scale;
            const cw = window.innerWidth;
            const ch = window.innerHeight;
            
            const rangeX = (w > cw) ? (w - cw) / 2 : 0;
            const rangeY = (h > ch) ? (h - ch) / 2 : 0;
            
            if (state.x > rangeX) state.x = rangeX;
            if (state.x < -rangeX) state.x = -rangeX;
            if (state.y > rangeY) state.y = rangeY;
            if (state.y < -rangeY) state.y = -rangeY;
        }
    }

    // -- Desktop Events --
    lightbox.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = -e.deltaY;
        (delta > 0) ? (state.scale *= 1.1) : (state.scale /= 1.1);
        
        if(state.scale > 5) state.scale = 5;
        if(state.scale < 0.8) state.scale = 0.8; 

        if(state.scale <= 1) {
             state.x = 0;
             state.y = 0;
        }
        
        updateTransform();
    }, { passive: false });

    lightboxImg.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if(state.scale > 1) {
            state.startX = e.clientX - state.x;
            state.startY = e.clientY - state.y;
            state.panning = true;
            lightboxImg.style.cursor = 'grabbing';
            lightboxImg.style.transition = 'none'; 
        }
    });

    window.addEventListener('mouseup', () => {
        state.panning = false;
        lightboxImg.style.cursor = 'grab';
        lightboxImg.style.transition = 'transform 0.3s ease-out';
        constrainState(); 
        updateTransform();
    });

    window.addEventListener('mousemove', (e) => {
        if (!state.panning) return;
        e.preventDefault();
        state.x = e.clientX - state.startX;
        state.y = e.clientY - state.startY;
        updateTransform();
    });

    // -- Mobile Events --
    let initialDistance = 0;
    let initialScale = 1;

    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            initialScale = state.scale;
            lightboxImg.style.transition = 'none';
        } else if (e.touches.length === 1 && state.scale > 1) {
            state.startX = e.touches[0].clientX - state.x;
            state.startY = e.touches[0].clientY - state.y;
            state.panning = true;
            lightboxImg.style.transition = 'none';
        }
    });

    lightbox.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length === 2) {
            const currentDistance = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            if (initialDistance > 0) {
                const diff = currentDistance / initialDistance;
                state.scale = initialScale * diff;
                if(state.scale > 5) state.scale = 5;
                updateTransform();
            }
        } else if (e.touches.length === 1 && state.panning && state.scale > 1) {
            state.x = e.touches[0].clientX - state.startX;
            state.y = e.touches[0].clientY - state.startY;
            updateTransform();
        }
    }, { passive: false });

    lightbox.addEventListener('touchend', (e) => {
        if(e.touches.length < 2) initialDistance = 0;
        if(e.touches.length === 0) state.panning = false;
        
        lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        constrainState(); 
        updateTransform();
    });


    // --- 10. Анимация Логотипа ---
    const logoImg = document.querySelector('.logo-img');
    if(logoImg) {
        logoImg.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'rotate(70deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 600);
        });
    }
});
