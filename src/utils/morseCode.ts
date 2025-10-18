const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '.-.-',
  "'": '.----.', '"': '.-..-.', '/': '-..-.', '(': '-.--.', ')': '-.--.',
  '+': '.-.-.', '=': '-...-', '-': '-....-', '_': '..--.-', ':': '---...',
  ';': '-.-.-.', '@': '.--.-.', '&': '.-...', '$': '...-..-', '%': '------',
  '#': '......', '*': '...-.', '~': '.-.--.', '`': '.----.', '\\': '-..-.',
  '|': '-.--.-', '<': '.-.-.', '>': '.-.-', '[': '-.-.--', ']': '--.-.',
  '{': '---.-', '}': '---.-.'
};

export const encodeToMorse = (text: string): string =>
  text.toUpperCase().split('').map(char => morseCodeMap[char] || char).join(' ');

export const decodeFromMorse = (morse: string): string => {
  const reverseMap: { [key: string]: string } = {};
  Object.entries(morseCodeMap).forEach(([char, code]) => {
    reverseMap[code] = char;
  });
  return morse.split(' ').map(code => reverseMap[code] || code).join('');
};

export const isMorseCode = (text: string): boolean => {
  const morseCodes = Object.values(morseCodeMap);
  const words = text.split(' ');
  return words.length > 0 && words.every(word => morseCodes.includes(word) || word === '');
};

export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

  if (diffInSeconds < 10) {
    return 'Just now';
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};
