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
