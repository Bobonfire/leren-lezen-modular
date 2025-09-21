import { $, el } from '../ui/dom.js';
import { state, setStreak, setFirstTry, pushRecent, subscribe } from '../core/state.js';
import { NO_REPEAT_WINDOW } from '../constants.js';
import { pick } from '../core/sampler.js';
import { checkAndAward, nextThreshold, incrementStarsWithAntiGuess } from '../core/rewards.js';
import { fireConfetti } from '../ui/confetti.js';
import { ensureStartAllowed } from '../core/timer.js';
import { showPauseOverlay } from '../ui/overlay.js';
import { CVC_WORDS, CVC_LETTERS } from '../data/cvc_words.js';
import { animateStickerToTrophy } from '../ui/trophy.js';

export function mountCVC(){
  const root = $('#screen-cvc');
  root.innerHTML = '';

  const toolbar = el('div',{className:'toolbar'},
    el('button',{className:'btn secondary', id:'cvc-back', textContent:'\u2190 Home'}),
    el('div',{className:'pill', textContent:'Leren schrijven'}),
    el('div',{className:'pill'}, '\u2B50 ', el('span',{id:'stars-cvc'})),
    el('div',{className:'pill'}, '\u{1F525} ', el('span',{id:'streak-cvc'})),
    el('div',{className:'pill'}, '\u{1F3AF} Nog ', el('span',{id:'countdown-cvc'}),' goed')
  );

  const hint = el('div',{className:'center big cvc-hint'},
    el('span',{className:'cvc-clue-icon'},'\u{1F5BC}'),
    el('span',{id:'cvc-clue', className:'cvc-clue'}));
  const helper = el('div',{className:'center muted', textContent:'Schrijf het woord met de letters.'});
  const slots = el('div',{id:'slots', className:'slots'});
  const grid = el('div',{id:'letter-grid', className:'grid cols-4'});
  root.append(toolbar, hint, helper, slots, grid);

  $('#cvc-back').onclick = ()=> history.back();

  function updateCountdown(){
    const nxt = nextThreshold(state.stars);
    $('#countdown-cvc').textContent = nxt ? (nxt.threshold - state.stars) : 0;
  }

  function syncToolbar(){
    const sEl = $('#stars-cvc');
    const tEl = $('#streak-cvc');
    if (sEl) sEl.textContent = state.stars;
    if (tEl) tEl.textContent = state.streak;
    updateCountdown();
  }

  // live updates
  const unsubscribe = subscribe(syncToolbar);

  let target = null;
  let filled = [];
  let choices = [];
  let wrongAttempts = 0;
  let correctSet = new Set();

  const TOTAL_CHOICES = 6; // for 3-letter CVC words

  function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildChoices(word){
    const uniqWordLetters = Array.from(new Set(word.split('')));
    const exclude = new Set(uniqWordLetters);
    const pool = CVC_LETTERS.filter(ch => !exclude.has(ch));
    // pick distractors without duplicates
    const distractors = [];
    while (distractors.length + uniqWordLetters.length < TOTAL_CHOICES && pool.length){
      const idx = Math.floor(Math.random() * pool.length);
      distractors.push(pool.splice(idx,1)[0]);
    }
    return shuffle([...uniqWordLetters, ...distractors]);
  }

  function renderGrid(){
    grid.innerHTML = '';
    choices.forEach(ch => {
      const b = el('button',{className:'tile', textContent:ch});
      b.onclick = () => {
        if(!ensureStartAllowed(showPauseOverlay)) return;
        placeLetter(ch);
      };
      grid.append(b);
    });
    // backspace/delete button
    const del = el('button',{className:'tile', textContent:'\u232B'}); // ⌫
    del.title = 'Verwijder laatste letter';
    del.onclick = () => {
      if(!ensureStartAllowed(showPauseOverlay)) return;
      deleteLast();
    };
    grid.append(del);
    if(wrongAttempts >= 3){
      highlightCorrectLetters();
    }
  }

  function newRound(){
    setFirstTry(true);
    target = pick(CVC_WORDS, state.recentWords, 'word');
    const word = target.word;
    filled = Array(word.length).fill('');
    wrongAttempts = 0;
    correctSet = new Set(word.split(''));
    $('#cvc-clue').textContent = target.clue || '';
    slots.innerHTML = '';
    for(let i = 0; i < word.length; i++){
      slots.append(el('div',{className:'slot', textContent:'_', dataset:{ index:i }}));
    }
    choices = buildChoices(word);
    renderGrid();
    syncToolbar();
  }

  function placeLetter(ch){
    const idx = filled.findIndex(x => !x);
    if(idx === -1) return;
    const slot = slots.children[idx];
    const word = target.word;
    filled[idx] = ch;
    slot.textContent = ch;
    if(word[idx] === ch){
      slot.classList.remove('err');
      slot.classList.add('ok');
      const newStreak = incrementStarsWithAntiGuess();
      setStreak(state.firstTry ? newStreak : 0);
    } else {
      slot.classList.remove('ok');
      slot.classList.add('err');
      wrongAttempts += 1;
      setFirstTry(false);
      setStreak(0);
      if(wrongAttempts >= 3){
        highlightCorrectLetters();
      }
    }

    // If all slots are filled, check the whole word
    if(filled.every(Boolean)){
      if(filled.join('') === word){
        pushRecent(word, NO_REPEAT_WINDOW);
        checkAndAward(animateStickerToTrophy);
        fireConfetti();
        setTimeout(newRound, 800);
      }
    }
    syncToolbar();
  }

  function deleteLast(){
    const idx = filled.slice().reverse().findIndex(x => x);
    if(idx === -1) return; // nothing to delete
    const trueIdx = filled.length - 1 - idx;
    const slot = slots.children[trueIdx];
    filled[trueIdx] = '';
    slot.textContent = '_';
    slot.classList.remove('ok','err');
    syncToolbar();
  }

  function highlightCorrectLetters(){
    const buttons = Array.from(grid.querySelectorAll('button.tile'));
    buttons.forEach(b => {
      const ch = b.textContent;
      if(correctSet.has(ch)) b.classList.add('ok');
    });
  }

  newRound();

  // optioneel: return () => unsubscribe();
}

