// ===== Бургер меню =====
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

burger.addEventListener('click', () => {
    menu.classList.add('menu__open');
});

// Закрытие меню при клике на любой элемент внутри
menu.addEventListener('click', () => {
    menu.classList.remove('menu__open');
});

// ===== Мобильная карусель тарифов с клонами =====
(function () {
    const BREAKPOINT = 425;
    const viewport = document.getElementById('viewport');
    const track = document.getElementById('track');
    const btnPrev = document.querySelector('.c-prev');
    const btnNext = document.querySelector('.c-next');

    const originals = Array.from(track.children).map(n => n.cloneNode(true));
    let isMobile = false;
    let initialized = false;
    let index = 1;
    let slideWidth = 0;
    let animating = false;

    function setSlideWidth() {
        slideWidth = viewport.clientWidth;
    }

    function translateTo(i) {
        track.style.transform = `translateX(${-i * slideWidth}px)`;
    }

    function buildMobile() {
        if (initialized) return;
        initialized = true;

        track.innerHTML = '';
        const lastClone = originals[originals.length - 1].cloneNode(true);
        const firstClone = originals[0].cloneNode(true);
        lastClone.dataset.clone = 'true';
        firstClone.dataset.clone = 'true';

        track.appendChild(lastClone);
        originals.forEach(n => track.appendChild(n.cloneNode(true)));
        track.appendChild(firstClone);

        setSlideWidth();
        track.style.transition = 'none';
        index = 1;
        translateTo(index);
        void track.offsetHeight;
        track.style.transition = 'transform .4s ease';

        btnPrev.style.display = 'grid';
        btnNext.style.display = 'grid';
    }

    function destroyMobile() {
        if (!initialized) return;
        initialized = false;
        track.style.transition = 'none';
        track.style.transform = '';
        track.innerHTML = '';
        originals.forEach(n => track.appendChild(n.cloneNode(true)));
        btnPrev.style.display = 'none';
        btnNext.style.display = 'none';
    }

    function next() {
        if (animating || !initialized) return;
        animating = true;
        index++;
        translateTo(index);
    }

    function prev() {
        if (animating || !initialized) return;
        animating = true;
        index--;
        translateTo(index);
    }

    track.addEventListener('transitionend', () => {
        const slides = track.children;
        const atFirstClone = slides[index] && slides[index].dataset.clone === 'true' && index === 0;
        const atLastClone = slides[index] && slides[index].dataset.clone === 'true' && index === slides.length - 1;

        if (atLastClone) {
            track.style.transition = 'none';
            index = 1;
            translateTo(index);
            void track.offsetHeight;
            track.style.transition = 'transform .4s ease';
        } else if (atFirstClone) {
            track.style.transition = 'none';
            index = slides.length - 2;
            translateTo(index);
            void track.offsetHeight;
            track.style.transition = 'transform .4s ease';
        }
        animating = false;
    });

    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);

    function handleMode() {
        const nowMobile = window.innerWidth <= BREAKPOINT;
        if (nowMobile && !initialized) {
            isMobile = true;
            buildMobile();
        } else if (!nowMobile && initialized) {
            isMobile = false;
            destroyMobile();
        }
    }

    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        handleMode();
        if (isMobile) {
            setSlideWidth();
            track.style.transition = 'none';
            translateTo(index);
            void track.offsetHeight;
            track.style.transition = 'transform .4s ease';
        }
    });

    handleMode();
    if (isMobile) setSlideWidth();
})();

// ===== Автозаполнение поля сообщения =====
const items = document.querySelectorAll('.gallery__table .g-item');
const messageField = document.querySelector('#message');

items.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const text = item.querySelector('.g-overlay').textContent;
        messageField.value = "Выбран продукт '" + text + "'";
        messageField.focus();
        // Плавно скроллим к форме
        // messageField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// const buttons = document.querySelectorAll('.select__btn');
// buttons.forEach(btn => {
//     btn.addEventListener('click', () => {
//         const tariffName = btn.closest('.tariff').querySelector('h3').textContent;
//         messageField.value = "Выбран тариф '" + tariffName + "'";
//         messageField.focus();
//         // Плавно скроллим к форме
//         // messageField.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     });
// });

const buttons = document.querySelectorAll('.select__btn');
const messageField = document.querySelector('#message');

function scrollToMessage() {
    // Скроллим плавно к полю формы
    messageField.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tariffName = btn.closest('.tariff').querySelector('h3').textContent;
        messageField.value = "Выбран тариф '" + tariffName + "'";
        messageField.focus();

        // Обеспечиваем корректный скролл независимо от ориентации
        // Делаем небольшую задержку, чтобы браузер успел пересчитать layout после focus
        setTimeout(scrollToMessage, 50);
    });
});

// Дополнительно: при изменении ориентации (книжная ↔ альбомная)
window.addEventListener('orientationchange', () => {
    // Можно принудительно обновить scroll-margin-top, если используется фиксированный хедер
    // document.querySelector('#message').scrollIntoView({ behavior: 'smooth', block: 'center' });
});



// ===== Очистка формы после отправки =====
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact__form');
    form.addEventListener('submit', () => {
        setTimeout(() => form.reset(), 100);
    });
});
