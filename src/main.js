// src/main.js
import { $ } from './ui/dom.js';
import { state, subscribe, toggleAudio, resetSession } from './core/state.js';
import { renderTrophyCase, setNextText } from './ui/trophy.js';
import { nextThreshold } from './core/rewards.js';
import { show as showScreen } from './router.js';
import { mountEmoji } from './modes/emoji.js';
import { mountCVC } from './modes/cvc.js';

/* ----------------------------
   Helpers
---------------------------- */
function setText(sel, v){
  const el = $(sel);
  if (el) el.textContent = v;
}

/* ----------------------------
   Topbar / Home UI updates
---------------------------- */
function updateHomeBar(){
  // Stars & streak on Home
  setText('#stars',  state.stars);
  setText('#streak', state.streak);

  // Countdown to next sticker
  const nxt = nextThreshold(state.stars);
  setText('#countdown-home', nxt ? (nxt.threshold - state.stars) : 0);

  // “Nog X tot …” tekst onder prijzenkast
  const txt = nxt
    ? `Nog ${nxt.threshold - state.stars} tot de volgende sticker (${nxt.sticker})`
    : 'Alle stickers verdiend! 🎉';
  setNextText(txt);

  // Prijzenkast renderen
  renderTrophyCase(state.stickers);
}

// Subscribe once so Home always reflects latest state (even terwijl je in een mode speelt)
subscribe(updateHomeBar);

/* ----------------------------
   Audio toggle
---------------------------- */
const btnAudio = $('#btn-audio');
if (btnAudio){
  btnAudio.onclick = () => {
    toggleAudio();
    // Visuele feedback op de knop (AAN/UIT)
    btnAudio.textContent = state.audioOn ? 'AAN' : 'UIT';
  };
  // Init label
  btnAudio.textContent = state.audioOn ? 'AAN' : 'UIT';
}

/* ----------------------------
   Navigatie → Emoji & CVC
   (start steeds met een frisse sessie)
---------------------------- */
const goEmoji = () => {
  resetSession({ resetStickers: true }); // nieuwe sessie (0 sterren, 0 streak, prijzenkast leeg)
  history.pushState({ page: 'emoji' }, '');
  showScreen('#screen-emoji');
  mountEmoji(); // emoji mode UI zorgt zelf voor z’n eigen counters
};
const goCVC = () => {
  resetSession({ resetStickers: true });
  history.pushState({ page: 'cvc' }, '');
  showScreen('#screen-cvc');
  mountCVC();
};

const btnEmoji = $('#nav-emoji');
const btnCVC   = $('#nav-cvc');
if (btnEmoji) btnEmoji.onclick = goEmoji;
if (btnCVC)   btnCVC.onclick   = goCVC;

/* ----------------------------
   Browser back/forward
---------------------------- */
window.onpopstate = () => {
  // Toon Home bij terug
  showScreen('#screen-home');
  // Home-bar meteen actualiseren (in geval van state-updates tijdens spel)
  updateHomeBar();
};

/* ----------------------------
   Init
---------------------------- */
updateHomeBar();
showScreen('#screen-home');
