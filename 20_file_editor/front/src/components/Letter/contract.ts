export type TLetter = {
  id: string;
  value: string | symbol;
  next: TLetter | undefined;
  prev: TLetter | undefined;
}

export const LAST_LETTER = Symbol('LAST_LETTER');