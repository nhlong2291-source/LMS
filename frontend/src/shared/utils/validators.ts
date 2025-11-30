export function isValidEmail(s: string) {
  return /\S+@\S+\.\S+/.test(s);
}

export function isValidPhone(s: string) {
  return /^\d{9,12}$/.test(s);
}
