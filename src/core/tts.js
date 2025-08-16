export function speak(text){
  try{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'nl-NL'; u.rate = 0.9; u.pitch = 1.0;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch{}
}
