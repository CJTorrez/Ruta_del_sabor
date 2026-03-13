// ===== RUTAS DETAIL =====
function showRutaDetail(index) {
  const ruta = rutasData[index];
  const lista = document.getElementById('rutas-lista');
  const detalle = document.getElementById('ruta-detalle');

  document.getElementById('ruta-detail-hero').style.background = "url('" + ruta.image + "') center/cover";
  document.getElementById('ruta-detail-badge').textContent = ruta.badge;
  document.getElementById('ruta-detail-title').textContent = ruta.title;
  document.getElementById('ruta-detail-meta').textContent = ruta.meta;

  document.getElementById('ruta-date-input').value = '';
  document.getElementById('ruta-date-selected').textContent = '';

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
