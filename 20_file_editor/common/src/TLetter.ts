export type TLetter = {
  id: string;
  value: string | symbol;
  next: TLetter | undefined;
  prev: TLetter | undefined;
  isCursor: () => boolean;
}

export const LAST_LETTER = Symbol('LAST_LETTER');
export const NEW_LINE = Symbol('NEW_LINE');