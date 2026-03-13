// ===== PAYMENT =====
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
