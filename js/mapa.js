// ===== MAP (Leaflet + Geolocation) =====
let leafletMap = null;
let mapMarkers = [];

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

  addProducerMarkers(lat, lng);

  leafletMap.on('click', () => {
    document.getElementById('map-card').style.display = 'none';
  });
}

function addProducerMarkers(lat, lng) {
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
onNavigate(function(screenId) {
  if (screenId === 'screen-mapa') {
    setTimeout(() => {
      if (!leafletMap) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => initLeafletMap(pos.coords.latitude, pos.coords.longitude),
            () => initLeafletMap(14.84, -88.94)
          );
        } else {
          initLeafletMap(14.84, -88.94);
        }
      } else {
        leafletMap.invalidateSize();
      }
    }, 350);
  }
});

// ===== PILLS / FILTERS =====
function togglePill(el) {
  el.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');

  const filter = el.dataset.filter || 'todos';
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
