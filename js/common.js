/***********************
 * ФИКСАЦИЯ СКРОЛЛА 
 ***********************/
let scrollPosition = 0;

function lockScroll() {
  scrollPosition = window.scrollY;
  // window.scrollTo(0, 0);

  document.body.style.position = 'fixed';
  document.body.style.top = '-${scrollPosition}px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';

  window.scrollTo(0, scrollPosition);
}

/***********************
 * ОТКРЫТИЕ / ЗАКРЫТИЕ ВЕРХНЕГО КАТАЛОГА
 ***********************/
// Эти функции теперь лежат отдельно, а не внутри catalogToggle
function closeCatalog() {
  const wrapper = document.getElementById('catalog-wrapper');
  const catalog = document.getElementById('catalog-menu-full');
  const overlay = document.getElementById('overlay');
  const catPush = document.getElementById('catPush');
  const searchSuggestions = document.getElementById('search-suggestions'); // Находим поиск

  if (!wrapper || !catalog) return;

  const icon = wrapper.querySelector('img');

  wrapper.classList.remove('active');
  catalog.classList.remove('active');

  // Закрываем оверлей только если поиск тоже закрыт
  const isSearchOpen = searchSuggestions && searchSuggestions.style.display === 'block';
  if (!isSearchOpen) {
    overlay.classList.remove('active');
  }

  if (icon) icon.src = 'img/threebars.svg';

  // УМНЫЙ ТАЙМЕР
  setTimeout(() => {
    // Проверяем: если за эти 230мс ты успел открыть поиск, 
    // то МЫ НЕ ВОЗВРАЩАЕМ z-index: 3
    const isSearchNowActive = searchSuggestions && searchSuggestions.style.display === 'block';
    const isCatalogNowActive = catalog.classList.contains('active');

    if (catPush && !isCatalogNowActive && !isSearchNowActive) {
      catPush.style.zIndex = '3';
    }
  }, 230);

  unlockScroll();
  document.removeEventListener('click', outsideClickListener);
}

// Слушатель клика вне каталога тоже выносим
function outsideClickListener(e) {
  const catalog = document.getElementById('catalog-menu-full');
  const headerTop = document.querySelector('.header');
  const headerBottom = document.querySelector('.header-bot');

  const clickInsideHeader = (headerTop?.contains(e.target)) || (headerBottom?.contains(e.target));
  const clickInsideCatalog = catalog?.contains(e.target);

  if (!clickInsideHeader && !clickInsideCatalog) {
    closeCatalog();
  }
}

// Сама функция переключения теперь стала очень короткой
function catalogToggle() {
  const wrapper = document.getElementById('catalog-wrapper');
  const catalog = document.getElementById('catalog-menu-full');
  const overlay = document.getElementById('overlay');
  const catPush = document.getElementById('catPush');

  if (!wrapper || !catalog || !overlay) return;

  const icon = wrapper.querySelector('img');
  const isOpening = !wrapper.classList.contains('active');

  if (isOpening) {
    wrapper.classList.add('active');
    catalog.classList.add('active');
    overlay.classList.add('active');

    if (icon) icon.src = 'img/krest.svg';
    overlay.style.zIndex = '2';
    if (catPush) catPush.style.zIndex = '1';

    lockScroll();

    setTimeout(() => {
      document.addEventListener('click', outsideClickListener);
    }, 50);
    
    overlay.onclick = closeCatalog;
  } else {
    closeCatalog();
  }
}

/***********************
 * ПОДМЕНЮ ВЕРХНЕГО КАТАЛОГА
 ***********************/
const topMenuItems = document.querySelectorAll('.catalog-menu ul li');
const topSubmenus = document.querySelector('.submenus-top');
const topCatMenus = document.querySelectorAll('.submenus-top .cat-menu-top');
const topCatalog = document.querySelector('.catalog-menu-full');

if (topMenuItems.length && topSubmenus) {
  topMenuItems.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      topSubmenus.classList.add('active');
      topCatMenus.forEach(menu => menu.classList.remove('active'));
      topCatMenus[i]?.classList.add('active');
    });
  });
}

if (topCatalog && topSubmenus) {
  topCatalog.addEventListener('mouseleave', () => {
    topSubmenus.classList.remove('active');
    topCatMenus.forEach(menu => menu.classList.remove('active'));
  });
}

/***********************
 * ГОЛОСОВОЙ ПОИСК
 ***********************/
