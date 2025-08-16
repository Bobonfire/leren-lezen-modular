import { $ } from './dom.js';
export function showPauseOverlay(untilTs){
  const overlay = $('#pause-overlay');
  const remainEl = $('#pause-remaining');
  overlay.classList.add('show');
  const tick = ()=>{
    const remain = Math.max(0, untilTs - Date.now());
    const s = Math.ceil(remain/1000), m = Math.floor(s/60), r = s%60;
    remainEl.textContent = `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
    if(remain <= 0){ overlay.classList.remove('show'); clearInterval(tid); }
  };
  tick();
  const tid = setInterval(tick, 1000);
}
