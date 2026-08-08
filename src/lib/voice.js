import { writable } from 'svelte/store';

export const isMuted = writable(false);

let currentUtterance = null;

export function speak(text) {
  let muted = false;
  const unsubscribe = isMuted.subscribe((value) => (muted = value));
  unsubscribe();

  if (muted) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  currentUtterance = utterance;

  window.speechSynthesis.speak(utterance);
}

export function toggleMute() {
  isMuted.update((muted) => {
    if (!muted) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
    return !muted;
  });
}