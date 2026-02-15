import './styles/style.scss';
import { handleSubmit, loadTrip, renderTrip } from './js/app';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tripForm');
  form.addEventListener('submit', handleSubmit);

  const saved = loadTrip();
  if (saved) {
  renderTrip(saved, { loadedFromStorage: true });
  }
});

// Export for testing if needed later
export { handleSubmit };

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log(' SW registered:', reg.scope))
      .catch((err) => console.error(' SW registration failed:', err));
  });
} else {
  console.log(' Service workers not supported');
}
