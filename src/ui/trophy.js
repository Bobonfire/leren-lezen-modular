import { $, el } from './dom.js';
import { REWARD_TIERS } from '../constants.js';

export function renderTrophyCase(stickers){
  const grid = $('#trophy-grid'); grid.innerHTML = '';
  REWARD_TIERS.forEach(t=>{
    const unlocked = stickers.includes(t.sticker);
    const item = el('div',{className:'trophy-item'+(unlocked?'':' locked')});
    item.dataset.label = t.sticker;
    item.append(el('span',{className:'trophy-emoji', textContent:t.sticker.split(' ')[0]}));
    item.append(el('span',{textContent:`${t.sticker} — ${t.threshold}⭐`}));
    grid.append(item);
  });
}
export function flashSticker(sticker){
  const item = [...document.querySelectorAll('#trophy-grid .trophy-item')]
    .find(x=>x.dataset.label===sticker);
  if(item){ item.classList.add('flash'); setTimeout(()=>item.classList.remove('flash'), 1000); }
}
export function setNextText(text){ $('#sticker-next').textContent = text; }
export function animateStickerToTrophy(sticker){
  const float = $('#sticker-float');
  float.textContent = sticker.split(' ')[0];
  float.classList.add('show');
  setTimeout(()=> float.classList.remove('show'), 2000);
  setTimeout(()=> flashSticker(sticker), 900);
}
