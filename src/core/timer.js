import { SESSION_LIMIT_MS, COOLDOWN_MS } from '../constants.js';
import { getCooldownUntil, setCooldownUntil } from './storage.js';

let sessionStart = 0, ticker = null;

export function isPaused(){ return Date.now() < getCooldownUntil(); }

export function ensureStartAllowed(showOverlay){
  const until = getCooldownUntil();
  if(Date.now() < until){ showOverlay(until); return false; }
  sessionStart = Date.now();
  if(ticker) clearInterval(ticker);
  ticker = setInterval(()=>{
    if(Date.now() - sessionStart >= SESSION_LIMIT_MS){
      const newUntil = Date.now() + COOLDOWN_MS;
      setCooldownUntil(newUntil);
      showOverlay(newUntil);
      clearInterval(ticker);
    }
  }, 1000);
  return true;
}
