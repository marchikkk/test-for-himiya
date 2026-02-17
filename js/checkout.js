// Ждем полной загрузки HTML-дерева
document.addEventListener('DOMContentLoaded', () => {

    // 1. Ищем элементы внутри функции
    const itemsEl = document.getElementById('checkout-items');
    const sumProductsEl = document.getElementById('sum-products');
    const sumTotalEl = document.getElementById('sum-total');
    const submitBtn = document.getElementById('submit-order');

    // Проверяем, что мы именно на странице оформления (чтобы не было ошибок на других страницах)
    if (!itemsEl || !sumProductsEl || !sumTotalEl) {
        return; 
    }

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function renderCheckout() {
        const cart = getCart();
        let total = 0;

        itemsEl.innerHTML = ''; // Теперь itemsEl точно не null

        cart.forEach(item => {
            const sum = item.price * item.quantity;
            total += sum;

            itemsEl.insertAdjacentHTML('beforeend', `
                <div class="checkout-item">
                    <img src="${item.image}" style="width:50px;">
                    <div>
                        <div>${item.name}</div>
                        <div>${item.quantity} × ${item.price} ₴</div>
                    </div>
                    <div>${sum} ₴</div>
                </div>
            `);
        });

        sumProductsEl.textContent = total + ' ₴';
        sumTotalEl.textContent = total + ' ₴';
    }

    // Запускаем отрисовку
    renderCheckout();

    // 2. Обработка клика (тоже внутри, когда кнопка уже создана)
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!name || !lastname || !phone) {
                alert('Заповніть обовʼязкові поля');
                return;
            }

            const order = {
                id: Date.now(),
                customer: { name, lastname, phone },
                items: getCart(),
                total: sumTotalEl.textContent
            };

            console.log('ORDER:', order);

            localStorage.removeItem('cart');
            alert('Замовлення оформлено!');
            window.location.href = 'index.html';
        });
    }
});