document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. НАСТРОЙКИ ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzX1JAIaq90wJeCcvBO_WDvX4n24SgojD9yIMV1doETUWhVALMbzAXAWYKMNs-wkRYEtA/exec'; 

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
    
    // Переменная состояния: false = местный, true = иногородний
    let isRemote = false;

    // Шаги
    const stepSelection = document.getElementById('stepSelection');
    const step1_local = document.getElementById('step1_local');
    const step1_remote = document.getElementById('step1_remote');
    const step2_remote = document.getElementById('step2_remote');
    const step_program = document.getElementById('step_program');
    const step_awards = document.getElementById('step_awards');

    // Кнопки выбора
    const btnSelectLocal = document.getElementById('btnSelectLocal');
    const btnSelectRemote = document.getElementById('btnSelectRemote');

    // Навигация
    const backToSel_local = document.getElementById('backToSel_local');
    const nextBtn1_local = document.getElementById('nextBtn1_local');
    
    const backToSel_remote = document.getElementById('backToSel_remote');
    const nextBtn1_remote = document.getElementById('nextBtn1_remote');
    const backBtn2_remote = document.getElementById('backBtn2_remote');
    const nextBtn2_remote = document.getElementById('nextBtn2_remote'); // Переход к программе (Шаг 3)

    const backBtn_program = document.getElementById('backBtn_program');
    const nextBtn_program = document.getElementById('nextBtn_program');
    
    const backBtn_awards = document.getElementById('backBtn_awards');
    const submitBtn = document.getElementById('submitBtn');

    // Контейнеры динамических полей
    const perfContainer = document.getElementById('performancesContainer');
    const accoContainer = document.getElementById('accommodationContainer');
    const awardsListContainer = document.getElementById('awardsListContainer');
    const addPerfBtn = document.getElementById('addPerfBtn');
    const addAccoBtn = document.getElementById('addAccoBtn'); // Кнопка для проживания

    // Элементы наград
    const awardTypeSelect = document.getElementById('awardTypeSelect');
    const awardInputArea = document.getElementById('awardInputArea');
    const diplomaDetails = document.getElementById('diplomaDetails');
    const awardPerfName = document.getElementById('awardPerfName');
    const awardQty = document.getElementById('awardQty');
    const diplomaParticipantName = document.getElementById('diplomaParticipantName');
    const addDiplomaNameBtn = document.getElementById('addDiplomaNameBtn');
    const diplomaNamesList = document.getElementById('diplomaNamesList');
    const addAwardToListBtn = document.getElementById('addAwardToListBtn');
    let tempDiplomaNames = []; 

    // Модальное окно
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.close-btn, .close-modal-action');

    function openTicketModal() {
        if (!ticketModal) return;
        ticketModal.style.display = 'flex';
        document.getElementById('modalFormContainer').style.display = 'block';
        document.getElementById('modalSuccessContainer').style.display = 'none';
        
        // Сброс к выбору
        showStep(stepSelection);
        
        if (ticketForm) {
            ticketForm.reset();
            resetValidationStyles();
            // Сброс списков
            if(perfContainer) { perfContainer.innerHTML = ''; addPerformanceRow(1); }
            if(accoContainer) { accoContainer.innerHTML = ''; addAccommodationRow(1); }
            if(awardsListContainer) { awardsListContainer.innerHTML = ''; }
            
            if(submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Отправить все'; submitBtn.style.opacity = '1'; }
            
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

    // Вспомогательная функция показа шага
    function showStep(stepElement) {
        [stepSelection, step1_local, step1_remote, step2_remote, step_program, step_awards].forEach(el => {
            if(el) el.style.display = 'none';
        });
        if(stepElement) stepElement.style.display = 'block';
        if(ticketForm) ticketForm.scrollTop = 0;
    }

    openBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openTicketModal(); }));
    closeBtns.forEach(btn => btn.addEventListener('click', closeTicketModal));
    window.addEventListener('click', (e) => { if (e.target == ticketModal) closeTicketModal(); });

    // Маски для всех телефонов
    const phoneInputs = document.querySelectorAll('.phone-mask');
    phoneInputs.forEach(inp => {
        inp.addEventListener('input', handlePhoneMask);
        inp.addEventListener('focus', handlePhoneMask);
        inp.addEventListener('blur', handlePhoneMask);
    });

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


    // === ЛОГИКА ПЕРЕКЛЮЧЕНИЙ ===

    // 0. Выбор типа
    if(btnSelectLocal) btnSelectLocal.addEventListener('click', () => { isRemote = false; showStep(step1_local); });
    if(btnSelectRemote) btnSelectRemote.addEventListener('click', () => { isRemote = true; showStep(step1_remote); });

    // 1. Местные: Шаг 1 -> Программа
    if(nextBtn1_local) {
        nextBtn1_local.addEventListener('click', () => {
            const required = ['festDate_local', 'groupName_local', 'city_local', 'director_local', 'phone_local', 'participants_local', 'manager_local'];
            if(validateFields(required)) showStep(step_program);
        });
    }
    if(backToSel_local) backToSel_local.addEventListener('click', () => showStep(stepSelection));

    // 1. Иногородние: Шаг 1 -> Шаг 2 (Проживание)
    if(nextBtn1_remote) {
        nextBtn1_remote.addEventListener('click', () => {
            const required = ['festDate_remote', 'groupName_remote', 'city_remote', 'director_remote', 'phone_remote', 'participants_remote', 'manager_remote'];
            if(validateFields(required)) showStep(step2_remote);
        });
    }
    if(backToSel_remote) backToSel_remote.addEventListener('click', () => showStep(stepSelection));

    // 2. Иногородние: Шаг 2 (Проживание) -> Программа
    if(nextBtn2_remote) {
        nextBtn2_remote.addEventListener('click', () => {
            // Проверка, что добавлен хотя бы один пакет
            const accoCards = accoContainer.querySelectorAll('.acco-card');
            if(accoCards.length === 0) { alert("Добавьте информацию о проживании!"); return; }
            showStep(step_program);
        });
    }
    if(backBtn2_remote) backBtn2_remote.addEventListener('click', () => showStep(step1_remote));

    // 3. Программа -> Награды (Общая логика)
    if(nextBtn_program) {
        nextBtn_program.addEventListener('click', () => {
            const perfCards = perfContainer.querySelectorAll('.perf-card');
            if(perfCards.length === 0) { alert("Добавьте хотя бы один номер!"); return; }
            let perfValid = true;
            perfCards.forEach(card => {
                const name = card.querySelector('.perf-name').value;
                if(!name.trim()) { perfValid = false; card.querySelector('.perf-name').style.borderColor = 'red'; }
                else { card.querySelector('.perf-name').style.borderColor = '#e0e0e0'; }
            });
            if(!perfValid) { alert("Заполните названия номеров!"); return; }
            showStep(step_awards);
        });
    }
    if(backBtn_program) {
        backBtn_program.addEventListener('click', () => {
            // Если иногородние - назад на Шаг 2 (проживание), если местные - назад на Шаг 1 (общие)
            if(isRemote) showStep(step2_remote);
            else showStep(step1_local);
        });
    }

    // 4. Награды -> Назад
    if(backBtn_awards) backBtn_awards.addEventListener('click', () => showStep(step_program));

    function validateFields(ids) {
        let isValid = true;
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.value.trim()) { el.style.borderColor = 'red'; isValid = false; } 
            else if(el) { el.style.borderColor = '#4caf50'; }
        });
        if(!isValid) alert("Заполните обязательные поля (*)");
        return isValid;
    }


    // === ЛОГИКА НОМЕРОВ (ОБЩАЯ) ===
    function addPerformanceRow(index) {
        const div = document.createElement('div');
        div.className = 'perf-card';
        // ЗАДАЧА 1: "Точка" изменена на "Точка/Выход"
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
                <input type="text" class="perf-point" placeholder="Точка/Выход"> </div>
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

    // === ЛОГИКА ПРОЖИВАНИЯ (НОВОЕ ДЛЯ ИНОГОРОДНИХ) ===
    function addAccommodationRow(index) {
        const div = document.createElement('div');
        div.className = 'acco-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>Группа ${index}</h4>
                ${index > 1 ? '<i class="fas fa-times perf-remove" style="color:red; cursor:pointer;"></i>' : ''}
            </div>
            
            <label class="form-label">1. Пакет участия</label>
            <div class="input-group">
                <select class="acco-package">
                    <option value="Эконом">Эконом</option>
                    <option value="Стандарт">Стандарт</option>
                    <option value="Полный">Полный</option>
                    <option value="Премиум">Премиум</option>
                </select>
            </div>

            <label class="form-label">2. ФИО Участников (Паспорт/Св-во, Прописка, Д.Р.)</label>
            <div class="input-group">
                <textarea class="acco-participants" rows="3" placeholder="Иванов И.И., паспорт ..., прописка ..., 12.05.2010"></textarea>
            </div>

            <label class="form-label">3. Кол-во номеров и названия</label>
            <div class="input-group">
                <input type="text" class="acco-perf-count" placeholder="Например: 2 номера (Танец огня, Вальс)">
            </div>

            <label class="form-label">4. ФИО Сопровождающих / Детей без участия</label>
            <div class="input-group">
                <textarea class="acco-accompanying" rows="2" placeholder="Данные сопровождающих..."></textarea>
            </div>
        `;
        const removeBtn = div.querySelector('.perf-remove');
        if(removeBtn) removeBtn.addEventListener('click', () => { div.remove(); });
        accoContainer.appendChild(div);
    }
    if(addAccoBtn) addAccoBtn.addEventListener('click', () => {
        addAccommodationRow(accoContainer.querySelectorAll('.acco-card').length + 1);
    });


    // === ЛОГИКА НАГРАД (ОБЩАЯ) ===
    if(awardTypeSelect) {
        awardTypeSelect.addEventListener('change', () => {
            const type = awardTypeSelect.value;
            if(type === 'none') {
                awardInputArea.style.display = 'none';
            } else {
                awardInputArea.style.display = 'block';
                awardPerfName.value = '';
                awardQty.value = '';
                tempDiplomaNames = [];
                renderDiplomaNames();
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

    if(addAwardToListBtn) {
        addAwardToListBtn.addEventListener('click', () => {
            const type = awardTypeSelect.value;
            const perf = awardPerfName.value.trim();
            let qty = awardQty.value.trim();
            if(!perf) { alert("Укажите название номера!"); return; }
            if(type === 'diploma' && !qty) {
                qty = tempDiplomaNames.length > 0 ? tempDiplomaNames.length : 1;
            } else if(!qty) {
                qty = 1; 
            }

            let typeLabel = "";
            let details = "";
            if(type === 'medal') typeLabel = "Медаль";
            if(type === 'cup') typeLabel = "Кубок";
            if(type === 'diploma') {
                typeLabel = "Диплом";
                details = tempDiplomaNames.length > 0 ? tempDiplomaNames.join(', ') : "Без имен";
            }

            const div = document.createElement('div');
            div.className = 'perf-card';
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

            let formData = {};

            if (!isRemote) {
                // СБОР ДЛЯ МЕСТНЫХ
                formData = {
                    type: "МЕСТНЫЕ",
                    festDate: document.getElementById('festDate_local').value,
                    groupName: document.getElementById('groupName_local').value,
                    city: document.getElementById('city_local').value,
                    director: document.getElementById('director_local').value,
                    teacher: document.getElementById('teacher_local').value,
                    phone: document.getElementById('phone_local').value,
                    email: document.getElementById('email_local').value,
                    socials: document.getElementById('socials_local').value,
                    participants: document.getElementById('participants_local').value,
                    accompanying: document.getElementById('accompanying_local').value,
                    manager: document.getElementById('manager_local').value,
                    grant: document.getElementById('grant_local').value,
                    // Пустые поля иногородних
                    arrival: "", departure: "", accommodationList: []
                };
            } else {
                // СБОР ДЛЯ ИНОГОРОДНИХ
                const arrDate = document.getElementById('arrivalDate').value;
                const arrTime = document.getElementById('arrivalTime').value;
                const arrWagon = document.getElementById('arrivalWagon').value;
                const arrSt = document.getElementById('arrivalStation').value;
                
                const depDate = document.getElementById('depDate').value;
                const depTime = document.getElementById('depTime').value;
                const depWagon = document.getElementById('depWagon').value;
                const depSt = document.getElementById('depStation').value;

                formData = {
                    type: "ИНОГОРОДНИЕ",
                    festDate: document.getElementById('festDate_remote').value,
                    groupName: document.getElementById('groupName_remote').value,
                    city: document.getElementById('city_remote').value,
                    director: document.getElementById('director_remote').value,
                    teacher: document.getElementById('teacher_remote').value + " / " + document.getElementById('tutor_remote').value,
                    phone: document.getElementById('phone_remote').value,
                    email: document.getElementById('email_remote').value,
                    socials: document.getElementById('socials_remote').value,
                    participants: document.getElementById('participants_remote').value,
                    accompanying: document.getElementById('accompanying_remote').value,
                    manager: document.getElementById('manager_remote').value,
                    grant: document.getElementById('grant_remote').value,
                    extraMedals: document.getElementById('medal_info_remote').value,
                    
                    arrival: `Приезд: ${arrDate} ${arrTime}, Вагон ${arrWagon}, ${arrSt}`,
                    departure: `Отъезд: ${depDate} ${depTime}, Вагон ${depWagon}, ${depSt}`,
                    
                    accommodationList: []
                };

                // Сбор списков проживания
                const accoCards = accoContainer.querySelectorAll('.acco-card');
                accoCards.forEach(card => {
                    formData.accommodationList.push({
                        package: card.querySelector('.acco-package').value,
                        people: card.querySelector('.acco-participants').value,
                        perfCount: card.querySelector('.acco-perf-count').value,
                        accompaningData: card.querySelector('.acco-accompanying').value
                    });
                });
            }

            // Общие данные (Номера и Награды)
            formData.performances = [];
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

            formData.awards = [];
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