document.addEventListener('DOMContentLoaded', () => {
    
    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    
    // Блокировка скролла (использует класс из CSS)
    function toggleScrollLock(isLocked) {
        if (isLocked) {
            document.body.classList.add('lock-scroll');
        } else {
            document.body.classList.remove('lock-scroll');
        }
    }

    // --- 1. АНИМАЦИЯ ПОЯВЛЕНИЯ ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


    // --- 2. ЛОГИКА МЕНЮ (БУРГЕР) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        // Переключаем классы активности
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        overlay.classList.toggle('active'); 
        
        // Проверяем, открыто меню или закрыто, и блокируем скролл
        if (nav.classList.contains('nav-active')) {
            toggleScrollLock(true);
        } else {
            toggleScrollLock(false);
        }
    }

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }
    
    // Закрытие при клике на затемненный фон
    if (overlay) {
        overlay.addEventListener('click', () => {
            if(nav.classList.contains('nav-active')) toggleMenu();
        });
    }
    
    // Закрытие при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(nav.classList.contains('nav-active')) toggleMenu();
        });
    });


    // --- 3. ПЛАВНЫЙ СКРОЛЛ ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Проверка, что цель существует
            const targetEl = document.querySelector(targetId);
            if (targetId !== '#' && targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // --- 4. ОПТИМИЗИРОВАННЫЙ СКРОЛЛ (HEADER + PARALLAX) ---
    const heroContent = document.querySelector('.hero-content');
    const navbar = document.querySelector('.navbar');
    let isWindowScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isWindowScrolling) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;

                // Параллакс только для десктопа
                if (window.innerWidth > 768 && heroContent) {
                    heroContent.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
                }

                // Смена стиля шапки
                if (scrolled > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                isWindowScrolling = false;
            });
            isWindowScrolling = true;
        }
    });


    // --- 5. УМНАЯ ФОРМА БИЛЕТОВ (Validation + Mask) ---
    const ticketModal = document.getElementById('ticketModal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.close-btn, .close-modal-action');
    const ticketForm = document.getElementById('ticketForm');
    const formContainer = document.getElementById('modalFormContainer');
    const successContainer = document.getElementById('modalSuccessContainer');
    const submitBtn = document.getElementById('submitBtn');

    // Поля ввода
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    function openTicketModal() {
        if (!ticketModal) return;
        ticketModal.style.display = 'flex';
        formContainer.style.display = 'block';
        successContainer.style.display = 'none';
        
        // Сброс формы и кнопки
        if (ticketForm) {
            ticketForm.reset();
            resetValidationStyles();
            toggleSubmitButton(false);
        }
        toggleScrollLock(true);
    }

    function closeTicketModal() {
        if (!ticketModal) return;
        ticketModal.style.display = 'none';
        toggleScrollLock(false);
    }

    // -- МАСКА ТЕЛЕФОНА --
    function handlePhoneMask(e) {
        let el = e.target;
        let pattern = el.getAttribute('placeholder');
        let def = "7"; 
        let val = el.value.replace(/\D/g, "");
        
        if (def.length >= val.length) val = def;
        
        el.value = matrix(pattern, def, val);
        
        validateForm();
    }

    function matrix(pattern, def, val) {
        let i = 0;
        let v = val;
        if (val.length === 11 && val[0] === '8') {
             v = '7' + val.slice(1);
        }
        return pattern.replace(/[_\d]/g, function(a) {
            return i < v.length ? v.charAt(i++) : i >= v.length ? "" : a;
        });
    }

    if(phoneInput) {
        phoneInput.addEventListener('input', handlePhoneMask);
        phoneInput.addEventListener('focus', handlePhoneMask);
        phoneInput.addEventListener('blur', handlePhoneMask);
    }

    // -- ВАЛИДАЦИЯ --
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateForm() {
        const nameValid = nameInput.value.trim().length > 1;
        const phoneRaw = phoneInput.value.replace(/\D/g, "");
        const phoneValid = phoneRaw.length >= 11; 
        const emailValid = validateEmail(emailInput.value);

        setInputStatus(nameInput, nameValid);
        setInputStatus(phoneInput, phoneValid);
        setInputStatus(emailInput, emailValid);

        toggleSubmitButton(nameValid && phoneValid && emailValid);
    }

    function setInputStatus(input, isValid) {
        if(input.value.length === 0) {
            input.style.borderColor = '#e0e0e0';
            input.style.boxShadow = 'none';
            return;
        }
        input.style.borderColor = isValid ? '#4caf50' : '#ff4d4d';
        input.style.boxShadow = isValid ? 'none' : '0 0 5px rgba(255, 77, 77, 0.2)';
    }

    function resetValidationStyles() {
        [nameInput, phoneInput, emailInput].forEach(inp => {
            if(inp) {
                inp.style.borderColor = '#e0e0e0';
                inp.style.boxShadow = 'none';
            }
        });
    }

    function toggleSubmitButton(isValid) {
        if (!submitBtn) return;
        if (isValid) {
            submitBtn.removeAttribute('disabled');
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.innerText = 'Оплатить';
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.innerText = 'Заполните поля';
        }
    }

    if(nameInput) nameInput.addEventListener('input', validateForm);
    if(emailInput) emailInput.addEventListener('input', validateForm);

    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openTicketModal();
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', closeTicketModal));
    
    window.addEventListener('click', (e) => {
        if (e.target == ticketModal) closeTicketModal();
    });

    if (ticketForm) {
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
    }


    // --- 6. ГАЛЕРЕЯ (Изолированная загрузка) ---
    const galleryPath = 'assets/galery/';
    const track = document.getElementById('galleryTrack');
    const fullGrid = document.getElementById('fullGalleryGrid');
    const openGalleryBtn = document.getElementById('openGalleryBtn');

    const maxPhotosToCheck = 30; 
    let photosLoadedCount = 0;

    function createImgElement(index, className) {
        const imgEl = document.createElement('img');
        imgEl.src = `${galleryPath}photo${index}.png`;
        imgEl.alt = `Фото с фестиваля ${index}`;
        imgEl.classList.add(className);
        imgEl.loading = "lazy";
        imgEl.ondragstart = () => false;
        return imgEl;
    }

    for (let i = 1; i <= maxPhotosToCheck; i++) {
        const img = new Image();
        img.src = `${galleryPath}photo${i}.png`;
        
        img.onload = () => {
            photosLoadedCount++;
            if(track && i <= 10) {
                track.appendChild(createImgElement(i, 'gallery-img-thumb'));
            }
            if(fullGrid) {
                fullGrid.appendChild(createImgElement(i, 'gallery-grid-img'));
            }
            if(openGalleryBtn) {
                openGalleryBtn.innerText = `Смотреть фото (${photosLoadedCount})`;
            }
        };
        // Ошибки игнорируем
        img.onerror = () => {};
    }


    // --- 7. МОДАЛКА ГАЛЕРЕИ ---
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryBtn = document.querySelector('.close-gallery-btn');
    
    if(openGalleryBtn && galleryModal) {
        openGalleryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            galleryModal.style.display = 'flex';
            toggleScrollLock(true);
        });
    }

    if(closeGalleryBtn && galleryModal) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.style.display = 'none';
            toggleScrollLock(false);
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == galleryModal) {
            galleryModal.style.display = 'none';
            toggleScrollLock(false);
        }
    });


    // --- 8. LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.querySelector('.close-lightbox');

    let state = { scale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0, x: 0, y: 0 };

    function openLightbox(src) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        lightbox.style.display = 'flex';
        toggleScrollLock(true);
        resetState();
    }

    function closeLightboxFunc() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
        toggleScrollLock(false);
    }

    function resetState() {
        state = { scale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0, x: 0, y: 0 };
        updateTransform();
    }

    function updateTransform() {
        if (!lightboxImg) return;
        lightboxImg.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;
    }

    function attachLightboxEvents(container) {
        if (!container) return;
        container.addEventListener('click', (e) => {
            if(e.target.tagName === 'IMG') openLightbox(e.target.src);
        });
    }

    attachLightboxEvents(track);
    attachLightboxEvents(fullGrid);
    
    if(closeLightbox) closeLightbox.addEventListener('click', closeLightboxFunc);

    // Логика зума и панорамирования (без изменений, просто свернута для краткости)
    function constrainState() {
        if (!lightboxImg) return;
        if (state.scale <= 1.05) {
            state.scale = 1; state.x = 0; state.y = 0;
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

    if (lightbox) {
        lightbox.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = -e.deltaY;
            (delta > 0) ? (state.scale *= 1.1) : (state.scale /= 1.1);
            if(state.scale > 5) state.scale = 5;
            if(state.scale < 0.8) state.scale = 0.8; 
            if(state.scale <= 1) { state.x = 0; state.y = 0; }
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
            if (!state.panning) return;
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

        // Mobile gestures
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
    }


    // --- 9. МОДАЛКА "О НАС" ---
    const aboutModal = document.getElementById('aboutModal');
    const openAboutBtn = document.getElementById('openAboutBtn');
    const closeAboutBtn = document.querySelector('.about-close-btn');
    const aboutTabs = document.querySelectorAll('.about-tab-btn');
    const aboutTitle = document.getElementById('aboutTitle');
    const aboutText = document.getElementById('aboutText');

    const aboutData = {
        1: { title: "Честное судейство", text: "Наши эксперты серьёзно относятся к конкурсной программе..." },
        2: { title: "Круглые столы", text: "Мы предоставляем для наших руководителей возможность побеседовать..." },
        3: { title: "Четкий тайминг", text: "Мы готовим программу подсчитывая каждый час, минуту, секунду..." }
    };

    if(openAboutBtn) {
        openAboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(aboutModal) {
                aboutModal.style.display = 'flex';
                toggleScrollLock(true);
            }
        });
    }

    if(closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => {
            if(aboutModal) {
                aboutModal.style.display = 'none';
                toggleScrollLock(false);
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == aboutModal) {
            aboutModal.style.display = 'none';
            toggleScrollLock(false);
        }
    });

    aboutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            aboutTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            const content = aboutData[tabId];
            aboutTitle.style.opacity = 0;
            aboutText.style.opacity = 0;
            setTimeout(() => {
                aboutTitle.innerText = content.title;
                aboutText.innerText = content.text;
                aboutTitle.style.opacity = 1;
                aboutText.style.opacity = 1;
            }, 200);
        });
    });


    // --- 10. АНИМАЦИЯ ЛОГОТИПА ---
    const logoImg = document.querySelector('.logo-img');
    if(logoImg) {
        logoImg.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'rotate(70deg)';
            setTimeout(() => { this.style.transform = 'rotate(0deg)'; }, 600);
        });
    }


    // --- 11. ГЛОБАЛЬНЫЙ ESC ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (ticketModal && ticketModal.style.display === 'flex') closeTicketModal();
            if (galleryModal && galleryModal.style.display === 'flex') {
                galleryModal.style.display = 'none';
                toggleScrollLock(false);
            }
            if (aboutModal && aboutModal.style.display === 'flex') {
                aboutModal.style.display = 'none';
                toggleScrollLock(false);
            }
            if (lightbox && lightbox.classList.contains('active')) closeLightboxFunc();
            if (nav && nav.classList.contains('nav-active')) toggleMenu();
        }
    });


    // --- 12. АНИМАЦИЯ ЧАСТИЦ (ИСПРАВЛЕНО) ---
    const particleContainer = document.getElementById('particleContainer');
    const phrases = ["без границ", "вдохновлять", "объединять", "жить", "творить"];
    let phraseIndex = 0;

    function createSpans(text) {
        return text.split('').map(char => {
            if (char === ' ') return '<span class="char space">&nbsp;</span>';
            return `<span class="char">${char}</span>`;
        }).join('');
    }

    function animateParticles() {
        if (!particleContainer) return;

        const currentChars = particleContainer.querySelectorAll('.char');
        currentChars.forEach(char => {
            const x = (Math.random() - 0.5) * 100; 
            const y = (Math.random() - 0.5) * 100;
            const r = (Math.random() - 0.5) * 360; 
            char.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
            char.style.opacity = '0';
            char.style.filter = 'blur(10px)';
        });

        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            const newText = phrases[phraseIndex];
            particleContainer.innerHTML = createSpans(newText);
            const newChars = particleContainer.querySelectorAll('.char');
            
            newChars.forEach(char => {
                const startX = (Math.random() - 0.5) * 150; 
                const startY = (Math.random() - 0.5) * 150;
                char.style.transition = 'none'; 
                char.style.transform = `translate(${startX}px, ${startY}px) scale(0.5)`;
                char.style.opacity = '0';
                char.style.filter = 'blur(15px)';
            });

            void particleContainer.offsetWidth; 

            newChars.forEach(char => {
                char.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; 
                char.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
                char.style.opacity = '1';
                char.style.filter = 'blur(0)';
            });
        }, 800); 

        setTimeout(animateParticles, 3500);
    }

    if (particleContainer) {
        particleContainer.innerHTML = createSpans(phrases[0]);
        setTimeout(animateParticles, 2000);
    }
});
