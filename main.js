document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. НАСТРОЙКИ ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPC_SmZgmarXuSLuEDlLqxlYGrVxTgwOBfoI3iV7OK6pJdgWko0tpqWZhJqjYaUVvNJg/exec'; 

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
    
    // Элементы навигации
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    const nextBtn1 = document.getElementById('nextBtn1'); // 1 -> 2
    const nextBtn2 = document.getElementById('nextBtn2'); // 2 -> 3
    const backBtn2 = document.getElementById('backBtn2'); // 2 -> 1
    const backBtn3 = document.getElementById('backBtn3'); // 3 -> 2
    
    const submitBtn = document.getElementById('submitBtn');

    // Элементы Шага 2 (Программа)
    const addPerfBtn = document.getElementById('addPerfBtn');
    const perfContainer = document.getElementById('performancesContainer');

    // Элементы Шага 3 (Награды)
    const awardTypeSelect = document.getElementById('awardTypeSelect');
    const awardInputArea = document.getElementById('awardInputArea');
    const diplomaDetails = document.getElementById('diplomaDetails');
    const awardPerfName = document.getElementById('awardPerfName');
    const awardQty = document.getElementById('awardQty');
    
    // Для дипломов
    const diplomaParticipantName = document.getElementById('diplomaParticipantName');
    const addDiplomaNameBtn = document.getElementById('addDiplomaNameBtn');
    const diplomaNamesList = document.getElementById('diplomaNamesList');
    
    // Общий список наград и кнопка добавления
    const addAwardToListBtn = document.getElementById('addAwardToListBtn');
    const awardsListContainer = document.getElementById('awardsListContainer');

    // Временное хранилище имен для текущего ввода диплома
    let tempDiplomaNames = []; 

    // Модальное окно
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.close-btn, .close-modal-action');

    function openTicketModal() {
        if (!ticketModal) return;
        ticketModal.style.display = 'flex';
        document.getElementById('modalFormContainer').style.display = 'block';
        document.getElementById('modalSuccessContainer').style.display = 'none';
        
        // Сброс на шаг 1
        step1.style.display = 'block';
        step2.style.display = 'none';
        step3.style.display = 'none';
        
        if (ticketForm) {
            ticketForm.reset();
            resetValidationStyles();
            // Сброс номеров
            if(perfContainer) { perfContainer.innerHTML = ''; addPerformanceRow(1); }
            // Сброс наград
            if(awardsListContainer) { awardsListContainer.innerHTML = ''; }
            if(submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Отправить все'; submitBtn.style.opacity = '1'; }
            
            // Сброс полей наград
            awardTypeSelect.value = 'none';
            awardInputArea.style.display = 'none';
            tempDiplomaNames = [];
            renderDiplomaNames();
        }
        window.toggleScrollLock(true);
    }

    function closeTicketModal() {
        if (!ticketModal) return;
        ticketModal.style.display = 'none';
        window.toggleScrollLock(false);
    }

    openBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openTicketModal(); }));
    closeBtns.forEach(btn => btn.addEventListener('click', closeTicketModal));
    window.addEventListener('click', (e) => { if (e.target == ticketModal) closeTicketModal(); });

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
        let def = "7"; let val = el.value.replace(/\D/g, "");
        if (def.length >= val.length) val = def;
        el.value = matrix(pattern, def, val);
    }
    function matrix(pattern, def, val) {
        let i = 0; let v = val; if (val.length === 11 && val[0] === '8') v = '7' + val.slice(1);
        return pattern.replace(/[_\d]/g, function(a) { return i < v.length ? v.charAt(i++) : i >= v.length ? "" : a; });
    }
    function resetValidationStyles() {
        if(ticketForm) ticketForm.querySelectorAll('input, select, textarea').forEach(inp => inp.style.borderColor = '#e0e0e0');
    }

    // === НАВИГАЦИЯ МЕЖДУ ШАГАМИ ===
    
    // 1 -> 2
    if(nextBtn1) {
        nextBtn1.addEventListener('click', () => {
            // УБРАЛ 'email' ИЗ СПИСКА ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ
            const requiredStep1 = ['festDate', 'groupName', 'city', 'director', 'phone', 'participants', 'manager'];
            let isValid = true;
            requiredStep1.forEach(id => {
                const el = document.getElementById(id);
                if (el && !el.value.trim()) { el.style.borderColor = 'red'; isValid = false; } 
                else if(el) { el.style.borderColor = '#4caf50'; }
            });
            if(!isValid) {
                alert("Заполните обязательные поля (*) на Шаге 1");
                return;
            }
            step1.style.display = 'none'; step2.style.display = 'block'; ticketForm.scrollTop = 0;
        });
    }

    // 2 -> 1
    if(backBtn2) { backBtn2.addEventListener('click', () => { step2.style.display = 'none'; step1.style.display = 'block'; }); }

    // 2 -> 3 (Проверка номеров)
    if(nextBtn2) {
        nextBtn2.addEventListener('click', () => {
            const perfCards = perfContainer.querySelectorAll('.perf-card');
            if(perfCards.length === 0) { alert("Добавьте хотя бы один номер!"); return; }
            let perfValid = true;
            perfCards.forEach(card => {
                const name = card.querySelector('.perf-name').value;
                if(!name.trim()) { perfValid = false; card.querySelector('.perf-name').style.borderColor = 'red'; }
                else { card.querySelector('.perf-name').style.borderColor = '#e0e0e0'; }
            });
            if(!perfValid) { alert("Заполните названия номеров!"); return; }
            
            step2.style.display = 'none'; step3.style.display = 'block'; ticketForm.scrollTop = 0;
        });
    }

    // 3 -> 2
    if(backBtn3) { backBtn3.addEventListener('click', () => { step3.style.display = 'none'; step2.style.display = 'block'; }); }


    // === ЛОГИКА ШАГА 2 (НОМЕРА) ===
    function addPerformanceRow(index) {
        const div = document.createElement('div');
        div.className = 'perf-card';
        div.innerHTML = `
            <span class="perf-title"># Номер ${index}</span>
            ${index > 1 ? '<i class="fas fa-times perf-remove"></i>' : ''}
            <div class="input-group"><input type="text" class="perf-name" placeholder="Название номера / ФИО солиста" required></div>
            <div class="perf-grid">
                <input type="text" class="perf-nom" placeholder="Номинация" required>
                <input type="text" class="perf-age" placeholder="Возраст" required>
            </div>
            <div class="perf-grid">
                <input type="text" class="perf-qty" placeholder="Кол-во чел." required>
                <input type="text" class="perf-point" placeholder="Точка">
            </div>
            <div class="input-group" style="margin-top: 10px;"><input type="text" class="perf-time" placeholder="Время (мин:сек)" required></div>
        `;
        const removeBtn = div.querySelector('.perf-remove');
        if(removeBtn) removeBtn.addEventListener('click', () => { div.remove(); updatePerformanceIndices(); });
        perfContainer.appendChild(div);
    }
    function updatePerformanceIndices() {
        perfContainer.querySelectorAll('.perf-card').forEach((card, i) => {
            const title = card.querySelector('.perf-title'); if(title) title.innerText = `# Номер ${i + 1}`;
        });
    }
    if(addPerfBtn) addPerfBtn.addEventListener('click', () => {
        addPerformanceRow(perfContainer.querySelectorAll('.perf-card').length + 1);
    });


    // === ЛОГИКА ШАГА 3 (НАГРАДЫ) ===
    
    // Смена типа награды
    if(awardTypeSelect) {
        awardTypeSelect.addEventListener('change', () => {
            const type = awardTypeSelect.value;
            if(type === 'none') {
                awardInputArea.style.display = 'none';
            } else {
                awardInputArea.style.display = 'block';
                // Очищаем поля
                awardPerfName.value = '';
                awardQty.value = '';
                tempDiplomaNames = [];
                renderDiplomaNames();
                
                // Логика отображения блока с именами
                if(type === 'diploma') {
                    diplomaDetails.style.display = 'block';
                    awardQty.placeholder = "Общее кол-во дипломов";
                } else {
                    diplomaDetails.style.display = 'none';
                    awardQty.placeholder = "Количество штук";
                }
            }
        });
    }

    // Добавление имени участника (для диплома)
    if(addDiplomaNameBtn) {
        addDiplomaNameBtn.addEventListener('click', () => {
            const name = diplomaParticipantName.value.trim();
            if(name) {
                tempDiplomaNames.push(name);
                diplomaParticipantName.value = '';
                renderDiplomaNames();
            }
        });
    }

    function renderDiplomaNames() {
        diplomaNamesList.innerHTML = '';
        tempDiplomaNames.forEach((name, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `${name} <span style="color:red; cursor:pointer; margin-left:5px;">&times;</span>`;
            li.querySelector('span').addEventListener('click', () => {
                tempDiplomaNames.splice(idx, 1);
                renderDiplomaNames();
            });
            diplomaNamesList.appendChild(li);
        });
    }

    // Добавление заявки на награду в список
    if(addAwardToListBtn) {
        addAwardToListBtn.addEventListener('click', () => {
            const type = awardTypeSelect.value;
            const perf = awardPerfName.value.trim();
            let qty = awardQty.value.trim();
            
            // Валидация
            if(!perf) { alert("Укажите название номера!"); return; }
            
            // Для дипломов: если кол-во пустое, ставим равным списку имен или 1
            if(type === 'diploma' && !qty) {
                qty = tempDiplomaNames.length > 0 ? tempDiplomaNames.length : 1;
            } else if(!qty) {
                qty = 1; 
            }

            // Формируем текст деталей
            let typeLabel = "";
            let details = "";
            
            if(type === 'medal') typeLabel = "Медаль";
            if(type === 'cup') typeLabel = "Кубок";
            if(type === 'diploma') {
                typeLabel = "Диплом";
                details = tempDiplomaNames.length > 0 ? tempDiplomaNames.join(', ') : "Без имен";
            }

            // Создаем визуальную карточку
            const div = document.createElement('div');
            div.className = 'perf-card'; // Используем тот же стиль
            div.style.borderColor = '#6e85b7';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between;">
                    <strong>${typeLabel}</strong>
                    <i class="fas fa-times perf-remove" style="position:static;"></i>
                </div>
                <div>Номер: ${perf}</div>
                ${details ? `<div style="font-size:0.9rem; color:#666;">${details}</div>` : ''}
                <div style="text-align:right; font-weight:bold;">Кол-во: ${qty}</div>
                
                <input type="hidden" class="aw-type" value="${typeLabel}">
                <input type="hidden" class="aw-perf" value="${perf}">
                <input type="hidden" class="aw-details" value="${details}">
                <input type="hidden" class="aw-qty" value="${qty}">
            `;
            
            div.querySelector('.perf-remove').addEventListener('click', () => div.remove());
            awardsListContainer.appendChild(div);

            // Очистка формы
            awardPerfName.value = '';
            awardQty.value = '';
            tempDiplomaNames = [];
            renderDiplomaNames();
            diplomaParticipantName.value = '';
        });
    }


    // --- ОТПРАВКА ВСЕХ ДАННЫХ ---
    if (ticketForm) {
        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Данные Шага 1
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
                performances: [],
                awards: [] 
            };

            // 2. Данные Шага 2 (Номера)
            const perfCards = perfContainer.querySelectorAll('.perf-card');
            perfCards.forEach(card => {
                formData.performances.push({
                    name: card.querySelector('.perf-name').value,
                    nomination: card.querySelector('.perf-nom').value,
                    age: card.querySelector('.perf-age').value,
                    qty: card.querySelector('.perf-qty').value,
                    point: card.querySelector('.perf-point').value,
                    time: card.querySelector('.perf-time').value
                });
            });

            // 3. Данные Шага 3 (Награды)
            const awCards = awardsListContainer.querySelectorAll('.perf-card');
            awCards.forEach(card => {
                formData.awards.push({
                    type: card.querySelector('.aw-type').value,
                    perfName: card.querySelector('.aw-perf').value,
                    details: card.querySelector('.aw-details').value,
                    totalQty: card.querySelector('.aw-qty').value
                });
            });

            // Отправка
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Отправка...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                document.getElementById('modalFormContainer').style.display = 'none';
                document.getElementById('modalSuccessContainer').style.display = 'block';
                ticketForm.reset();
            })
            .catch(err => {
                console.error(err);
                alert("Ошибка при отправке.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }


    // --- 6. ГАЛЕРЕЯ (ОСТАЛЬНОЕ БЕЗ ИЗМЕНЕНИЙ) ---
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
        openGalleryBtn.addEventListener('click', (e) => { e.preventDefault(); galleryModal.style.display = 'flex'; window.toggleScrollLock(true); });
    }
    if(closeGalleryBtn && galleryModal) {
        closeGalleryBtn.addEventListener('click', () => { galleryModal.style.display = 'none'; window.toggleScrollLock(false); });
    }
    window.addEventListener('click', (e) => { if (e.target == galleryModal) { galleryModal.style.display = 'none'; window.toggleScrollLock(false); } });

    // --- 8. LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.querySelector('.close-lightbox');
    let state = { scale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0, x: 0, y: 0 };

    function openLightbox(src) { if (!lightbox) return; lightboxImg.src = src; lightbox.classList.add('active'); lightbox.style.display = 'flex'; window.toggleScrollLock(true); resetState(); }
    function closeLightboxFunc() { if (!lightbox) return; lightbox.classList.remove('active'); setTimeout(() => { lightbox.style.display = 'none'; }, 300); window.toggleScrollLock(false); }
    function resetState() { state = { scale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0, x: 0, y: 0 }; updateTransform(); }
    function updateTransform() { if (!lightboxImg) return; lightboxImg.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`; }
    function attachLightboxEvents(container) { if (!container) return; container.addEventListener('click', (e) => { if(e.target.tagName === 'IMG') openLightbox(e.target.src); }); }
    
    attachLightboxEvents(track); attachLightboxEvents(fullGrid);
    if(closeLightbox) closeLightbox.addEventListener('click', closeLightboxFunc);
    
    if (lightbox) {
        lightbox.addEventListener('wheel', (e) => {
            e.preventDefault(); const delta = -e.deltaY; (delta > 0) ? (state.scale *= 1.1) : (state.scale /= 1.1);
            if(state.scale > 5) state.scale = 5; if(state.scale <= 1) { state.x = 0; state.y = 0; } updateTransform();
        }, { passive: false });
        lightboxImg.addEventListener('mousedown', (e) => { e.preventDefault(); if(state.scale > 1) { state.startX = e.clientX - state.x; state.startY = e.clientY - state.y; state.panning = true; lightboxImg.style.cursor = 'grabbing'; lightboxImg.style.transition = 'none'; } });
        window.addEventListener('mouseup', () => { if (!state.panning) return; state.panning = false; lightboxImg.style.cursor = 'grab'; lightboxImg.style.transition = 'transform 0.3s ease-out'; if(state.scale <= 1.05) { state.scale = 1; state.x = 0; state.y = 0; } updateTransform(); });
        window.addEventListener('mousemove', (e) => { if (!state.panning) return; e.preventDefault(); state.x = e.clientX - state.startX; state.y = e.clientY - state.startY; updateTransform(); });
        let initialDistance = 0, initialScale = 1;
        lightbox.addEventListener('touchstart', (e) => { if (e.touches.length === 2) { initialDistance = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY); initialScale = state.scale; lightboxImg.style.transition = 'none'; } else if (e.touches.length === 1 && state.scale > 1) { state.startX = e.touches[0].clientX - state.x; state.startY = e.touches[0].clientY - state.y; state.panning = true; lightboxImg.style.transition = 'none'; } });
        lightbox.addEventListener('touchmove', (e) => { e.preventDefault(); if (e.touches.length === 2) { const current = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY); if (initialDistance > 0) { state.scale = initialScale * (current / initialDistance); if(state.scale > 5) state.scale = 5; updateTransform(); } } else if (e.touches.length === 1 && state.panning && state.scale > 1) { state.x = e.touches[0].clientX - state.startX; state.y = e.touches[0].clientY - state.startY; updateTransform(); } }, { passive: false });
        lightbox.addEventListener('touchend', (e) => { if(e.touches.length < 2) initialDistance = 0; if(e.touches.length === 0) state.panning = false; lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; if(state.scale <= 1.05) { state.scale = 1; state.x = 0; state.y = 0; } updateTransform(); });
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
    if(openAboutBtn) openAboutBtn.addEventListener('click', (e) => { e.preventDefault(); if(aboutModal) { aboutModal.style.display = 'flex'; window.toggleScrollLock(true); } });
    if(closeAboutBtn) closeAboutBtn.addEventListener('click', () => { if(aboutModal) { aboutModal.style.display = 'none'; window.toggleScrollLock(false); } });
    window.addEventListener('click', (e) => { if (e.target == aboutModal) { aboutModal.style.display = 'none'; window.toggleScrollLock(false); } });
    aboutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            aboutTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
            const data = aboutData[tab.getAttribute('data-tab')];
            aboutTitle.style.opacity = 0; aboutText.style.opacity = 0;
            setTimeout(() => { aboutTitle.innerText = data.title; aboutText.innerText = data.text; aboutTitle.style.opacity = 1; aboutText.style.opacity = 1; }, 200);
        });
    });

    // --- 10. LOGO ---
    const logoImg = document.querySelector('.logo-img');
    if(logoImg) logoImg.addEventListener('click', function(e) { e.preventDefault(); this.style.transform = 'rotate(70deg)'; setTimeout(() => { this.style.transform = 'rotate(0deg)'; }, 600); });

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
    function createSpans(text) { return text.split('').map(char => char === ' ' ? '<span class="char space">&nbsp;</span>' : `<span class="char">${char}</span>`).join(''); }
    function animateParticles() {
        if (!particleContainer) return;
        particleContainer.querySelectorAll('.char').forEach(char => { char.style.transform = `translate(${(Math.random()-0.5)*100}px, ${(Math.random()-0.5)*100}px) rotate(${(Math.random()-0.5)*360}deg)`; char.style.opacity = '0'; char.style.filter = 'blur(10px)'; });
        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            particleContainer.innerHTML = createSpans(phrases[phraseIndex]);
            const newChars = particleContainer.querySelectorAll('.char');
            newChars.forEach(char => { char.style.transition = 'none'; char.style.transform = `translate(${(Math.random()-0.5)*150}px, ${(Math.random()-0.5)*150}px) scale(0.5)`; char.style.opacity = '0'; char.style.filter = 'blur(15px)'; });
            void particleContainer.offsetWidth; 
            newChars.forEach(char => { char.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; char.style.transform = 'translate(0, 0) scale(1) rotate(0deg)'; char.style.opacity = '1'; char.style.filter = 'blur(0)'; });
        }, 800); 
        setTimeout(animateParticles, 3500);
    }
    if (particleContainer) { particleContainer.innerHTML = createSpans(phrases[0]); setTimeout(animateParticles, 2000); }
});