const micBtn = document.getElementById('micBtn');
const searchInput = document.getElementById('searchInput');

if (micBtn && searchInput && 'webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();

  recognition.lang = 'uk-UA';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => micBtn.classList.add('listening');
  recognition.onend = () => micBtn.classList.remove('listening');

  recognition.onresult = (e) => {
  const transcript = e.results[0][0].transcript;
  searchInput.value = transcript;

  // 1. Сразу запускаем поиск (переход на страницу результатов)
  if (transcript.trim()) {
    window.location.href = `search.html?q=${encodeURIComponent(transcript.trim())}`;
  }
};

  micBtn.addEventListener('click', () => recognition.start());
}



function hasActiveFilters() {
  return (
    filtersState.priceMin !== null ||
    filtersState.priceMax !== null ||
    filtersState.brands.length > 0 ||
    filtersState.onlyPromo === true ||
    filtersState.sort !== 'name_asc'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const btn = document.querySelector('.search-btn');
  const container = document.getElementById('products-container');


 

  // Логика кнопки поиска (допиши обрыв)
  if (input && btn) {
    btn.addEventListener('click', () => {
      const query = input.value.trim();
      if (query) window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
    });
  }
});



function updateSearchUI(resultCount) {
  const filters = document.getElementById('filters');
  const sortBar = document.getElementById('sort-bar');
  const noResults = document.getElementById('no-results');
  const title = document.getElementById('search-title');

  const isFilterResult = hasActiveFilters();

  // Заголовок
  if (title && filtersState.query) {
    title.textContent = `Результати пошуку за запитом: "${filtersState.query}"`;
  }

  if (resultCount === 0) {

    // Скрываем фильтры
    if (!isFilterResult) {
      if (filters) filters.style.display = 'none';
      if (sortBar) sortBar.style.display = 'none';
    } 

    // Сообщение
    if (noResults) {
      noResults.innerHTML = isFilterResult
      ? 'Немає товарів з обраними фільтрами'
      : 'Нажаль, нічого не знайдено';
      noResults.hidden = false;
    }
  } else {
    // Если что-то нашли
    if (filters) filters.style.display = '';
    if (sortBar) sortBar.style.display = '';
    if (noResults) noResults.hidden = true;
  }
}


// function searchProducts(query) {
//   const originalQuery = query.toLowerCase().trim();

//   // 1. РАСШИРЕННЫЙ СЛОВАРЬ (Бренды + Категории)
//   const manualSynonyms = {
//     // Категории (переводим на язык базы)
//     'шампунь': 'shampoos',
//     'шампуні': 'shampoos',
//     'мило': 'soaps',
//     'мило': 'soaps',
//     // Бренды
//     'лореаль': "l'oreal",
//     'loreal': "l'oreal",
//     'сяоми': 'xiaomi',
//     'эпл': 'apple',
//     'айфон': 'iphone',
//     'самсунг': 'samsung'
//   };

//   // Вспомогательная функция фильтрации
//   const filterBy = (q) => products.filter(p => {
//     const name = p.name.toLowerCase();
//     const brand = p.brand.toLowerCase();
//     const article = String(p.article).toLowerCase();
//     const category = (p.category || '').toLowerCase();

//     return name.includes(q) || 
//            brand.includes(q) || 
//            article.includes(q) || 
//            category.includes(q) ||
//            (levenshtein(q, name) <= 2) || 
//            (levenshtein(q, brand) <= 2);
//   });

//   // --- ТВОЯ UX-ЦЕПОЧКА (ШАГИ) ---

//   // Шаг 1: Синонимы и Категории (шампунь -> shampoos)
//   if (manualSynonyms[originalQuery]) {
//     const synResults = filterBy(manualSynonyms[originalQuery]);
//     if (synResults.length > 0) return synResults;
//   }

//   // Шаг 2: Ищем как есть (оригинал)
//   let results = filterBy(originalQuery);
//   if (results.length > 0) return results;

//   // Шаг 3: Авто-транслит (самсунг -> samsung)
//   if (typeof transliterate === 'function') {
//     const translitQuery = transliterate(originalQuery);
//     if (translitQuery !== originalQuery) {
//       results = filterBy(translitQuery);
//       if (results.length > 0) return results;
//     }
//   }

//   // Шаг 4: Смена раскладки (шзрщту -> iphone)
//   if (typeof switchLayout === 'function') {
//     const switchedQuery = switchLayout(originalQuery);
//     if (switchedQuery !== originalQuery) {
//       results = filterBy(switchedQuery);
//     }
//   }

