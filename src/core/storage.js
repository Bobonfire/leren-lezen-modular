const KEYS = { STARS:'ll_stars', STICKERS:'ll_stickers', COOLDOWN:'ll_cooldown_until' };

export function load() {
  let stars = 0, stickers = [], cooldownUntil = 0;
  try {
    stars = parseInt(localStorage.getItem(KEYS.STARS) || '0', 10);
    stickers = JSON.parse(localStorage.getItem(KEYS.STICKERS) || '[]');
    cooldownUntil = parseInt(localStorage.getItem(KEYS.COOLDOWN) || '0', 10);
  } catch {}
  return { stars: Number.isFinite(stars) ? stars : 0, stickers: Array.isArray(stickers) ? stickers : [], cooldownUntil };
}
export function saveStars(v){ try{ localStorage.setItem(KEYS.STARS, String(v)); }catch{} }
export function saveStickers(arr){ try{ localStorage.setItem(KEYS.STICKERS, JSON.stringify(arr)); }catch{} }
export function setCooldownUntil(ts){ try{ localStorage.setItem(KEYS.COOLDOWN, String(ts)); }catch{} }
export function getCooldownUntil(){ return parseInt(localStorage.getItem(KEYS.COOLDOWN)||'0',10); }
