// ===== CREAR RUTA =====
function toggleRouteStop(el) {
  el.classList.toggle('selected');
  updateRouteCount();
}

function updateRouteCount() {
  const selected = document.querySelectorAll('.route-producer.selected');
  const count = selected.length;

  selected.forEach((el, i) => {
    const check = el.querySelector('.route-check');
    check.classList.remove('empty');
    check.innerHTML = '<span>' + (i + 1) + '</span>';
  });

  document.querySelectorAll('.route-producer:not(.selected) .route-check').forEach(check => {
    check.classList.add('empty');
    check.innerHTML = '';
  });

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
