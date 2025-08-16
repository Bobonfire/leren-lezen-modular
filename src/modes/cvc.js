import { $, el } from '../ui/dom.js';
import { state, setStreak, setFirstTry, pushRecent } from '../core/state.js';
import { NO_REPEAT_WINDOW } from '../constants.js';
import { pick } from '../core/sampler.js';
import { checkAndAward, nextThreshold, incrementStarsWithAntiGuess } from '../core/rewards.js';
import { fireConfetti } from '../ui/confetti.js';
import { ensureStartAllowed } from '../core/timer.js';
import { showPauseOverlay } from '../ui/overlay.js';
import { CVC_WORDS, CVC_LETTERS } from '../data/cvc_words.js';
import { animateStickerToTrophy } from '../ui/trophy.js';

export function mountCVC(){
  const root = $('#screen-cvc'); root.innerHTML='';
  const toolbar = el('div',{className:'toolbar'},
    el('button',{className:'btn secondary', id:'cvc-back', textContent:'← Home'}),
    el('div',{className:'pill', textContent:'Bouw het woord'}),
    el('div',{className:'pill'}, '⭐ ', el('span',{id:'stars-cvc', textContent:state.stars})),
    el('div',{className:'pill'}, '🔗 ', el('span',{id:'streak-cvc', textContent:state.streak})),
    el('div',{className:'pill'}, '🎁 Nog ', el('span',{id:'countdown-cvc'}),' goed')
  );
  const hint = el('div',{className:'center muted big'},'🖼️ (plaatje) – ', el('span',{id:'cvc-hint'}));
  const slots = el('div',{id:'slots', className:'slots'});
  const grid = el('div',{id:'letter-grid', className:'grid cols-4'});
  root.append(toolbar, hint, slots, grid);

  $('#cvc-back').onclick = ()=> history.back();

  function updateCountdown(){
    const nxt = nextThreshold(state.stars);
    $('#countdown-cvc').textContent = nxt ? (nxt.threshold - state.stars) : 0;
  }

  let target = null, filled = [];

  function renderGrid(){
    grid.innerHTML = '';
    CVC_LETTERS.forEach(ch=>{
      const b = el('button',{className:'tile', textContent:ch});
      b.onclick = ()=>{
        if(!ensureStartAllowed(showPauseOverlay)) return;
        placeLetter(ch);
      };
      grid.append(b);
    });
  }

  function newRound(){
    setFirstTry(true);
    target = pick(CVC_WORDS, state.recentWords, null);
    filled = Array(target.length).fill('');
    $('#cvc-hint').textContent = target;
    slots.innerHTML='';
    for(let i=0;i<target.length;i++) slots.append(el('div',{className:'slot',textContent:'_',dataset:{index:i}}));
    renderGrid(); updateCountdown();
  }

  function placeLetter(ch){
    const idx = filled.findIndex(x=>!x);
    if(idx===-1) return;
    const slot = slots.children[idx];
    if(target[idx]===ch){
      filled[idx]=ch; slot.textContent=ch; slot.classList.remove('err'); slot.classList.add('ok');
      const newStreak = incrementStarsWithAntiGuess();
      setStreak(state.firstTry ? newStreak : 0);
      if(filled.every(Boolean)){
        pushRecent(target, NO_REPEAT_WINDOW);
        checkAndAward(animateStickerToTrophy);
        fireConfetti();
        setTimeout(newRound, 800);
      }
    } else {
      slot.classList.add('err');
      setFirstTry(false); setStreak(0);
      setTimeout(()=>{ slot.classList.remove('err'); slot.textContent='_'; }, 450);
    }
    updateCountdown();
  }

  newRound();
}
