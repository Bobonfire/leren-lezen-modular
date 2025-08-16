import { $ } from './dom.js';
export function fireConfetti(){
  const c = $('#confetti');
  const emojis = ['🎉','✨','⭐','🎊','💫'];
  for(let i=0;i<24;i++){
    const el = document.createElement('i');
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    el.style.left = Math.random()*100 + '%';
    el.style.transform = `translateY(0) rotate(${Math.random()*180}deg)`;
    c.appendChild(el);
    setTimeout(()=> el.remove(), 2300);
  }
}
