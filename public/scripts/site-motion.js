const bindPulseCard = (card) => {
  if (card.dataset.pulseBound === '1') {
    return;
  }

  card.dataset.pulseBound = '1';
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
};

const initPageMotion = () => {
  document.querySelectorAll('[data-reveal]').forEach((target) => {
    target.classList.add('revealed');
  });

  document.querySelectorAll('[data-pulse]').forEach(bindPulseCard);
};

document.addEventListener('astro:page-load', initPageMotion);
initPageMotion();
