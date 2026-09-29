document.querySelectorAll('.faq-question').forEach(button=>{
  button.addEventListener('click',()=>{
    const item=button.closest('.faq-item');
    const isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(other=>{
      other.classList.remove('open');
      other.querySelector('.faq-question').setAttribute('aria-expanded','false');
    });
    if(!isOpen){item.classList.add('open');button.setAttribute('aria-expanded','true');}
  });
});
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);});
document.querySelectorAll('.nav-links a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');}));
const back=document.querySelector('.back-top');
window.addEventListener('scroll',()=>back.classList.toggle('show',window.scrollY>450));
back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
