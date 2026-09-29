const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menu?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
const back = document.querySelector('.back-top');
window.addEventListener('scroll', () => back.classList.toggle('show', window.scrollY > 450));
// back?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
