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

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}){
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function pointOnCircle(cx, cy, r, deg){
  const rad = (Math.PI / 180) * deg;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function buildClockSvg(hour){
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const faceR = 90;
  const svg = svgEl('svg', {
    viewBox: `0 0 ${size} ${size}`,
    class: 'clock-svg',
    role: 'img',
    'aria-label': `Klok: ${hour} uur`
  });

  const face = svgEl('circle', { cx, cy, r: faceR, class: 'clock-face-circle' });

  const ticks = svgEl('g', { class: 'clock-ticks' });
  for(let i = 0; i < 60; i++){
    const isHour = i % 5 === 0;
    const angle = (i * 6) - 90;
    const outer = faceR;
    const inner = isHour ? faceR - 12 : faceR - 6;
    const start = pointOnCircle(cx, cy, inner, angle);
    const end = pointOnCircle(cx, cy, outer, angle);
    ticks.append(svgEl('line', {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      class: isHour ? 'clock-tick clock-tick-hour' : 'clock-tick'
    }));
  }

  const numbers = svgEl('g', { class: 'clock-numbers' });
  for(let n = 1; n <= 12; n++){
    const angle = (n * 30) - 90;
    const pos = pointOnCircle(cx, cy, 68, angle);
    const t = svgEl('text', {
      x: pos.x,
      y: pos.y,
      class: 'clock-number',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle'
    });
    t.textContent = String(n);
    numbers.append(t);
  }

  const minuteAngle = -90;
  const hourAngle = ((hour % 12) * 30) - 90;
  const minuteEnd = pointOnCircle(cx, cy, 72, minuteAngle);
  const hourEnd = pointOnCircle(cx, cy, 52, hourAngle);

  const hourHand = svgEl('line', {
    x1: cx,
    y1: cy,
    x2: hourEnd.x,
    y2: hourEnd.y,
    class: 'clock-hand clock-hand-hour'
  });
  const minuteHand = svgEl('line', {
    x1: cx,
    y1: cy,
    x2: minuteEnd.x,
    y2: minuteEnd.y,
    class: 'clock-hand clock-hand-minute'
  });
  const center = svgEl('circle', { cx, cy, r: 4, class: 'clock-center' });

  svg.append(face, ticks, numbers, hourHand, minuteHand, center);
  return svg;
}

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

  const clockFace = el('div',{className:'clock-face', id:'clock-face'});
  const helper = el('div',{className:'center muted', textContent:'Kies de juiste tijd.'});
  const options = el('div',{id:'clock-options', className:'grid cols-2'});
  const feedback = el('div',{id:'clock-feedback', className:'center muted clock-feedback'});
  root.append(toolbar, clockFace, helper, options, feedback);

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

  function renderClock(hour){
    clockFace.textContent = '';
    clockFace.append(buildClockSvg(hour));
  }

  function nextRound(){
    setFirstTry(true);
    wrongAttempts = 0;
    current = pick(CLOCK_HOURS, state.recentWords, 'label');
    renderClock(current.hour);

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