//   return results;
// }


const input = document.getElementById('searchInput');
const box = document.getElementById('search-suggestions');

input.addEventListener('input', () => {
  const q = input.value.trim();

  if (q.length < 2) {
    // box.style.display = 'none';
    closeSearchSuggestions();
    return;
  }

  const results = searchProducts(q).slice(0, 4);
  renderSuggestions(results, q);

  openSearchSuggestions();
});


const overlay = document.getElementById('overlay');

let searchZIndexTimeout;

function openSearchSuggestions() {

// Если каталог открыт — закрываем его без побочных эффектов
  const catalog = document.getElementById('catalog-menu-full');
  if (catalog && catalog.classList.contains('active')) {
    closeCatalog(); 
  }

  // Если висит старый таймер на закрытие — отменяем его немедленно!
  if (searchZIndexTimeout) {
    clearTimeout(searchZIndexTimeout);
  }

  box.style.display = 'block';
  overlay.classList.add('active');

  // СКРЫВАЕМ НАВИГАЦИЮ
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) mobileNav.style.display = 'none';

  if (catPush) {
    catPush.style.zIndex = '1';
  }

  setTimeout(() => {
    document.addEventListener('click', outsideSearchClick);
  }, 0);

  // document.body.style.overflow = 'hidden'; // Запрещаем скролл сайта под поиском
  // box.style.display = 'block';
}

function closeSearchSuggestions() {
  box.style.display = 'none';
  overlay.classList.remove('active');

  // ВОЗВРАЩАЕМ НАВИГАЦИЮ
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) mobileNav.style.display = '';

  // Сбрасываем старый таймер перед запуском нового (на всякий случай)
  if (searchZIndexTimeout) {
    clearTimeout(searchZIndexTimeout);
  }

  // Запускаем таймер на возврат индекса
  searchZIndexTimeout = setTimeout(() => {
    const catalog = document.getElementById('catalog-menu-full');
    const isCatalogOpen = catalog && catalog.classList.contains('active');
    
    // Проверяем: если за это время поиск не открыли снова (!box.style.display)
    if (catPush && !isCatalogOpen && box.style.display === 'none') {
      catPush.style.zIndex = '3';
    }
  }, 300); // Время анимации твоего оверлея

  document.removeEventListener('click', outsideSearchClick);
  // document.body.style.overflow = ''; // Возвращаем скролл
  // box.style.display = 'none';
}


function outsideSearchClick(e) {
  const searchBlock = document.querySelector('.search-block');

  if (!searchBlock.contains(e.target)) {
    closeSearchSuggestions();
  }
}


overlay.addEventListener('click', closeSearchSuggestions);


document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSearchSuggestions();
  }
});

// function renderSuggestions(items, query) {
//   box.innerHTML = `
//     <h6>Товари</h6>
//     <div class="suggest-grid">
//       ${items.map(p => `
//         <a href="product.html?slug=${p.slug}" class="suggest-item">
//           <img src="${p.image}">
//           <div>
//             <div>${p.name}</div>
//             <strong>${p.price} ₴</strong>
//           </div>
//         </a>
//       `).join('')}
//       <a href="search.html?q=${query}" class="suggest-all">
//         Переглянути всі →
//       </a>
//     </div>
//   `;

//   box.style.display = 'block';
// }


// function renderSuggestions(items, query) {
//   box.innerHTML = `
//     <div class="chips">
//       ${popularQueries.map(q => `
//         <button onclick="setSearch('${q}')">${q}</button>
//       `).join('')}
//     </div>

//     <h6>Товари</h6>
//     <div class="suggest-grid">
//       ${items.map(p => `
//         <a href="product.html?slug=${p.slug}" class="suggest-item">
//           <img src="${p.image}">
//           <div>
//             <div>${p.name}</div>
//             <strong>${p.price} ₴</strong>
//           </div>
//         </a>
//       `).join('')}
//       <a href="search.html?q=${query}" class="suggest-all">
//         Переглянути всі →
//       </a>
//     </div>
//   `;

//   box.style.display = 'block';
// }


// const popularQueries = [
//   'шампунь',
//   'шампунь чоловічий',
//   'шампунь жіночий',
//   'шампунь гель'
// ];

