// ===== UPDATE TIME =====
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  document.querySelectorAll('.status-time').forEach(el => el.textContent = timeString);
}

updateTime();
setInterval(updateTime, 1000);
