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
