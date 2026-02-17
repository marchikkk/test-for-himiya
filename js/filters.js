const filtersState = {
  priceMin: null,
  priceMax: null,
  brands: [],
  query: null,
  onlyPromo: false,
  sort: 'name_asc' // По умолчанию А-Я
};

function collectFilters() {
  const min = document.getElementById('priceMin')?.value;
  const max = document.getElementById('priceMax')?.value;

  filtersState.priceMin = min ? Number(min) : null;
  filtersState.priceMax = max ? Number(max) : null;

  filtersState.brands = [...document.querySelectorAll('.filter-brand:checked')]
    .map(cb => cb.value.toLowerCase());

  filtersState.onlyPromo = document.getElementById('onlyPromo')?.checked || false;

  filtersState.sort = document.getElementById('sortSelect')?.value || 'name_asc';
}

function applyFilters() {
  // 1. Поиск — это база
  let result = filtersState.query ? searchProducts(filtersState.query) : [...products];

  // Только со скидкой 
  if (filtersState.onlyPromo) {
    result = result.filter(isPromo);
  }

  // 2. Цена (ОБЯЗАТЕЛЬНО добавляем .current)
  if (filtersState.priceMin !== null) {
    result = result.filter(p => p.price.current >= filtersState.priceMin);
  }
  if (filtersState.priceMax !== null) {
    result = result.filter(p => p.price.current <= filtersState.priceMax);
  }

  // 3. Бренд
  if (filtersState.brands.length) {
    result = result.filter(p => filtersState.brands.includes(p.brand.toLowerCase()));
  }

  

  result = sortProducts(result, filtersState.sort);

  renderProducts(result, 'products-container');

  updateSearchUI(result.length);
}

// Инициализация событий
document.addEventListener('DOMContentLoaded', () => {
  
  document.getElementById('applyFilters')?.addEventListener('click', () => {
    collectFilters();
    applyFilters();
  });
  
  document.getElementById('sortSelect')?.addEventListener('change', () => {
    collectFilters();
    applyFilters();
  });

  // Обработка URL параметров
  const params = new URLSearchParams(window.location.search);
  const queryFromURL = params.get('q');
  if (queryFromURL) {
    filtersState.query = queryFromURL;
  }

  // Первый запуск при загрузке страницы
  applyFilters();

  document.getElementById('resetFilters')?.addEventListener('click', () => {
  resetFiltersState();
  resetFiltersUI();
  applyFilters();
});

});

function resetFiltersState() {
  filtersState.priceMin = null;
  filtersState.priceMax = null;
  filtersState.brands = [];
  filtersState.onlyPromo = false;
  filtersState.sort = 'name_asc';
}


function resetFiltersUI() {
  // Цена
  const min = document.getElementById('priceMin');
  const max = document.getElementById('priceMax');
  if (min) min.value = '';
  if (max) max.value = '';

  // Чекбоксы брендов
  document.querySelectorAll('.filter-brand').forEach(cb => {
    cb.checked = false;
  });

  // Только со скидкой
  const promo = document.getElementById('onlyPromo');
  if (promo) promo.checked = false;

  // Сортировка
  const sort = document.getElementById('sortSelect');
  if (sort) sort.value = 'name_asc';
}


// АДАПТАЦИЯ ФИЛЬТРОВ
// ***************************


// // АДАПТАЦИЯ ФИЛЬТРОВ (Full-screen mode)
// const filtersPanel = document.getElementById('filters-panel');
// const openBtn = document.getElementById('openFiltersBtn');
// const closeBtn = document.getElementById('closeFiltersBtn');

// // Открытие
// openBtn?.addEventListener('click', () => {
//   filtersPanel?.classList.add('active');
//   lockScroll(); // Чтобы основной сайт не прокручивался под фильтрами
// });

// // Функция закрытия
// function closeFilters() {
//   filtersPanel?.classList.remove('active');
//   unlockScroll();
// }

// // Слушатель на кнопку "Х" (закрыть)
// closeBtn?.addEventListener('click', closeFilters);

// // Кнопка "Показати"
// document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
//   collectFilters();
//   applyFilters();
//   closeFilters();
// });


// function collectFilters() {
//   // Проверяем, открыта ли мобильная панель прямо сейчас
//   const isMobileActive = document.getElementById('filters-panel')?.classList.contains('active');

//   let min, max;

//   if (isMobileActive) {
//     // Если мы на мобилке, берем из полей с префиксом m-
//     min = document.getElementById('m-priceMin')?.value;
//     max = document.getElementById('m-priceMax')?.value;
//   } else {
//     // Если на ПК, берем из обычных полей
//     min = document.getElementById('priceMin')?.value;
//     max = document.getElementById('priceMax')?.value;
//   }

//   filtersState.priceMin = min ? Number(min) : null;
//   filtersState.priceMax = max ? Number(max) : null;

//   // Бренды (чекбоксы)
//   // Чтобы не плодить ID для каждого чекбокса, используй класс
//   filtersState.brands = [...document.querySelectorAll('.filter-brand:checked')]
//     .map(cb => cb.value.toLowerCase());
// }

// function lockScroll() {
//   document.body.style.overflow = 'hidden';
// }

// function unlockScroll() {
//   document.body.style.overflow = '';
// }