function renderSuggestions(items, query) {

  // Если в живом поиске 0 товаров
  if (items.length === 0) {
    box.innerHTML = `
      <div class="no-results">
        <p>За запитом <strong>"${query}"</strong> нічого не знайдено.</p>
        <p>Спробуйте одну з категорій:</p>
        <div class="suggested-categories">
           <a href="category.html?category=shampoos">Шампуні</a>
           <a href="category.html?category=soaps">Мило</a>
           <a href="category.html?category=promo">Акції</a>
        </div>
      </div>
    `;
    box.style.display = 'block';
    return;
  }

  const chips = generateChips(query, items);

  box.innerHTML = `
    ${chips.length ? `
      <div class="chips">
        ${chips.map(c => `
          <button onclick="setSearch('${c}')">${c}</button>
        `).join('')}
      </div>
    ` : ''}

    <h6>Товари</h6>

    <div class="suggest-grid">
      ${items.map(p => `
        <a href="product.html?slug=${p.slug}" class="suggest-item">
          <img src="${p.image}">
          <div>
            <div>${p.name}</div>
            <strong>${p.price.current.toLocaleString()} ₴</strong>
          </div>
        </a>
      `).join('')}

      <a href="search.html?q=${query}" class="suggest-all">
        Переглянути всі →
      </a>
    </div>
  `;

  box.style.display = 'block';
}


function setSearch(value) {
  searchInput.value = value;
  window.location.href = `search.html?q=${encodeURIComponent(value)}`;
}


function generateChips(query, products) {
  query = query.toLowerCase();
  const chips = new Set();

  products.forEach(p => {
    const words = p.name.toLowerCase().split(' ');

    words.forEach(w => {
      if (w.startsWith(query) && w.length > query.length) {
        chips.add(`${query} ${w}`);
      }
    });

    // по категории
if (p.category && p.category.includes(query)) {
    // Если ввели "шам", предложим просто "шампуні" (через мапинг или как в базе)
    chips.add(p.category); 
}
  });

  return Array.from(chips).slice(0, 6);
}

//Мобильный каталог
function triggerMobileMenu() {
    const mobileNavCatalogBtn = document.querySelectorAll('.mobile-nav .nav-item')[1];
    const menu = document.getElementById('catalog-menu-full');
    const triggerContainer = document.querySelector('.mobile-catalog-trigger-container');

    if (mobileNavCatalogBtn) {
        mobileNavCatalogBtn.click(); // Кликаем по нижней кнопке
    }

    // Ждем 50мс, чтобы класс 'active' успел добавиться или удалиться
    setTimeout(() => {
        if (menu && menu.classList.contains('active')) {
            // Меню открылось — скрываем кнопку
            triggerContainer.style.display = 'none';
        } else {
            // Меню закрылось — возвращаем кнопку
            triggerContainer.style.display = 'flex';
        }
    }, 3);
}

// ВАЖНО: Добавь это, чтобы кнопка возвращалась, если меню 
// закрыли кликом по самой нижней иконке напрямую
document.querySelectorAll('.mobile-nav .nav-item')[1].addEventListener('click', () => {
    const menu = document.getElementById('catalog-menu-full');
    const triggerContainer = document.querySelector('.mobile-catalog-trigger-container');
    
    setTimeout(() => {
        if (menu && !menu.classList.contains('active')) {
            triggerContainer.style.display = 'flex';
        } else {
            triggerContainer.style.display = 'none';
        }
    }, 50);
});


document.addEventListener('click', e => {
  const btn = e.target.closest('.card-btn');
  if (!btn) return;

  e.preventDefault();

  console.log('BTN', btn);
  console.log('DATA-ID', btn.dataset.id);

  const productId = Number(btn.dataset.id);
  const product = products.find(p => p.id === productId);
  if (!product) return;

  console.log('PRODUCT', product);

  const inCartNow = addToCart(product);
  console.log('IN CART NOW', inCartNow);

  updateCartButton(btn, inCartNow);
});

function updateCartButton(btn, inCart) {
  if (inCart) {
    btn.classList.add('in-cart');
    btn.innerHTML = 'В кошику ✓';
  } else {
    btn.classList.remove('in-cart');
    btn.innerHTML = 'Додати <img src="img/trayy.png">';
  }
}

function syncCartButtons() {
  document.querySelectorAll('.card-btn').forEach(btn => {
    const id = Number(btn.dataset.id);
    if (isInCart(id)) {
      updateCartButton(btn, true);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  syncCartButtons();
});
