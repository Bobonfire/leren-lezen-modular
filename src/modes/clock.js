import { $, el } from '../ui/dom.js';
import { state, setStreak, setFirstTry, pushRecent, resetSession, subscribe } from '../core/state.js';
import { NO_REPEAT_WINDOW } from '../constants.js';
import { pick } from '../core/sampler.js';
import { checkAndAward, nextThreshold, incrementStarsWithAntiGuess } from '../core/rewards.js';
import { fireConfetti } from '../ui/confetti.js';
import { ensureStartAllowed } from '../core/timer.js';
import { showPauseOverlay } from '../ui/overlay.js';
import { CLOCK_HOURS } from '../data/clock_hours.js';
import { animateStickerToTrophy } from '../ui/trophy.js';

export function mountClock(){
  const root = $('#screen-clock');
  root.innerHTML = '';

  const toolbar = el('div',{className:'toolbar'},
    el('button',{className:'btn secondary', id:'clock-back', textContent:'\u2190 Home'}),
    el('div',{className:'pill', textContent:'Leren klok kijken'}),
    el('div',{className:'pill'}, '\u2B50 ', el('span',{id:'stars-clock'})),
    el('div',{className:'pill'}, '\u{1F525} ', el('span',{id:'streak-clock'})),
    el('div',{className:'pill'}, '\u{1F3AF} Nog ', el('span',{id:'countdown-clock'}),' goed'),
    el('button',{className:'btn secondary', id:'clock-reset', textContent:'\u{1F504} Reset'})
  );

  const symbol = el('div',{className:'clock-symbol', id:'clock-symbol'},'\u{1F550}');
  const helper = el('div',{className:'center muted', textContent:'Kies de juiste tijd.'});
  const options = el('div',{id:'clock-options', className:'grid cols-2'});
  const feedback = el('div',{id:'clock-feedback', className:'center muted', style:'margin-top:12px'});
  root.append(toolbar, symbol, helper, options, feedback);

  $('#clock-back').onclick = ()=> history.back();

  $('#clock-reset').onclick = ()=>{
    resetSession({ resetStickers:true });
    syncToolbar();
    nextRound();
  };

  function updateCountdown(){
    const nxt = nextThreshold(state.stars);
    $('#countdown-clock').textContent = nxt ? (nxt.threshold - state.stars) : 0;
  }

  function syncToolbar(){
    const sEl = $('#stars-clock');
    const tEl = $('#streak-clock');
    if (sEl) sEl.textContent = state.stars;
    if (tEl) tEl.textContent = state.streak;
    updateCountdown();
  }

  const unsubscribe = subscribe(syncToolbar);

  let current = null;
  let wrongAttempts = 0;
  let correctButton = null;

  function nextRound(){
    setFirstTry(true);
    wrongAttempts = 0;
    current = pick(CLOCK_HOURS, state.recentWords, 'label');
    $('#clock-symbol').textContent = current.emoji;

    feedback.textContent = '';
    options.innerHTML = '';
    correctButton = null;

    const opts = new Set([current.label]);
    while(opts.size < 4){
      const rnd = CLOCK_HOURS[Math.floor(Math.random()*CLOCK_HOURS.length)].label;
      if(!opts.has(rnd)) opts.add(rnd);
    }

    [...opts].sort(()=>Math.random()-0.5).forEach(label=>{
      const b = el('button',{ className:'btn word-option', textContent:label });
      if(label === current.label) correctButton = b;

      b.onclick = ()=>{
        if(!ensureStartAllowed(showPauseOverlay)) return;
        [...options.children].forEach(x=>x.disabled = true);

        if(label === current.label){
          b.classList.add('ok');
          feedback.textContent = state.firstTry ? 'Top! Eerste poging! \u{1F3AF}' : 'Goed!';
          const newStreak = incrementStarsWithAntiGuess();
          setStreak(state.firstTry ? newStreak : 0);
          pushRecent(current.label, NO_REPEAT_WINDOW);
          checkAndAward(animateStickerToTrophy);
          fireConfetti();
          updateCountdown();
          setTimeout(nextRound, 900);
        } else {
          b.classList.add('err');
          feedback.textContent = 'Kijk nog eens goed.';
          setFirstTry(false);
          setStreak(0);
          wrongAttempts += 1;
          if(wrongAttempts >= 2 && correctButton){
            correctButton.classList.add('ok');
          }
          setTimeout(()=>{
            [...options.children].forEach(x=>{ if(x !== b) x.disabled = false; });
          }, 500);
        }
      };

      options.append(b);
    });

    syncToolbar();
  }

  nextRound();

  // optioneel: return () => unsubscribe();
}
