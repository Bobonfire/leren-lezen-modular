import { load, saveStars, saveStickers } from './storage.js';

const listeners = new Set();
const initial = load();

export const state = {
  stars: initial.stars,
  stickers: initial.stickers,
  streak: 0,
  firstTry: true,
  audioOn: true,
  recentWords: [], // laatste juiste woorden (voor no‑repeat)
};

/* ---------- Pub/Sub ---------- */
export function subscribe(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }
function emit(){ listeners.forEach(fn => fn(state)); }

/* ---------- Setters (en persistentie) ---------- */
export function setStars(v){ state.stars = v; saveStars(v); emit(); }
export function addSticker(s){
  if(!state.stickers.includes(s)){
    state.stickers.push(s);
    saveStickers(state.stickers);
    emit();
  }
}
export function setStreak(v){ state.streak = v; emit(); }
export function setFirstTry(v){ state.firstTry = v; emit(); }
export function toggleAudio(){ state.audioOn = !state.audioOn; emit(); }

/* ---------- Recent / no‑repeat venster ---------- */
export function pushRecent(word, windowSize){
  state.recentWords.push(word);
  if(state.recentWords.length > windowSize) state.recentWords.shift();
  emit();
}

/* ---------- Resets ---------- */
export function clearStickers(){
  state.stickers = [];
  saveStickers([]);
  emit();
}

/** Volledige sessie resetten (scores, streak, recent; optioneel ook stickers) */
export function resetSession({ resetStickers = false } = {}){
  state.stars = 0; saveStars(0);
  state.streak = 0;
  state.firstTry = true;
  state.recentWords = [];
  if(resetStickers){
    state.stickers = [];
    saveStickers([]);
  }
  emit();
}
