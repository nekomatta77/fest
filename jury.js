document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ДАННЫЕ ЖЮРИ ---
    const juryData = [
        {
            id: 1,
            name: "Иван Сачков",
            role: "Хореограф, танцовщик",
            img: "assets/actors/Sachkov.png",
            bio: "Преподаватель-исследователь современного танца программы бакалавриата «Искусство современного танца» Санкт-Петербургской Государственной консерватории имени Н.А.Римского-Корсакова, Академии Русского балета имени А. Я. Вагановой. Приглашенный педагог танцевальной труппы MA Dance — MusicAeterna при фонде Теодора Курентзиса. Санкт-Петербург."
        },
        {
            id: 2,
            name: "Виктория Сидельникова",
            role: "Дипломированный специалист, хореограф",
            img: "assets/actors/Sidelnikova.png",
            bio: "Руководитель 1 категории. Член федерации педагогов-хореографов России. Хореограф интенсивов и мастер-классов, представитель танцевальных форумов и фестивалей в России. Артист МЮЗИКЛОВ и спектаклей Московского академического театра сатиры. Артист драмы высшей категории. Участница телевизионных проектов «Танцуй» на Первом, «Танцы» на ТНТ, «Танцуют все». Артист телевизионных передач и программ на телеканалах ТНТ, ТВЦ, Россия 1 и другие. Неоднократно участница образовательной программы современного танца по иностранным педагогам-хореографам (США, Великобритания, Финляндия, Израиль, Испания, Швеция, Бельгия, Нидерланды). Практик и психолог — авторской методики развития современной пластики тела. Москва."
        },
        {
            id: 3,
            name: "Арсений Хорунжий",
            role: "Дипломированный специалист",
            img: "assets/actors/Horunjii.png",
            bio: "Образование высшее. Закончил Российскую академию театрального искусства ГИТИС. Педагог историко-бытовых и современных бальных танцев по специализации хореограф-постановщик шоу программ. Хореограф Московского академического театра сатиры. Артист драмы высшей категории. Член Союза Театральных деятелей Российской федерации. Член Федерации педагогов-хореографов Российской Федерации. Хореограф победителей проекта «Танцы со звездами» 2013-2016 телеканала «Россия». Хореограф проекта «Танцы на ТНТ» (команда Егора Дружинина). Топ 25 лучших танцоров страны 1-го сезона «Танцев на ТНТ» команда Егора Дружинина. Судья танцевальных Федераций «ОРТО», «МАРКС» и других коммерческих фестивалей и конкурсов. Экс-участник проекта A-Dessa (Стас Костюшкин). Хореограф и режиссер многочисленных городских мероприятий Москвы и Московской области. Награжден медалью Путина. Занесен в книгу «Одаренные дети, будущее России». Москва."
        }
    ];

    // --- 2. ЭЛЕМЕНТЫ DOM ---
    const juryTrack = document.getElementById('juryTrack');
    const juryModal = document.getElementById('juryModal');
    const closeJuryBtn = document.querySelector('.close-jury-btn');
    
    // Элементы внутри модального окна
    const jName = document.getElementById('juryModalName');
    const jRole = document.getElementById('juryModalRole');
    const jBio = document.getElementById('juryModalBio');
    const jImg = document.getElementById('juryModalImg');

    // --- 3. ЛОГИКА БЕСКОНЕЧНОЙ ЛЕНТЫ (INFINITE LOOP) ---
    // Создаем увеличенный массив данных (x6)
    const infiniteData = [
        ...juryData, ...juryData, 
        ...juryData, ...juryData, 
        ...juryData, ...juryData
    ];

    function createJuryCard(actor) {
        const card = document.createElement('div');
        card.classList.add('jury-card');
        
        card.innerHTML = `
            <div class="jury-img-container">
                <img src="${actor.img}" alt="${actor.name}" loading="lazy">
            </div>
            <div class="jury-info">
                <h3>
                    ${actor.name}
                </h3>
                <p>
                    ${actor.role}
                </p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            openJuryModal(actor);
        });
        
        return card;
    }

    // Рендер
    if (juryTrack) {
        infiniteData.forEach(actor => {
            const newCard = createJuryCard(actor);
            juryTrack.appendChild(newCard);
        });

        // --- ЛОГИКА "ТЕЛЕПОРТА" СКРОЛЛА ---
        const singleSetWidth = (300 + 30) * juryData.length;
        
        // Ставим скролл на середину
        juryTrack.scrollLeft = singleSetWidth * 2; 

        juryTrack.addEventListener('scroll', () => {
            if (juryTrack.scrollLeft >= singleSetWidth * 4) {
                juryTrack.scrollLeft -= singleSetWidth * 2;
            }
            else if (juryTrack.scrollLeft <= singleSetWidth * 0.5) {
                juryTrack.scrollLeft += singleSetWidth * 2;
            }
        });
    }

    // --- 4. ЛОГИКА МОДАЛЬНОГО ОКНА ---
    function openJuryModal(actor) {
        jName.innerText = actor.name;
        jRole.innerText = actor.role;
        jBio.innerText = actor.bio;
        jImg.src = actor.img;
        
        juryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    if (closeJuryBtn) {
        closeJuryBtn.addEventListener('click', () => {
            juryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == juryModal) {
            juryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

});
