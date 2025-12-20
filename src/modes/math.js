import { $, el } from '../ui/dom.js';
import { state, setStreak, setFirstTry, pushRecent, resetSession, subscribe } from '../core/state.js';
import { NO_REPEAT_WINDOW } from '../constants.js';
import { pick } from '../core/sampler.js';
import { checkAndAward, nextThreshold, incrementStarsWithAntiGuess } from '../core/rewards.js';
import { fireConfetti } from '../ui/confetti.js';
import { ensureStartAllowed } from '../core/timer.js';
import { showPauseOverlay } from '../ui/overlay.js';
import { MATH_PROBLEMS } from '../data/math_problems.js';
import { animateStickerToTrophy } from '../ui/trophy.js';

export function mountMath(){
  const root = $('#screen-math');
  root.innerHTML = '';

  const toolbar = el('div',{className:'toolbar'},
    el('button',{className:'btn secondary', id:'math-back', textContent:'\u2190 Home'}),
    el('div',{className:'pill', textContent:'Leren rekenen'}),
    el('div',{className:'pill'}, '\u2B50 ', el('span',{id:'stars-math'})),
    el('div',{className:'pill'}, '\u{1F525} ', el('span',{id:'streak-math'})),
    el('div',{className:'pill'}, '\u{1F3AF} Nog ', el('span',{id:'countdown-math'}),' goed'),
    el('button',{className:'btn secondary', id:'math-reset', textContent:'\u{1F504} Reset'})
  );

  const sum = el('div',{className:'math-sum', id:'math-sum'},'0 + 0');
  const helper = el('div',{className:'center muted', textContent:'Kies het juiste antwoord.'});
  const options = el('div',{id:'math-options', className:'grid cols-2'});
  const feedback = el('div',{id:'math-feedback', className:'center muted math-feedback'});
  root.append(toolbar, sum, helper, options, feedback);

  $('#math-back').onclick = ()=> history.back();

  $('#math-reset').onclick = ()=>{
    resetSession({ resetStickers:true });
    syncToolbar();
    nextRound();
  };

  function updateCountdown(){
    const nxt = nextThreshold(state.stars);
    $('#countdown-math').textContent = nxt ? (nxt.threshold - state.stars) : 0;
  }

  function syncToolbar(){
    const sEl = $('#stars-math');
    const tEl = $('#streak-math');
    if (sEl) sEl.textContent = state.stars;
    if (tEl) tEl.textContent = state.streak;
    updateCountdown();
  }

  const unsubscribe = subscribe(syncToolbar);

  let current = null;

  function nextRound(){
    setFirstTry(true);
    current = pick(MATH_PROBLEMS, state.recentWords, 'key');
    $('#math-sum').textContent = current.label;

    feedback.textContent = '';
    options.innerHTML = '';

    const opts = new Set([current.answer]);
    while(opts.size < 4){
      const rnd = Math.floor(Math.random() * 11);
      opts.add(rnd);
    }

    [...opts].sort(()=>Math.random()-0.5).forEach(answer=>{
      const b = el('button',{ className:'btn word-option', textContent:String(answer) });

      b.onclick = ()=>{
        if(!ensureStartAllowed(showPauseOverlay)) return;
        [...options.children].forEach(x=>x.disabled = true);

        if(answer === current.answer){
          b.classList.add('ok');
          feedback.textContent = state.firstTry ? 'Top! Eerste poging! \u{1F3AF}' : 'Goed!';
          const newStreak = incrementStarsWithAntiGuess();
          setStreak(state.firstTry ? newStreak : 0);
          pushRecent(current.key, NO_REPEAT_WINDOW);
          checkAndAward(animateStickerToTrophy);
          fireConfetti();
          updateCountdown();
          setTimeout(nextRound, 900);
        } else {
          b.classList.add('err');
          feedback.textContent = 'Kijk nog eens goed.';
          setFirstTry(false);
          setStreak(0);
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
