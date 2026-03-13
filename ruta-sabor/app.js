// ===== NAVIGATION =====
const history = ['screen-home'];

function navigateTo(screenId) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(screenId);
  if (!next || current === next) return;

  // Track history
  if (history[history.length - 1] !== screenId) {
    history.push(screenId);
  }

  // Animate transition
  current.classList.remove('active');
  current.classList.add('slide-out');
  next.classList.add('slide-in');

  setTimeout(() => {
    current.classList.remove('slide-out');
    next.classList.remove('slide-in');
    next.classList.add('active');
  }, 300);

  // Update tab bars
  updateTabBars(screenId);
}

function goBack() {
  if (history.length > 1) {
    history.pop();
    const prevScreen = history[history.length - 1];
    const current = document.querySelector('.screen.active');
    const prev = document.getElementById(prevScreen);
    if (!prev) return;

    current.classList.remove('active');
    prev.classList.add('active');
    updateTabBars(prevScreen);
  }
}

function updateTabBars(screenId) {
  document.querySelectorAll('.tab-bar').forEach(bar => {
    bar.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
      const onclick = tab.getAttribute('onclick');
      if (onclick && onclick.includes(screenId)) {
        tab.classList.add('active');
      }
    });
  });
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== SEARCH =====
function toggleSearch() {
  showToast('Busqueda disponible proximamente');
}

// ===== CATEGORIES =====
function filterCategory(el, cat) {
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('cat-active'));
  el.classList.add('cat-active');
  
  const cards = document.querySelectorAll('.near-cards .producer-card');
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    let show = false;
    if (cat === 'todos') {
      show = true;
    } else if (cat === 'cafe' && title.includes('cafe')) {
      show = true;
    } else if (cat === 'cacao' && title.includes('cacao')) {
      show = true;
    } else if (cat === 'comedor' && title.includes('comedor')) {
      show = true;
    }
    card.style.display = show ? 'flex' : 'none';
  });
  
  showToast('Filtrando por: ' + cat);
}

// ===== MAP (Leaflet + Geolocation) =====
let leafletMap = null;
let mapMarkers = [];

const producers = [
  // Cafe
  { name: 'Don Manuel - Cafe de Altura', type: 'cafe', rating: 4.9, distance: '1.2 km', digital: true, offset: [0.008, -0.005] },
  { name: 'Finca Santa Elena - Cafe', type: 'cafe', rating: 4.7, distance: '3.1 km', digital: true, offset: [-0.012, 0.006] },
  { name: 'Cafe Don Pedro Ixchel', type: 'cafe', rating: 4.5, distance: '4.8 km', digital: false, offset: [0.015, 0.011] },
  { name: 'Finca La Montana - Cafe', type: 'cafe', rating: 4.6, distance: '4.2 km', digital: false, offset: [-0.007, -0.008] },
  { name: 'Cafe Organico Los Altos', type: 'cafe', rating: 4.8, distance: '2.5 km', digital: true, offset: [0.004, -0.014] },
  { name: 'Finca El Cipres - Cafe', type: 'cafe', rating: 4.3, distance: '5.5 km', digital: false, offset: [-0.016, -0.003] },
  // Cacao
  { name: 'Finca Don Jose - Cacao', type: 'cacao', rating: 4.8, distance: '2.1 km', digital: true, offset: [0.006, 0.009] },
  { name: 'Cacao Fino La Cumbre', type: 'cacao', rating: 4.4, distance: '5.0 km', digital: false, offset: [-0.009, 0.004] },
  { name: 'Chocolates Doña Lupita', type: 'cacao', rating: 4.6, distance: '3.7 km', digital: true, offset: [0.013, -0.008] },
  { name: 'Cacao Ancestral Lenca', type: 'cacao', rating: 4.7, distance: '2.9 km', digital: true, offset: [-0.005, -0.013] },
  { name: 'Finca Rio Cacao', type: 'cacao', rating: 4.2, distance: '6.1 km', digital: false, offset: [0.018, 0.005] },
  // Comedores
  { name: 'Comedor Dona Rosa', type: 'comedor', rating: 4.7, distance: '3.5 km', digital: false, offset: [-0.004, 0.007] },
  { name: 'Comedor Dona Maria', type: 'comedor', rating: 4.5, distance: '2.8 km', digital: true, offset: [0.003, -0.01] },
  { name: 'Baleadas Tia Carmen', type: 'comedor', rating: 4.9, distance: '1.5 km', digital: true, offset: [-0.002, 0.012] },
  { name: 'Comedor El Rincon Lenca', type: 'comedor', rating: 4.3, distance: '4.0 km', digital: false, offset: [0.011, 0.014] },
  { name: 'Pupuseria Dona Santos', type: 'comedor', rating: 4.6, distance: '3.3 km', digital: true, offset: [-0.014, -0.006] },
  { name: 'Comedor La Milpa', type: 'comedor', rating: 4.4, distance: '5.2 km', digital: false, offset: [0.009, -0.016] },
  { name: 'Antojitos Copanecos', type: 'comedor', rating: 4.1, distance: '6.0 km', digital: false, offset: [-0.011, 0.015] },
];

