export enum EMessageName {
  TEXT_STATE = 'text_state',
}

export type TSerializedLetter = {
  id: string;
  value: string;
  next: string | undefined;
  prev: string | undefined;
}

export type TTextState = {
  letterList: TSerializedLetter[];
  cursorId: string;
  otherUserCursorList: string[];
}

export type TTextUpdate = {
  letterList: TSerializedLetter[];
  removedLetterIdList: string[];
  cursorId: string;
  timestamp: number;
}