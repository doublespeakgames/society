export const arrayOf = <T>(length:number, fn:(index:number) => T):T[] =>
  Array.from({ length }, (_, i) => fn(i));