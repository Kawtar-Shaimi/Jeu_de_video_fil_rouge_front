export const showToast = (message) => {
  const toastEl = document.getElementById('liveToast');
  toastEl.querySelector('.toast-body').textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
};