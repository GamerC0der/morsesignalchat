export const APP_CONFIG = {
  NAME: 'MorseSignalChat',
  DESCRIPTION: 'Secure peer-to-peer chat with Morse code encryption',
  VERSION: '1.0.0',
  MAX_MESSAGE_LENGTH: 200,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, 
  API_BASE_URL: 'https://gamerc0der-http.hf.space/api',
} as const;

export const UI_CONSTANTS = {
  MODAL_AUTO_HIDE_DELAY: 10000, 
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
} as const;

export const MORSE_CODE = {
  DOT_DURATION: 100,
  DASH_DURATION: 300,
  LETTER_GAP: 100,
  WORD_GAP: 700,
} as const;
