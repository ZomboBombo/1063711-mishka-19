/*
============================================================
=== МОБИЛЬНОЕ МЕНЮ: Навигация для мобильной версии сайта ===
============================================================
*/


// *** 1. Переменные для DOM-элементов ***

// --- Кнопка-бургер: открывает/закрывает меню ---
var toggleMenuButton = document.querySelector('.toggle-menu-button');
var toggleMenuButtonPseudoline = toggleMenuButton.querySelector('.toggle-menu-button__pseudoline'); // Блок-псевдолиния

// --- Навигационное меню: навигация по сайту и пользовательская навигация ---
var mobileMenu = document.querySelector('.site-header__main-navigation');



// *** 2. Настройки сайта при активном JS ***

// --- Модификатор класса: при активном JS кнопка-бургер показывается,
// --- а при отключенном — нет.
toggleMenuButton.classList.add('toggle-menu-button--js-active');

// --- Добавляем навигационному меню модификаторы для:
// --- 1) позиционирования вне потока при включённом JS
mobileMenu.classList.add('site-header__main-navigation--js-active');

// --- 2) сокрытия блока при включённом JS
mobileMenu.classList.add('site-header__main-navigation--menu-hidden');



// *** 3. Обработчики событий ***

// --- 3.1) ОБРАБОТЧИК СОБЫТИЯ "Клик": при клике на кнопку-бургер навигационному меню
// --- добавляется либо удаляется класс "site-header__main-navigation--menu-hidden",
// --- отвечающий за сокрытие блока.
toggleMenuButton.addEventListener('click', function () {

  if (mobileMenu.classList.contains('site-header__main-navigation--menu-hidden')) {

    toggleMenuButton.classList.add('toggle-menu-button--menu-open');
    toggleMenuButtonPseudoline.classList.add('toggle-menu-button__pseudoline--menu-open');
    mobileMenu.classList.remove('site-header__main-navigation--menu-hidden');

  } else {

    toggleMenuButton.classList.remove('toggle-menu-button--menu-open');
    toggleMenuButtonPseudoline.classList.remove('toggle-menu-button__pseudoline--menu-open');
    mobileMenu.classList.add('site-header__main-navigation--menu-hidden');

  }

});






/*
===================================================
=== МОДАЛЬНОЕ ОКНО: Вызов, появление и сокрытие ===
===================================================
*/


// *** 1. Переменные для DOM-элементов ***

// --- <body> — самый главный контентный блок ---
var BODY = document.querySelector('body');

// --- Кнопка заказа товара недели на ГЛАВНОЙ СТРАНИЦЕ (секция «Вязаные корзинки») ---
var knittedBasketsOrderButton = BODY.querySelector('.knitted-baskets__order-button');

// --- Кнопка добавления в корзину на странице "Каталог" (иконка Продуктовой корзины в карточке товара) ---
var catalogItemOrderButton = BODY.querySelectorAll('.product-card__price-order-button');

// --- Коллекция модальных окон: окно с Формой и окно-подложка ---
var modalWindows = BODY.querySelectorAll('.modal');
var modalOverlay = BODY.querySelector('.modal--overlay'); // Модальное окно-подложка

// --- Первый элемент из списка input'ов — первый размер ("S") ---
var sizeListRadioFirst = BODY.querySelector('.size-list__radio:first-child');



// *** 2. Константы ***
var ESC_KEY = 'Escape';
var ERR_MISSING_ITEM = null; // Ошибка: возникает, если скрипт пытается определить элемент, отсутствующий на странице.


// *** 3. Функции ***

// --- 3.1) Функция для открытия модального окна ---
var onModalWindowOpen = function (evt) {

  // --- Отменяем действие кнопки по умолчанию (чтобы не происходила переадресация на другую страницу) ---
  evt.preventDefault();

  // --- Добавляем <body> специальный класс, запрещающий "скроллить" страницу, когда открыто модальное окно ---
  BODY.classList.add('opened-modal-window');


  // *** Перебираем в цикле элементы коллекции модальных окон ***
  for (var i = 0; i < modalWindows.length; i++) {
    // --- Если элемент модального окна СОДЕРЖИТ модификатор класса, ---
    if (modalWindows[i].classList.contains('modal--open')) {

      // --- то УДАЛИТЬ его. ---
      modalWindows[i].classList.remove('modal--open');

    } else {
      // --- Иначе, ДОБАВИТЬ модификатор класса. ---
      modalWindows[i].classList.add('modal--open');
    }
  }


  // --- Фокусируемся на первом элементе из списка размеров ---
  sizeListRadioFirst.focus();


  // *** Обработчик события в глобальной области видимости ***
  document.addEventListener('keydown', function (globalEvt) {

    // *** Перебираем в цикле элементы коллекции модальных окон ***
    for (var j = 0; j < modalWindows.length; j++) {

      // --- Если произошло нажатие на Esc,
      if (globalEvt.key === ESC_KEY) {

        // --- то УДАЛИТЬ модификатор класса для открытия модального окна ---
        modalWindows[j].classList.remove('modal--open');
      }
    }

    // --- Удаляем с <body> класс для запрета прокрутки страницы ---
    BODY.classList.remove('opened-modal-window');

    // --- Удаляем обработчик "глобальных" событий ---
    document.removeEventListener('keydown', function (globalEvt) {});
  });


  // *** Обработчик события при клике "вне" модального окна ---
  modalOverlay.addEventListener('click', function () {
    // *** Перебираем в цикле элементы коллекции модальных окон ***
    for (var k = 0; k < modalWindows.length; k++) {
      modalWindows[k].classList.remove('modal--open');
    }

    // --- Удаляем с <body> класс для запрета прокрутки страницы ---
    BODY.classList.remove('opened-modal-window');
  });
};


// *** 4. Обработчики событий ***

// --- Оператор switch — для избежания колизий при навигации по сайту ---
switch (true) {
  case knittedBasketsOrderButton !== ERR_MISSING_ITEM:
    knittedBasketsOrderButton.addEventListener('click', onModalWindowOpen);
    break;

  case catalogItemOrderButton !== ERR_MISSING_ITEM:
    for (var element = 0; element < catalogItemOrderButton.length; element++) {
      catalogItemOrderButton[element].addEventListener('click', onModalWindowOpen);
    }
    break;
}
