document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('map');

  // если карты на странице нет — ничего не делаем
  if (!mapContainer) return;

  // создаём карту
  const map = L.map('map').setView([50.9077, 34.7981], 13);

  // слой OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // адреса магазинов
  document.querySelectorAll('.streets').forEach(street => {
    const lat = parseFloat(street.dataset.lat);
    const lng = parseFloat(street.dataset.lng);
    const name = street.innerText.trim();

    if (isNaN(lat) || isNaN(lng)) return;

    const marker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(name);

    street.addEventListener('click', () => {
      map.setView([lat, lng], 16, { animate: true });
      marker.openPopup();
    });
  });
});
