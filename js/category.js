const categoryTitles = {
  shampoos: 'Шампуні',
  soaps: 'Мило',
  promo: 'Товари в акції' // 1. Добавили заголовок для акций
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');

  if (!category) {
    console.warn('Категорія не вказана в URL');
    return;
  }

  const titleEl = document.getElementById('category-title');
  if (titleEl) {
    titleEl.textContent = categoryTitles[category] || category;
  }

  const container = document.getElementById('products-container');
  
  if (container && typeof products !== 'undefined') {
    
    // 2. ИЗМЕНЕННАЯ ЛОГИКА ФИЛЬТРАЦИИ
  let filteredProducts;

  if (category.toLowerCase() === 'promo') {
    // Используем компактную запись
    filteredProducts = products.filter(isPromo); 
  } else {
    // Обычный фильтр по категории
    filteredProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

    // 3. Отрисовка
    if (filteredProducts.length > 0) {
      renderProducts(filteredProducts, 'products-container');
    } else {
      container.innerHTML = '<p class="no-products">Товарів не знайдено</p>';
    }
  }
});