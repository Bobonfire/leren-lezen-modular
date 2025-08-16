import { REWARD_TIERS } from '../constants.js';
import { state, setStars, addSticker } from './state.js';

export function nextThreshold(stars = state.stars){
  for(const t of REWARD_TIERS) if(stars < t.threshold) return t;
  return null;
}

export function checkAndAward(onSticker){
  const tier = REWARD_TIERS.find(t => t.threshold === state.stars);
  if(tier && !state.stickers.includes(tier.sticker)){
    addSticker(tier.sticker);
    onSticker && onSticker(tier.sticker);
  }
}

export function incrementStarsWithAntiGuess(streakBonusEvery = 5){
  let newStreak = state.streak;
  if(state.firstTry){
    setStars(state.stars + 1);
    newStreak = state.streak + 1;
    if(newStreak % streakBonusEvery === 0){
      setStars(state.stars + 1);
    }
  } else {
    newStreak = 0;
  }
  return newStreak;
}
