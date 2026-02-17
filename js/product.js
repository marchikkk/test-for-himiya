document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    console.error('Slug не вказаний');
    return;
  }

  const product = products.find(p => p.slug === slug);

  if (!product) {
    document.body.innerHTML = '<h2>Товар не знайдено</h2>';
    return;
  }

  renderProduct(product);
});

function renderProduct(product) {
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-article').textContent = `Артикул: ${product.article}`;
  document.getElementById('product-brand').textContent = product.brand;
  document.getElementById('product-price').textContent = `${product.price.toLocaleString()} ₴`;
  document.getElementById('product-image').src = product.image;
}
