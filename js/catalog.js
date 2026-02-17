// Вспомогательные функции
function isPromo(p) {
  return p.price?.old && p.price.old > p.price.current;
}

function getDiscountPercent(p) {
  if (!isPromo(p)) return 0;
  return Math.round(((p.price.old - p.price.current) / p.price.old) * 100);
}

function sortProducts(items, type) {
  const sorted = [...items];
  switch (type) {
    case 'price_asc':
      sorted.sort((a, b) => a.price.current - b.price.current);
      break;
    case 'price_desc':
      sorted.sort((a, b) => b.price.current - a.price.current);
      break;
    case 'name_desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'promo_desc': 
      sorted.sort((a, b) => {
        // Считаем процент скидки для каждого товара
        const discountA = getDiscountPercent(a);
        const discountB = getDiscountPercent(b);
        
        // Сортируем от большего процента к меньшему
        return discountB - discountA;
      });
      break;
    default:
      // Это и есть твой name_asc (А-Я) по умолчанию
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  const template = document.getElementById('product-card-template');

  

  if (!container || !template) return;

  container.innerHTML = '';

  products.forEach(p => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.product-article').textContent = `Артикул: ${p.article}`;
    clone.querySelector('.product-brand').textContent = p.brand;
    clone.querySelector('.product-name').textContent = p.name;
    clone.querySelector('.product-name').href = `product.html?slug=${p.slug}`;
    clone.querySelector('.product-link').href = `product.html?slug=${p.slug}`;
    // clone.querySelector('.product-price').textContent = `${p.price.toLocaleString()} ₴`;
    clone.querySelector('.product-image').src = p.image;

    const oldPriceEl = clone.querySelector('.old-price');
    const currentPriceEl = clone.querySelector('.current-price');

    currentPriceEl.textContent =
      `${p.price.current.toLocaleString()} ₴`;

    if (p.price.old && p.price.old > p.price.current) {
      oldPriceEl.textContent =
        `${p.price.old.toLocaleString()} ₴`;
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }

    
    const badge = clone.querySelector('.badge-sale');
    const discount = getDiscountPercent(p); // Считаем процент

    if (discount > 0) {
      badge.textContent = `-${discount}%`; // Записываем например "-15%" вместо слова "Акция"
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }


    
    const wishlistBtn = clone.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.dataset.id = p.id;

      if (isInWishlist(p.id)) {
        wishlistBtn.classList.add('active');
      }
    }


    const btn = clone.querySelector('.card-btn');
    // const img = btn.querySelector('img');

    // 1. ЗАПИСЫВАЕМ ДАННЫЕ В DATASET (ОБЯЗАТЕЛЬНО!)
    btn.dataset.id = p.id;
    btn.dataset.name = p.name;
    btn.dataset.price = p.price.current;
    btn.dataset.image = p.image;
    btn.dataset.slug = p.slug;

    // 2. Эффект наведения оставляем
    btn.addEventListener('mouseenter', () => {
      const currentImg = btn.querySelector('img'); // Находим актуальную картинку
      if (currentImg && !btn.classList.contains('in-cart')) {
        currentImg.src = 'img/tray.png';
      }
    });

    btn.addEventListener('mouseleave', () => {
      const currentImg = btn.querySelector('img'); // Находим актуальную картинку
      if (currentImg && !btn.classList.contains('in-cart')) {
        currentImg.src = 'img/trayy.png';
      }
    });
    
    // 4. Проверяем статус при отрисовке
    if (typeof isInCart === 'function' && isInCart(p.id)) {
       updateCartButtonState(btn, true);
    }

    container.appendChild(clone);
  });
}

// renderProducts(products, 'products-container');

document.addEventListener('DOMContentLoaded', () => {
  const shampoos = products.filter(p => p.category === 'shampoos');
  const soaps = products.filter(p => p.category === 'soaps');

  const promoProducts = products.filter(isPromo);

  renderProducts(shampoos.slice(0,5), 'shampoos-container');
  renderProducts(soaps.slice(0,5),'soaps-container');
  renderProducts(promoProducts.slice(0,5), 'promo-container');
});


// document.addEventListener('click', e => {
//   const btn = e.target.closest('.wishlist-btn');
//   if (!btn) return;

//   const id = Number(btn.dataset.id);
//   const product = products.find(p => p.id === id);

//   if (!product) return;

//   // Вызываем основную функцию
//   toggleWishlist(product);

//   // syncWishlistButtons сама найдет все кнопки с этим ID и покрасит их
//   syncWishlistButtons(id);
// });

// function syncWishlistButtons(productId) {
//   // Находим все кнопки избранного на странице
//   // Предположим, у твоих кнопок есть атрибут data-id="${product.id}"
//   const allButtons = document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`);
  
//   const isFavorite = isInWishlist(productId);

//   allButtons.forEach(btn => {
//     if (isFavorite) {
//       btn.classList.add('active');
//       btn.innerHTML = '❤️'; // или твой стиль закрашенного сердца
//     } else {
//       btn.classList.remove('active');
//       btn.innerHTML = '🤍'; // или пустое сердце
//     }
//   });
// }

// function getDiscountPercent(p) {
//   if (!isPromo(p)) return 0;
//   return Math.round(
//     ((p.price.old - p.price.current) / p.price.old) * 100
//   );
// }