const markerColors = {
  cafe: '#6F4E37',
  cacao: '#8B4513',
  comedor: '#D4A24E',
};

function initLeafletMap(lat, lng) {
  if (leafletMap) {
    leafletMap.invalidateSize();
    return;
  }

  leafletMap = L.map('leaflet-map', { zoomControl: false }).setView([lat, lng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(leafletMap);

  // User location marker
  const userIcon = L.divIcon({
    className: 'user-location-pin',
    html: '<div style="width:16px;height:16px;background:#4285F4;border:3px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(66,133,244,0.6);"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
  L.marker([lat, lng], { icon: userIcon }).addTo(leafletMap).bindPopup('Tu ubicacion');

  // Producer markers
  addProducerMarkers(lat, lng);

  // Close card when clicking on map
  leafletMap.on('click', () => {
    document.getElementById('map-card').style.display = 'none';
  });
}

function addProducerMarkers(lat, lng) {
  // Clear existing
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];

  producers.forEach(p => {
    const mLat = lat + p.offset[0];
    const mLng = lng + p.offset[1];
    const color = markerColors[p.type] || '#3A7D44';

    const icon = L.divIcon({
      className: 'producer-map-pin',
      html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;">
        <span style="transform:rotate(45deg);font-size:14px;">${p.type === 'cafe' ? '☕' : p.type === 'cacao' ? '🍫' : '🍽️'}</span>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const marker = L.marker([mLat, mLng], { icon }).addTo(leafletMap);
    marker.on('click', () => showMapCardFor(p));
    marker.producerData = p;
    mapMarkers.push(marker);
  });
}

function showMapCardFor(producer) {
  const card = document.getElementById('map-card');
  document.getElementById('map-card-name').textContent = producer.name;
  document.getElementById('map-card-rating').textContent = producer.rating;
  document.getElementById('map-card-distance').textContent = producer.distance;
  const badge = document.getElementById('map-card-badge');
  badge.style.display = producer.digital ? 'inline-block' : 'none';
  card.style.display = 'block';
}

function showMapCard() {
  const card = document.getElementById('map-card');
  card.style.display = card.style.display === 'none' ? 'block' : 'none';
}

// Initialize map when navigating to map screen
const originalNavigateTo = navigateTo;
navigateTo = function(screenId) {
  originalNavigateTo(screenId);
  if (screenId === 'screen-mapa') {
    setTimeout(() => {
      if (!leafletMap) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => initLeafletMap(pos.coords.latitude, pos.coords.longitude),
            () => initLeafletMap(14.84, -88.94) // Default: Copan Ruinas
          );
        } else {
          initLeafletMap(14.84, -88.94);
        }
      } else {
        leafletMap.invalidateSize();
      }
    }, 350);
  }
};

// ===== PILLS / FILTERS =====
function togglePill(el) {
  el.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');

  const filter = el.dataset.filter || 'todos';
  // Clear search input when using pills
  const searchInput = document.querySelector('.mapa-search-row .search-input');
  if (searchInput) searchInput.value = '';
  document.getElementById('mapa-no-results').style.display = 'none';
  filterMapMarkers(filter);
  showToast('Filtrando por: ' + filter);
}

function searchMapProducers(query) {
  if (!leafletMap) return;
  const q = query.toLowerCase().trim();
  const noResults = document.getElementById('mapa-no-results');
  document.getElementById('map-card').style.display = 'none';

  let visibleCount = 0;
  mapMarkers.forEach(marker => {
    const name = marker.producerData.name.toLowerCase();
    const type = marker.producerData.type.toLowerCase();
    const match = q === '' || name.includes(q) || type.includes(q);
    if (match) {
      if (!leafletMap.hasLayer(marker)) leafletMap.addLayer(marker);
      visibleCount++;
    } else {
      if (leafletMap.hasLayer(marker)) leafletMap.removeLayer(marker);
    }
  });

  noResults.style.display = (q !== '' && visibleCount === 0) ? 'flex' : 'none';
}

function filterMapMarkers(filter) {
  if (!leafletMap) return;

  // Hide map card when changing filter
  document.getElementById('map-card').style.display = 'none';

  mapMarkers.forEach(marker => {
    const type = marker.producerData.type;
    if (filter === 'todos' || type === filter) {
      if (!leafletMap.hasLayer(marker)) leafletMap.addLayer(marker);
    } else {
      if (leafletMap.hasLayer(marker)) leafletMap.removeLayer(marker);
    }
  });
}

// ===== PAYMENT =====
const pagosData = [
  {
    name: 'Don Manuel - Cafe de Altura', sub: 'Tour + Degustacion', total: 385,
    items: [
      { desc: 'Tour cafe (2 pers.)', price: 200 },
      { desc: 'Degustacion premium', price: 50 },
      { desc: '2 Tazas de cafe', price: 60 },
      { desc: 'Pan de casa (2)', price: 40 },
      { desc: 'Baleada sencilla', price: 35 },
    ]
  },
  {
    name: 'Chocolates Dona Lupita', sub: 'Taller de chocolate', total: 250,
    items: [
      { desc: 'Taller chocolate (2 pers.)', price: 150 },
      { desc: 'Caja bombones artesanales', price: 60 },
      { desc: 'Bebida de cacao', price: 40 },
    ]
  },
  {
    name: 'Baleadas Tia Carmen', sub: 'Almuerzo familiar', total: 180,
    items: [
      { desc: 'Baleada especial x3', price: 90 },
      { desc: 'Tajadas con carne', price: 45 },
      { desc: 'Jugos naturales x3', price: 45 },
    ]
  },
  {
    name: 'Miel Los Pinos', sub: 'Compra de productos', total: 320,
    items: [
      { desc: 'Miel organica 500ml', price: 120 },
      { desc: 'Miel con panela 350ml', price: 85 },
      { desc: 'Cera de abeja natural', price: 65 },
      { desc: 'Polen granulado', price: 50 },
    ]
  },
  {
    name: 'Finca Santa Elena', sub: 'Tour de cafe + bolsa 1lb', total: 450,
    items: [
      { desc: 'Tour completo (2 pers.)', price: 250 },
      { desc: 'Bolsa cafe 1lb tostado', price: 120 },
      { desc: 'Degustacion 3 variedades', price: 80 },
    ]
  }
];

function showPagoDetail(index) {
  const pago = pagosData[index];
  document.getElementById('pago-detail-name').textContent = pago.name;
  document.getElementById('pago-detail-sub').textContent = pago.sub;

  const container = document.getElementById('pago-detail-items');
  container.innerHTML = '';
  pago.items.forEach(item => {
    container.innerHTML += '<div class="pago-item"><span>' + item.desc + '</span><span>L ' + item.price + '</span></div>';
  });
  container.innerHTML += '<div class="pago-total"><span>Total</span><span class="total-amount">L ' + pago.total + '</span></div>';

  document.getElementById('pago-btn-text').innerHTML = '<i class="lucide lucide-lock"></i> Pagar ahora - L ' + pago.total;
  document.getElementById('pago-btn-text').dataset.total = pago.total;
  document.getElementById('pago-btn-text').dataset.name = pago.name;

  document.getElementById('pago-lista').style.display = 'none';
  document.getElementById('pago-detalle').style.display = 'flex';
  document.getElementById('pago-detail-btn').style.display = 'block';
}

function hidePagoDetail() {
  document.getElementById('pago-lista').style.display = 'flex';
  document.getElementById('pago-detalle').style.display = 'none';
  document.getElementById('pago-detail-btn').style.display = 'none';
}

function pagoGoBack() {
  const detalle = document.getElementById('pago-detalle');
  if (detalle.style.display !== 'none') {
    hidePagoDetail();
  } else {
    goBack();
  }
}

function selectPayment(el) {
  document.querySelectorAll('.pago-method').forEach(m => {
    m.classList.remove('selected');
    m.querySelector('.radio-dot').classList.remove('checked');
  });
  el.classList.add('selected');
  el.querySelector('.radio-dot').classList.add('checked');
}

function simulatePayment() {
  const btn = document.getElementById('pago-btn-text');
  const total = btn.dataset.total || '385';
  const name = btn.dataset.name || 'Don Manuel';
  btn.innerHTML = '<div class="spinner"></div> Procesando...';
  btn.style.pointerEvents = 'none';

  setTimeout(() => {
    btn.innerHTML = '<i class="lucide lucide-lock"></i> Pagar ahora - L ' + total;
    btn.style.pointerEvents = '';
    document.querySelector('#payment-success .payment-success-card p').textContent = 'L ' + total + ' enviados a ' + name;
    document.getElementById('payment-success').classList.add('show');
  }, 2000);
}

function closePaymentSuccess() {
  document.getElementById('payment-success').classList.remove('show');
}

// ===== MODALS =====
function showSearchModal() {
  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

// ===== REVIEWS =====
function showReviewModal() {
  document.getElementById('review-modal').classList.add('show');
}

function closeReviewModal() {
  document.getElementById('review-modal').classList.remove('show');
}

function setRating(n) {
  document.querySelectorAll('.star-input').forEach((s, i) => {
    s.classList.toggle('active', i < n);
  });
}

function submitReview() {
  closeReviewModal();
  showToast('Resena publicada! Gracias por tu apoyo');
}

function toggleLike(el) {
  el.classList.toggle('liked');
  const text = el.textContent.trim();
  const num = parseInt(text.match(/\d+/)?.[0] || '0');
  const isLiked = el.classList.contains('liked');
  el.innerHTML = '<i class="lucide lucide-thumbs-up"></i> ' + (isLiked ? num + 1 : num);
}

// ===== CREAR RUTA =====
function toggleRouteStop(el) {
  el.classList.toggle('selected');
  updateRouteCount();
}

function updateRouteCount() {
  const selected = document.querySelectorAll('.route-producer.selected');
  const count = selected.length;

  // Update numbers
  selected.forEach((el, i) => {
    const check = el.querySelector('.route-check');
    check.classList.remove('empty');
    check.innerHTML = '<span>' + (i + 1) + '</span>';
  });

  // Clear unselected
  document.querySelectorAll('.route-producer:not(.selected) .route-check').forEach(check => {
    check.classList.add('empty');
    check.innerHTML = '';
  });

  // Update summary
  document.getElementById('route-count').textContent = count + ' paradas seleccionadas';
  document.getElementById('gen-count').textContent = count;

  const times = [30, 45, 40, 25, 35];
  let total = 0;
  selected.forEach((_, i) => { total += times[i] || 30; });
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  document.getElementById('route-time').textContent = '~' + (hours > 0 ? hours + 'h ' : '') + mins + 'min';
}

function clearRoute() {
  document.querySelectorAll('.route-producer').forEach(el => {
    el.classList.remove('selected');
  });
  updateRouteCount();
  showToast('Ruta limpiada');
}

function generateRoute() {
  const count = document.querySelectorAll('.route-producer.selected').length;
  if (count === 0) {
    showToast('Selecciona al menos una parada');
    return;
  }
  showToast('Ruta generada con ' + count + ' paradas!');
  setTimeout(() => navigateTo('screen-rutas'), 1000);
}

function filterProducers(query) {
  const items = document.querySelectorAll('.route-producer');
  items.forEach(item => {
    const name = item.querySelector('strong').textContent.toLowerCase();
    item.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
  });
}

// ===== RUTAS DATA & DETAIL =====
const rutasData = [
  {
    title: 'Ruta del Cafe de Copan',
    badge: 'RUTA POPULAR',
    meta: '3h 30min · 5 paradas · 12 km',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&h=200&fit=crop',
    stops: [
      { name: 'Finca Don Pedro', desc: 'Cafe de altura, tour de secado y tostado artesanal', digital: true, tags: ['30 min', 'Cafe', 'Degustacion'] },
      { name: 'Comedor Dona Maria', desc: 'Baleadas, sopa de caracol y comida tipica lenca', digital: true, tags: ['45 min', 'Comida', 'Almuerzo'] },
      { name: 'Cafe Organico Los Altos', desc: 'Cafe de exportacion, vista panoramica al valle', digital: true, tags: ['35 min', 'Cafe', 'Mirador'] },
      { name: 'Finca Santa Elena', desc: 'Proceso completo del grano a la taza', digital: false, tags: ['40 min', 'Cafe', 'Tour'] },
      { name: 'Taller de Ceramica Lenca', desc: 'Artesanias pintadas a mano, tecnica ancestral', digital: false, tags: ['40 min', 'Artesania', 'Taller'] },
    ]
  },
  {
    title: 'Ruta del Cacao Lenca',
    badge: 'EXPERIENCIA UNICA',
    meta: '2h 45min · 4 paradas · 9 km',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=200&fit=crop',
    stops: [
      { name: 'Finca Don Jose - Cacao', desc: 'Plantacion de cacao fino, proceso de fermentacion', digital: true, tags: ['40 min', 'Cacao', 'Tour'] },
      { name: 'Chocolates Dona Lupita', desc: 'Taller de chocolate artesanal desde el grano', digital: true, tags: ['35 min', 'Chocolate', 'Degustacion'] },
      { name: 'Cacao Ancestral Lenca', desc: 'Bebida ceremonial de cacao preparada al estilo lenca', digital: false, tags: ['30 min', 'Cacao', 'Cultural'] },
      { name: 'Finca Rio Cacao', desc: 'Recorrido por senderos junto al rio con cacao silvestre', digital: false, tags: ['40 min', 'Naturaleza', 'Cacao'] },
    ]
  },
  {
    title: 'Sabores de Copan Ruinas',
    badge: 'GASTRONOMICA',
    meta: '4h · 6 paradas · 8 km',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=200&fit=crop',
    stops: [
      { name: 'Baleadas Tia Carmen', desc: 'Las mejores baleadas de Copan con frijoles caseros', digital: true, tags: ['30 min', 'Baleadas', 'Desayuno'] },
      { name: 'Comedor Dona Rosa', desc: 'Sopa de mondongo y platillos tipicos hondurenos', digital: false, tags: ['45 min', 'Comida', 'Tipico'] },
      { name: 'Pupuseria Dona Santos', desc: 'Pupusas rellenas al estilo copaneco', digital: true, tags: ['25 min', 'Pupusas', 'Antojitos'] },
      { name: 'Comedor El Rincon Lenca', desc: 'Gastronomia lenca con ingredientes de la milpa', digital: false, tags: ['40 min', 'Lenca', 'Cultural'] },
      { name: 'Antojitos Copanecos', desc: 'Tamales, riguas y atol de elote recien hecho', digital: false, tags: ['30 min', 'Antojitos', 'Merienda'] },
      { name: 'Comedor La Milpa', desc: 'Tortillas de maiz hecho a mano y cafe de olla', digital: true, tags: ['35 min', 'Comida', 'Cafe'] },
    ]
  },
  {
    title: 'Ruta Artesanal y Natural',
    badge: 'ECO-TURISMO',
    meta: '3h · 4 paradas · 10 km',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&h=200&fit=crop',
    stops: [
      { name: 'Miel Los Pinos', desc: 'Apiario organico, extraccion de miel y cata', digital: false, tags: ['35 min', 'Miel', 'Naturaleza'] },
      { name: 'Taller Ceramica Lenca', desc: 'Piezas unicas pintadas con tecnicas ancestrales', digital: false, tags: ['45 min', 'Artesania', 'Taller'] },
      { name: 'Jardin Medicinal Dona Ana', desc: 'Plantas medicinales y remedios naturales lencas', digital: false, tags: ['30 min', 'Plantas', 'Cultural'] },
      { name: 'Mirador El Cerrito', desc: 'Vista panoramica del valle con sendero ecologico', digital: false, tags: ['40 min', 'Mirador', 'Senderismo'] },
    ]
  },
  {
    title: 'Ruta Completa del Valle',
    badge: 'TODO EN UNO',
    meta: '5h 30min · 8 paradas · 18 km',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=200&fit=crop',
    stops: [
      { name: 'Finca Don Pedro - Cafe', desc: 'Tour de cafe con degustacion premium', digital: true, tags: ['30 min', 'Cafe', 'Tour'] },
      { name: 'Finca Don Jose - Cacao', desc: 'Proceso completo del cacao fino de aroma', digital: true, tags: ['35 min', 'Cacao', 'Tour'] },
      { name: 'Baleadas Tia Carmen', desc: 'Desayuno tipico copaneco', digital: true, tags: ['25 min', 'Comida', 'Desayuno'] },
      { name: 'Taller Ceramica Lenca', desc: 'Artesania ancestral pintada a mano', digital: false, tags: ['40 min', 'Artesania', 'Taller'] },
      { name: 'Miel Los Pinos', desc: 'Apiario y cata de mieles organicas', digital: false, tags: ['30 min', 'Miel', 'Naturaleza'] },
      { name: 'Comedor Dona Rosa', desc: 'Almuerzo tipico con sopa y plato fuerte', digital: false, tags: ['45 min', 'Comida', 'Almuerzo'] },
      { name: 'Chocolates Dona Lupita', desc: 'Taller de chocolate artesanal', digital: true, tags: ['35 min', 'Chocolate', 'Degustacion'] },
      { name: 'Mirador El Cerrito', desc: 'Atardecer panoramico sobre el valle', digital: false, tags: ['30 min', 'Mirador', 'Cierre'] },
    ]
  }
];

function showRutaDetail(index) {
  const ruta = rutasData[index];
  const lista = document.getElementById('rutas-lista');
  const detalle = document.getElementById('ruta-detalle');

  // Fill hero
  document.getElementById('ruta-detail-hero').style.background = "url('" + ruta.image + "') center/cover";
  document.getElementById('ruta-detail-badge').textContent = ruta.badge;
  document.getElementById('ruta-detail-title').textContent = ruta.title;
  document.getElementById('ruta-detail-meta').textContent = ruta.meta;

  // Reset date
  document.getElementById('ruta-date-input').value = '';
  document.getElementById('ruta-date-selected').textContent = '';

  // Fill stops
  const stopsContainer = document.getElementById('ruta-detail-stops');
  stopsContainer.innerHTML = '';
  ruta.stops.forEach((stop, i) => {
    const isLast = i === ruta.stops.length - 1;
    const digitalBadge = stop.digital ? '<span class="badge-digital small">Pago digital</span>' : '';
    const connector = !isLast ? '<div class="stop-connector"></div>' : '';
    const tags = stop.tags.map(t => '<span class="tag">' + t + '</span>').join('');

    stopsContainer.innerHTML +=
      '<div class="ruta-stop" onclick="navigateTo(\'screen-perfil\')">' +
        '<div class="stop-line">' +
          '<div class="stop-dot"></div>' +
          connector +
        '</div>' +
        '<div class="stop-info">' +
          '<div class="stop-header">' +
            '<strong>' + stop.name + '</strong>' +
            digitalBadge +
          '</div>' +
          '<p>' + stop.desc + '</p>' +
          '<div class="stop-tags">' + tags + '</div>' +
        '</div>' +
      '</div>';
  });

  // Show detail, hide list
  lista.style.display = 'none';
  detalle.style.display = 'flex';
}

function rutasGoBack() {
  const detalle = document.getElementById('ruta-detalle');
  if (detalle.style.display !== 'none') {
    hideRutaDetail();
  } else {
    goBack();
  }
}

function hideRutaDetail() {
  document.getElementById('rutas-lista').style.display = 'flex';
  document.getElementById('ruta-detalle').style.display = 'none';
}

function onRutaDateChange(value) {
  if (!value) return;
  const date = new Date(value + 'T00:00:00');
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const formatted = date.toLocaleDateString('es-HN', options);
  document.getElementById('ruta-date-selected').textContent = formatted;
  showToast('Fecha seleccionada: ' + formatted);
}

function startRuta() {
  const dateInput = document.getElementById('ruta-date-input').value;
  if (!dateInput) {
    showToast('Selecciona una fecha para tu ruta');
    return;
  }
  navigateTo('screen-navegacion');
}

// ===== INIT: Add spinner style =====
const style = document.createElement('style');
style.textContent = `
  .spinner {
    width: 20px; height: 20px;
    border: 3px solid rgba(26,18,7,0.2);
    border-top-color: #1A1207;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// ===== QR SCANNER SIMULATION =====
document.addEventListener('click', (e) => {
  if (e.target.closest('.qr-scanner')) {
    showToast('Escaneando... (simulado)');
    setTimeout(() => {
      showToast('Productor encontrado: Don Manuel');
      setTimeout(() => navigateTo('screen-perfil'), 1500);
    }, 1500);
  }
});

// ===== SWIPE BACK GESTURE =====
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
document.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (diff > 80 && touchStartX < 40) {
    goBack();
  }
});

// ===== UPDATE TIME =====
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  document.querySelectorAll('.status-time').forEach(el => el.textContent = timeString);
}

updateTime();
setInterval(updateTime, 1000);
