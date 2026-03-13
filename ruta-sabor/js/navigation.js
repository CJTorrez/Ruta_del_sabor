// ===== NAVIGATION =====
const history = ['screen-home'];
const onNavigateCallbacks = [];

function onNavigate(callback) {
  onNavigateCallbacks.push(callback);
}

function navigateTo(screenId) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(screenId);
  if (!next || current === next) return;

  if (history[history.length - 1] !== screenId) {
    history.push(screenId);
  }

  current.classList.remove('active');
  current.classList.add('slide-out');
  next.classList.add('slide-in');

  setTimeout(() => {
    current.classList.remove('slide-out');
    next.classList.remove('slide-in');
    next.classList.add('active');
  }, 300);

  updateTabBars(screenId);

  // Notify listeners
  onNavigateCallbacks.forEach(cb => cb(screenId));
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

// Swipe back gesture
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
