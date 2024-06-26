const lfsColor = {
  black: (text: string) => `^0${text}`,
  red: (text: string) => `^1${text}`,
  green: (text: string) => `^2${text}`,
  yellow: (text: string) => `^3${text}`,
  blue: (text: string) => `^4${text}`,
  magenta: (text: string) => `^5${text}`,
  cyan: (text: string) => `^6${text}`,
  white: (text: string) => `^7${text}`,
};

export default lfsColor;
