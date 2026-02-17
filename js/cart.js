/***********************
 * КОРЗИНА (localStorage)
 ***********************/

// получить корзину
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// сохранить корзину
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// добавить товар
function addToCart(product) {
  const cart = getCart();
  const exists = cart.find(item => item.id === product.id);

  if (exists) {
    // если уже есть → удаляем
    removeFromCart(product.id);
    return false; // теперь товара НЕТ
  } else {
    // если нет → добавляем
    cart.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    saveCart(cart);
    return true; // теперь товар ЕСТЬ
  }
}


// обновить счётчик
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const counter = document.getElementById('cart-count');
  if (counter) {
    counter.textContent = count;
  }
  const counterMobile = document.getElementById('cart-count-mobile');
  if (counterMobile) {
    counterMobile.textContent = count;
  }
}

// при загрузке страницы
document.addEventListener('DOMContentLoaded', updateCartCount);



const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.querySelectorAll('.cart'); // кнопка в шапке
const closeCartBtn = document.getElementById('close-cart');

function openCart() {
  cartPanel.classList.add('active');
  cartOverlay.classList.add('active');
  renderCart();
}

function closeCart() {
  cartPanel.classList.remove('active');
  cartOverlay.classList.remove('active');
}

// Вешаем событие на каждую найденную кнопку (и ПК, и мобилка)
cartBtn?.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openCart();
  });
});

closeCartBtn?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);



function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-price');

  container.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <img src="${item.image}">
      <div>
        <div>${item.name}</div>
        <div>${item.price} ₴</div>
        <div>
          <button data-id="${item.id}" class="minus">−</button>
          ${item.quantity}
          <button data-id="${item.id}" class="plus">+</button>
          <button data-id="${item.id}" class="remove">🗑</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = total + ' ₴';
}



document.addEventListener('click', e => {
  if (!e.target.dataset.id) return;

  const id = Number(e.target.dataset.id);
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (!item) return;

  if (e.target.classList.contains('plus')) {
    item.quantity++;
  }

  if (e.target.classList.contains('minus')) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }
  }

  if (e.target.classList.contains('remove')) {
    cart.splice(cart.indexOf(item), 1);
  }

  saveCart(cart);
  renderCart();

  if (typeof syncCartButtons === 'function') {
    syncCartButtons(); 
  } else if (typeof updateAllCartButtons === 'function') {
    // Если ты назвал функцию так, как мы писали ранее
    updateAllCartButtons();
  }
});


const goCheckoutBtn = document.getElementById('go-checkout');

goCheckoutBtn?.addEventListener('click', () => {
  const cart = getCart();

  if (cart.length === 0) {
    alert('Кошик порожній');
    return;
  }

  window.location.href = 'checkout.html';
});

function isInCart(productId) {
  const cart = getCart();
  return cart.some(item => item.id === productId);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartButtonState(btn, inCart) {
  if (!btn) return;

  if (inCart) {
    btn.classList.add('in-cart');
    // Полностью обновляем содержимое кнопки для состояния "В корзине"
    btn.innerHTML = `В кошику <img src="img/tray.png" style="filter: brightness(0) invert(1);">`;
  } else {
    btn.classList.remove('in-cart');
    // Полностью возвращаем исходное состояние
    btn.innerHTML = `Додати <img src="img/trayy.png" alt="Кошик">`;
  }
}

// Эта функция теперь правильно вызывает обновление для всех кнопок
function syncCartButtons() {
  const allBtns = document.querySelectorAll('.card-btn');
  allBtns.forEach(btn => {
    const id = Number(btn.dataset.id);
    if (!id) return;
    updateCartButtonState(btn, isInCart(id));
  });
}