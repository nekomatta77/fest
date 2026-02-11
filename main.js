document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. НАСТРОЙКИ ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyGjX9KwxUFLxK-O2dxHhQHnJlpcfcEP6GKhwkjxb70K-P4xUMFTNtsr-eTPwXrEivr2w/exec'; 

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    window.toggleScrollLock = function(isLocked) {
        if (isLocked) {
            document.body.classList.add('lock-scroll');
        } else {
            document.body.classList.remove('lock-scroll');
        }
    };

    // --- 1. АНИМАЦИЯ ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


    // --- 2. МЕНЮ ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        overlay.classList.toggle('active'); 
        
        if (nav.classList.contains('nav-active')) {
            window.toggleScrollLock(true);
        } else {
            window.toggleScrollLock(false);
        }
    }

    if (burger) burger.addEventListener('click', toggleMenu);
    if (overlay) {
        overlay.addEventListener('click', () => {
            if(nav.classList.contains('nav-active')) toggleMenu();
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(nav.classList.contains('nav-active')) toggleMenu();
        });
    });


    // --- 3. СКРОЛЛ ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetId !== '#' && targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // --- 4. HEADER ---
    const heroContent = document.querySelector('.hero-content');
    const navbar = document.querySelector('.navbar');
    let isWindowScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isWindowScrolling) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (window.innerWidth > 768 && heroContent) {
                    heroContent.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
                }
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


    // --- 5. МНОГОШАГОВАЯ АНКЕТА ---
    const ticketModal = document.getElementById('ticketModal');
    const ticketForm = document.getElementById('ticketForm');
    
    // Элементы шагов
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const addPerfBtn = document.getElementById('addPerfBtn');
    const perfContainer = document.getElementById('performancesContainer');
    const submitBtn = document.getElementById('submitBtn');

    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.close-btn, .close-modal-action');

    // Функция открытия
    function openTicketModal() {
        if (!ticketModal) return;
        ticketModal.style.display = 'flex';
        document.getElementById('modalFormContainer').style.display = 'block';
        document.getElementById('modalSuccessContainer').style.display = 'none';
        
        // Сброс к первому шагу
        if(step1) step1.style.display = 'block';
        if(step2) step2.style.display = 'none';
        
        if (ticketForm) {
            ticketForm.reset();
            resetValidationStyles();
            // Сбрасываем номера и добавляем один пустой
            if(perfContainer) {
                perfContainer.innerHTML = '';
                addPerformanceRow(1);
            }
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Отправить заявку';
                submitBtn.style.opacity = '1';
            }
        }
        window.toggleScrollLock(true);
    }

    // Функция закрытия
    function closeTicketModal() {
        if (!ticketModal) return;
        ticketModal.style.display = 'none';
        window.toggleScrollLock(false);
    }

    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault(); openTicketModal();
    }));
    closeBtns.forEach(btn => btn.addEventListener('click', closeTicketModal));
    window.addEventListener('click', (e) => {
        if (e.target == ticketModal) closeTicketModal();
    });

    // Маска телефона
    const phoneInput = document.getElementById('phone');
    if(phoneInput) {
        phoneInput.addEventListener('input', handlePhoneMask);
        phoneInput.addEventListener('focus', handlePhoneMask);
        phoneInput.addEventListener('blur', handlePhoneMask);
    }
    function handlePhoneMask(e) {
        let el = e.target;
        let pattern = "+7 (___) ___-__-__";
        let def = "7"; 
        let val = el.value.replace(/\D/g, "");
        if (def.length >= val.length) val = def;
        el.value = matrix(pattern, def, val);
    }
    function matrix(pattern, def, val) {
        let i = 0;
        let v = val;
        if (val.length === 11 && val[0] === '8') v = '7' + val.slice(1);
        return pattern.replace(/[_\d]/g, function(a) {
            return i < v.length ? v.charAt(i++) : i >= v.length ? "" : a;
        });
    }
    function resetValidationStyles() {
        if(ticketForm) {
            ticketForm.querySelectorAll('input, select, textarea').forEach(inp => {
                inp.style.borderColor = '#e0e0e0';
            });
        }
    }

    // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ШАГОВ ---
    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Проверяем обязательные поля Шага 1
            const requiredStep1 = ['festDate', 'groupName', 'city', 'director', 'phone', 'email', 'participants', 'manager'];
            let isValid = true;
            requiredStep1.forEach(id => {
                const el = document.getElementById(id);
                if (el && !el.value.trim()) {
                    el.style.borderColor = 'red';
                    isValid = false;
                } else if(el) {
                    el.style.borderColor = '#4caf50';
                }
            });

            if(!isValid) {
                alert("Пожалуйста, заполните все обязательные поля (со звездочкой *) на этом шаге.");
                // Скролл к ошибке
                const errorEl = ticketForm.querySelector('[style*="border-color: red"]');
                if(errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Переключаем шаги
            step1.style.display = 'none';
            step2.style.display = 'block';
            // Прокрутка формы наверх
            ticketForm.scrollTop = 0;
        });
    }

    if(backBtn) {
        backBtn.addEventListener('click', () => {
            step2.style.display = 'none';
            step1.style.display = 'block';
        });
    }

    // --- ЛОГИКА ДИНАМИЧЕСКИХ НОМЕРОВ ---
    function addPerformanceRow(index) {
        const div = document.createElement('div');
        div.className = 'perf-card';
        div.innerHTML = `
            <span class="perf-title"># Номер ${index}</span>
            ${index > 1 ? '<i class="fas fa-times perf-remove" title="Удалить номер"></i>' : ''}
            
            <div class="input-group">
                <input type="text" class="perf-name" placeholder="Название номера / ФИО солиста" required>
            </div>
            <div class="perf-grid">
                <input type="text" class="perf-nom" placeholder="Номинация" required>
                <input type="text" class="perf-age" placeholder="Возрастная категория" required>
            </div>
            <div class="perf-grid">
                <input type="text" class="perf-qty" placeholder="Кол-во участников на сцене" required>
                <input type="text" class="perf-point" placeholder="С точки / Выхода">
            </div>
            <div class="input-group" style="margin-top: 10px;">
                <input type="text" class="perf-time" placeholder="Время исполнения (мин:сек)" required>
            </div>
        `;
        
        // Кнопка удаления
        const removeBtn = div.querySelector('.perf-remove');
        if(removeBtn) {
            removeBtn.addEventListener('click', () => {
                div.remove();
                // Пересчет номеров после удаления (опционально, но красиво)
                updatePerformanceIndices();
            });
        }

        perfContainer.appendChild(div);
    }

    function updatePerformanceIndices() {
        const cards = perfContainer.querySelectorAll('.perf-card');
        cards.forEach((card, i) => {
            const title = card.querySelector('.perf-title');
            if(title) title.innerText = `# Номер ${i + 1}`;
        });
    }

    if(addPerfBtn) {
        addPerfBtn.addEventListener('click', () => {
            const count = perfContainer.querySelectorAll('.perf-card').length + 1;
            addPerformanceRow(count);
        });
    }

    // --- ОТПРАВКА ДАННЫХ ---
    if (ticketForm) {
        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Сбор данных Шага 1
            const formData = {
                festDate: document.getElementById('festDate').value,
                groupName: document.getElementById('groupName').value,
                city: document.getElementById('city').value,
                director: document.getElementById('director').value,
                teacher: document.getElementById('teacher').value,
                tutor: document.getElementById('tutor').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                socials: document.getElementById('socials').value,
                participants: document.getElementById('participants').value,
                accompanying: document.getElementById('accompanying').value,
                manager: document.getElementById('manager').value,
                grant: document.getElementById('grant').value,
                performances: [] // Массив для номеров
            };

            // 2. Сбор данных Шага 2
            const perfCards = perfContainer.querySelectorAll('.perf-card');
            
            if(perfCards.length === 0) {
                alert("Добавьте хотя бы один номер в программу!");
                return;
            }

            let perfValid = true;
            perfCards.forEach(card => {
                const name = card.querySelector('.perf-name').value;
                const nom = card.querySelector('.perf-nom').value;
                
                // Простая валидация (проверяем хотя бы название)
                if(!name.trim()) {
                    perfValid = false;
                    card.querySelector('.perf-name').style.borderColor = 'red';
                } else {
                    card.querySelector('.perf-name').style.borderColor = '#e0e0e0';
                }

                // Добавляем в массив
                formData.performances.push({
                    name: name,
                    nomination: nom,
                    age: card.querySelector('.perf-age').value,
                    qty: card.querySelector('.perf-qty').value,
                    point: card.querySelector('.perf-point').value,
                    time: card.querySelector('.perf-time').value
                });
            });

            if(!perfValid) {
                alert("Заполните названия номеров!");
                return;
            }

            // 3. Отправка
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Отправка...';
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.style.opacity = '0.6';

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(() => {
                // Успех
                submitBtn.innerText = originalText;
                submitBtn.removeAttribute('disabled');
                
                document.getElementById('modalFormContainer').style.display = 'none';
                document.getElementById('modalSuccessContainer').style.display = 'block';
                
                ticketForm.reset();
            })
            .catch(err => {
                console.error(err);
                alert("Ошибка при отправке. Попробуйте позже.");
                submitBtn.innerText = originalText;
                submitBtn.removeAttribute('disabled');
                submitBtn.style.opacity = '1';
            });
        });
    }


    // --- 6. ГАЛЕРЕЯ ---
    const galleryPath = 'assets/galery/';
    const track = document.getElementById('galleryTrack');
    const fullGrid = document.getElementById('fullGalleryGrid');
    const openGalleryBtn = document.getElementById('openGalleryBtn');

    function createImgElement(index, className) {
        const imgEl = document.createElement('img');
        imgEl.src = `${galleryPath}photo${index}.png`;
        imgEl.alt = `Фото ${index}`;
        imgEl.classList.add(className);
        imgEl.loading = "lazy";
        imgEl.onerror = function() { this.style.display = 'none'; };
        return imgEl;
    }

    if(track) {
        for (let i = 1; i <= 10; i++) track.appendChild(createImgElement(i, 'gallery-img-thumb'));
    }

    let galleryLoaded = false;
    if(openGalleryBtn) {
        openGalleryBtn.innerText = "Смотреть все фото";
        openGalleryBtn.addEventListener('click', () => {
             if(!galleryLoaded && fullGrid) {
                for (let i = 1; i <= 27; i++) fullGrid.appendChild(createImgElement(i, 'gallery-grid-img'));
                galleryLoaded = true;
            }
        });
    }

    // --- 7. МОДАЛКА ГАЛЕРЕИ ---
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryBtn = document.querySelector('.close-gallery-btn');
    
    if(openGalleryBtn && galleryModal) {
        openGalleryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            galleryModal.style.display = 'flex';
            window.toggleScrollLock(true);
        });
    }
    if(closeGalleryBtn && galleryModal) {
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.style.display = 'none';
            window.toggleScrollLock(false);
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target == galleryModal) {
            galleryModal.style.display = 'none';
            window.toggleScrollLock(false);
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
        window.toggleScrollLock(true);
        resetState();
    }
    function closeLightboxFunc() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        setTimeout(() => { lightbox.style.display = 'none'; }, 300);
        window.toggleScrollLock(false);
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
    
    if (lightbox) {
        lightbox.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = -e.deltaY;
            (delta > 0) ? (state.scale *= 1.1) : (state.scale /= 1.1);
            if(state.scale > 5) state.scale = 5;
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
            if(state.scale <= 1.05) { state.scale = 1; state.x = 0; state.y = 0; }
            updateTransform();
        });
        window.addEventListener('mousemove', (e) => {
            if (!state.panning) return;
            e.preventDefault();
            state.x = e.clientX - state.startX;
            state.y = e.clientY - state.startY;
            updateTransform();
        });
        // Mobile touch logic omitted for brevity (preserved from previous)
        let initialDistance = 0, initialScale = 1;
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
                const current = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                if (initialDistance > 0) {
                    state.scale = initialScale * (current / initialDistance);
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
             if(state.scale <= 1.05) { state.scale = 1; state.x = 0; state.y = 0; }
             updateTransform();
        });
    }

    // --- 9. О НАС ---
    const aboutModal = document.getElementById('aboutModal');
    const openAboutBtn = document.getElementById('openAboutBtn');
    const closeAboutBtn = document.querySelector('.about-close-btn');
    const aboutTabs = document.querySelectorAll('.about-tab-btn');
    const aboutTitle = document.getElementById('aboutTitle');
    const aboutText = document.getElementById('aboutText');
    const aboutData = {
        1: { title: "Честное судейство", text: "Наши эксперты серьёзно относятся к конкурсной программе, поэтому не раздают призовые места просто так." },
        2: { title: "Круглые столы", text: "Мы предоставляем для наших руководителей возможность побеседовать с членами жюри." },
        3: { title: "Четкий тайминг", text: "Мы готовим программу подсчитывая каждый час, минуту, секунду..." }
    };

    if(openAboutBtn) {
        openAboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(aboutModal) {
                aboutModal.style.display = 'flex';
                window.toggleScrollLock(true);
            }
        });
    }
    if(closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => {
            if(aboutModal) {
                aboutModal.style.display = 'none';
                window.toggleScrollLock(false);
            }
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target == aboutModal) {
            aboutModal.style.display = 'none';
            window.toggleScrollLock(false);
        }
    });
    aboutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            aboutTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const data = aboutData[tab.getAttribute('data-tab')];
            aboutTitle.style.opacity = 0;
            aboutText.style.opacity = 0;
            setTimeout(() => {
                aboutTitle.innerText = data.title;
                aboutText.innerText = data.text;
                aboutTitle.style.opacity = 1;
                aboutText.style.opacity = 1;
            }, 200);
        });
    });

    // --- 10. LOGO ---
    const logoImg = document.querySelector('.logo-img');
    if(logoImg) {
        logoImg.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'rotate(70deg)';
            setTimeout(() => { this.style.transform = 'rotate(0deg)'; }, 600);
        });
    }

    // --- 11. ESC ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (ticketModal?.style.display === 'flex') closeTicketModal();
            if (galleryModal?.style.display === 'flex') { galleryModal.style.display = 'none'; window.toggleScrollLock(false); }
            if (aboutModal?.style.display === 'flex') { aboutModal.style.display = 'none'; window.toggleScrollLock(false); }
            if (lightbox?.classList.contains('active')) closeLightboxFunc();
            if (nav?.classList.contains('nav-active')) toggleMenu();
        }
    });

    // --- 12. ЧАСТИЦЫ ---
    const particleContainer = document.getElementById('particleContainer');
    const phrases = ["без границ", "вдохновлять", "объединять", "жить", "творить"];
    let phraseIndex = 0;
    function createSpans(text) {
        return text.split('').map(char => char === ' ' ? '<span class="char space">&nbsp;</span>' : `<span class="char">${char}</span>`).join('');
    }
    function animateParticles() {
        if (!particleContainer) return;
        particleContainer.querySelectorAll('.char').forEach(char => {
            char.style.transform = `translate(${(Math.random()-0.5)*100}px, ${(Math.random()-0.5)*100}px) rotate(${(Math.random()-0.5)*360}deg)`;
            char.style.opacity = '0';
            char.style.filter = 'blur(10px)';
        });
        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            particleContainer.innerHTML = createSpans(phrases[phraseIndex]);
            const newChars = particleContainer.querySelectorAll('.char');
            newChars.forEach(char => {
                char.style.transition = 'none'; 
                char.style.transform = `translate(${(Math.random()-0.5)*150}px, ${(Math.random()-0.5)*150}px) scale(0.5)`;
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