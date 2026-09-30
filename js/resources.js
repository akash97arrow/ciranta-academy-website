const nav=document.querySelector('.nav');
const toggle=document.querySelector('.menu-toggle');
toggle?.addEventListener('click',()=>nav.classList.toggle('open'));

document.querySelectorAll('.category').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.category').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
 const filter=btn.dataset.filter;
 document.querySelectorAll('.resource-card').forEach(card=>card.classList.toggle('hidden',filter!=='all'&&card.dataset.category!==filter));
}));
const topBtn=document.querySelector('.top-btn');
window.addEventListener('scroll',()=>topBtn.classList.toggle('show',window.scrollY>450));
topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
