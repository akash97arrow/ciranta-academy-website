const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');

toggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const filters = document.querySelectorAll('.category');
const cards = document.querySelectorAll('.card');

filters.forEach(filter => {
  filter.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    filter.classList.add('active');

    const value = filter.dataset.filter;

    cards.forEach(card => {
      const show = value === 'all' || card.dataset.category === value;
      card.style.display = show ? '' : 'none';
    });
  });
});
