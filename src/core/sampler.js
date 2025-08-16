export function pick(list, recent, key){
  const get = x => key ? x[key] : x;
  let candidates = list.filter(x => !recent.includes(get(x)));
  if(candidates.length === 0){ recent.length = 0; candidates = list.slice(); }
  return candidates[Math.floor(Math.random()*candidates.length)];
}
