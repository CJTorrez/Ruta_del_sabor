// ===== APP INIT =====
// Add spinner style
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
