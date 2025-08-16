import { $, el } from '../ui/dom.js';
import { state, setStreak, setFirstTry, pushRecent, resetSession, subscribe } from '../core/state.js';
import { NO_REPEAT_WINDOW } from '../constants.js';
import { pick } from '../core/sampler.js';
import { checkAndAward, nextThreshold, incrementStarsWithAntiGuess } from '../core/rewards.js';
import { fireConfetti } from '../ui/confetti.js';
import { ensureStartAllowed } from '../core/timer.js';
import { showPauseOverlay } from '../ui/overlay.js';
import { EMOJI_WORDS } from '../data/emoji_words.js';
import { animateStickerToTrophy } from '../ui/trophy.js';

export function mountEmoji(){
  const root = $('#screen-emoji'); 
  root.innerHTML = '';

  const toolbar = el('div',{className:'toolbar'},
    el('button',{className:'btn secondary', id:'emoji-back', textContent:'← Home'}),
    el('div',{className:'pill', textContent:'Kies het juiste woord'}),
    el('div',{className:'pill'}, '⭐ ', el('span',{id:'stars-emoji'})),
    el('div',{className:'pill'}, '🔗 ', el('span',{id:'streak-emoji'})),
    el('div',{className:'pill'}, '🎁 Nog ', el('span',{id:'countdown-emoji'}),' goed'),
    el('button',{className:'btn secondary', id:'emoji-reset', textContent:'🔄 Reset'})
  );

  const symbol  = el('div',{className:'big', id:'emoji-symbol', style:'text-align:center;margin:12px'},'❓');
  const options = el('div',{id:'emoji-options', className:'grid cols-2'});
  const feedback= el('div',{id:'emoji-feedback',className:'center muted',style:'margin-top:12px'});
  root.append(toolbar, symbol, options, feedback);

  $('#emoji-back').onclick = ()=> history.back();

  // 🔄 Reset: alles terug naar 0 + stickers leeg + nieuwe ronde
  $('#emoji-reset').onclick = ()=>{
    resetSession({ resetStickers:true });
    syncToolbar();
    nextRound();
  };

  function updateCountdown(){
    const nxt = nextThreshold(state.stars);
    $('#countdown-emoji').textContent = nxt ? (nxt.threshold - state.stars) : 0;
  }

  function syncToolbar(){
    const sEl = $('#stars-emoji');
    const tEl = $('#streak-emoji');
    if (sEl) sEl.textContent = state.stars;
    if (tEl) tEl.textContent = state.streak;
    updateCountdown();
  }

  // live meebewegen met state-veranderingen (stars/streak)
  const unsubscribe = subscribe(syncToolbar);

  const isEmojiChar = (s) => /^[\u2190-\u2BFF\u1F300-\u1F9FF]$/.test(s);

  let current = null;

  function nextRound(){
    setFirstTry(true);
    current = pick(EMOJI_WORDS, state.recentWords, 'word');
    $('#emoji-symbol').textContent = current.emoji;

    feedback.textContent = '';
    options.innerHTML = '';

    const opts = new Set([current.word]);
    while(opts.size < 4){
      const rnd = EMOJI_WORDS[Math.floor(Math.random()*EMOJI_WORDS.length)].word;
      if(!opts.has(rnd)) opts.add(rnd);
    }

    [...opts].sort(()=>Math.random()-0.5).forEach(w=>{
      const className = isEmojiChar(w) ? 'btn emoji-option' : 'btn word-option';
      const b = el('button',{ className, textContent:w });

      b.onclick = ()=>{
        if(!ensureStartAllowed(showPauseOverlay)) return;
        [...options.children].forEach(x=>x.disabled = true);

        if(w === current.word){
          b.classList.add('ok');
          feedback.textContent = state.firstTry ? 'Top! Eerste poging! ⭐' : 'Goed!';
          const newStreak = incrementStarsWithAntiGuess();
          setStreak(state.firstTry ? newStreak : 0);
          pushRecent(current.word, NO_REPEAT_WINDOW);
          checkAndAward(animateStickerToTrophy);
          fireConfetti();
          updateCountdown();
          setTimeout(nextRound, 900);
        } else {
          b.classList.add('err');
          feedback.textContent = 'Rustig kijken…';
          setFirstTry(false);
          setStreak(0);
          setTimeout(()=>{
            [...options.children].forEach(x=>{ if(x!==b) x.disabled=false; });
          }, 500);
        }
      };

      options.append(b);
    });

    syncToolbar();
  }

  nextRound();

  // optioneel: netjes unsubscriben als je een unmount-systeem toevoegt
  // return () => unsubscribe();
}
