let revealObserver;

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
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.2
    }
  );

  document.querySelectorAll('[data-reveal]').forEach((target, index) => {
    target.classList.remove('revealed');
    target.style.setProperty('--delay', `${index * 70}ms`);
    revealObserver.observe(target);
  });

  document.querySelectorAll('[data-pulse]').forEach(bindPulseCard);
};

document.addEventListener('astro:page-load', initPageMotion);
initPageMotion();
