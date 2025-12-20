import { $ } from './ui/dom.js';
export function show(id){
  ['#screen-home','#screen-emoji','#screen-cvc','#screen-clock','#screen-math'].forEach(sel => $(sel).classList.add('hidden'));
  $(id).classList.remove('hidden');
}
