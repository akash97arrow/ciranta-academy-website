const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
const backTop = document.querySelector('.back-top');

toggle?.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 500);
});

backTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
