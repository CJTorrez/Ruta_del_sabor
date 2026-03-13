// ===== HOME: Search & Categories =====
function toggleSearch() {
  showToast('Busqueda disponible proximamente');
}

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
