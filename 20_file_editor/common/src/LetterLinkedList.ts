import { NEW_LINE, TLetter } from "./TLetter";

export type TLetterLinkedListAction = {
  type: typeof LetterLinkedList['ACTION'][keyof typeof LetterLinkedList['ACTION']];
  value: any,
}
export type TLetterLinkedListStateObject = { state: LetterLinkedList }

export type TCursor = {
  letter: TLetter;
}

export enum ERelativePosition {
  PREV, CURR, NEXT
}

export class LetterLinkedList implements Iterable<TLetter> {
  static readonly ACTION = {
    INIT: 'INIT',
    SET_CURSOR_BY_ID: 'SET_CURSOR_BY_ID',
    DELETE: 'DELETE',
    INSERT: 'INSERT',
    MOVE_CURSOR_HORIZONTAL: 'MOVE_CURSOR_HORIZONTAL',

  } as const;

  static readonly LAST_LETTER_ID = 'last';

  protected isInitiated: boolean = false;

  public reducer(state: TLetterLinkedListStateObject, action: TLetterLinkedListAction): TLetterLinkedListStateObject {
    console.log('LetterLinkedList.reducer', action);
    switch (action.type) {
      case LetterLinkedList.ACTION.INIT:
        if (this.isInitiated) {
          return { state: this };
        }
        return { state: this.init(action.value) };
      case LetterLinkedList.ACTION.SET_CURSOR_BY_ID:
        return { state: this.setCursorById(action.value) };
      case LetterLinkedList.ACTION.DELETE: {
        const curr = this._cursor.letter;
        const toRemove = [curr.prev, curr, curr.next][action.value];
        if (!toRemove) {
          return { state: this };
        }
        return { state: this.remove(toRemove) };
      }
      case LetterLinkedList.ACTION.INSERT: 
        return { state: this.insert(action.value) };

      case LetterLinkedList.ACTION.MOVE_CURSOR_HORIZONTAL: {
        const curr = this._cursor.letter;
        const newPos = [curr.prev, curr, curr.next][action.value];
        if (!newPos) {
          return { state: this };
        }
        return { state: this.setCursorById(newPos.id) };
      }
      default:
        return { state: this };
    }
  };

  protected _head: TLetter | undefined;
  protected _tail: TLetter | undefined;
  protected _length: number;
  protected _cursor: TCursor;
  protected _indexIdMap: Map<string, TLetter> = new Map<string, TLetter>();
  protected _otherUserCursorList: TLetter[] = [];

  constructor(protected idGen: () => string) {
    const linkedListRef = this;
    const lastLetter = {
      id: LetterLinkedList.LAST_LETTER_ID,
      value: Symbol('LAST_LETTER'),
      next: void 0,
      prev: void 0,
      isCursor() { return this === linkedListRef._cursor.letter },
    };

    this._head = lastLetter;
    this._tail = lastLetter;
    this._length = 1;

    this._indexIdMap.set(lastLetter.id, lastLetter);

    this._cursor = {
      letter: this._head,
    };
  }

  [Symbol.iterator](): Iterator<TLetter, any, undefined> {
    let current: TLetter | undefined = this._head;
    return {
      next(): IteratorResult<TLetter> {
        if (current === void 0) {
          return {
            done: true,
            value: void 0,
          };
        }
        const value = current;
        current = current.next;
        return {
          done: false,
          value,
        };
      }
    }
  }

  public fillInWithText(text: string): LetterLinkedList {
    for (let i = 0; i < text.length; i++) {
      this.add(text[i]);
    }
    return this;
  }

  public fillWithList(letter: TLetter): LetterLinkedList {
    this._head = letter;
    this._length = 1;
    this._indexIdMap.set(letter.id, letter);
    let next: TLetter | undefined = letter;
    while (next = letter.next) {
      this._length++;
      this._tail = letter;
      this._indexIdMap.set(letter.id, letter);
    }
    return this;
  }

  public add(value: string | symbol): LetterLinkedList
  public add(value: TLetter): LetterLinkedList
  public add(value: string | symbol | TLetter): LetterLinkedList {
    if ('string' === typeof value || 'symbol' === typeof value) {
      return this.addValue(value);
    }
    throw new Error('Not implemented');
  }

  public insert(value: string | symbol): LetterLinkedList {
    const linkedListRef = this;
    const letter: TLetter = {
      id: this.idGen(),
      value: this.revalue(value),
      next: this._cursor.letter,
      prev: this._cursor.letter === this._head ? void 0 : this._cursor.letter.prev,
      isCursor() { return this === linkedListRef._cursor.letter },
    };

    if (letter.prev) {
      letter.prev.next = letter;
    }
    if (!letter.prev) {
      this._head = letter;
    }

    letter.next!.prev = letter;

    this._indexIdMap.set(letter.id, letter);

    this._length++;

    return this;
  }

  public remove(letter: TLetter): LetterLinkedList {
    if (letter.id === LetterLinkedList.LAST_LETTER_ID) {
      return this; // never remove the last letter
    }

    if(this._cursor.letter === letter) {
      this.setCursorById(letter.next!.id);
    }

    if (letter.prev) {
      letter.prev.next = letter.next;
    }
    if (letter.next) {
      letter.next.prev = letter.prev || void 0;
    }
    if (letter === this._head) {
      this._head = letter.next;
    }
    this._length--;
    this._indexIdMap.delete(letter.id);

    return this;
  }

  public setCursorById(id: string): LetterLinkedList {
    const letter = this._indexIdMap.get(id);
    if (letter === void 0) {
      throw new Error(`LetterLinkedList.setCursorById: no letter with id ${id}`);
    }
    this._cursor.letter = letter;
    return this;
  }

  public getCursor(): TCursor {
    return this._cursor;
  }

  public set otherUserCursorList(otherUserCursorList: TLetter[]) {
    this._otherUserCursorList = otherUserCursorList;
  }

  public get otherUserCursorList(): TLetter[] {
    return this._otherUserCursorList;
  }

  protected addValue(value: string | symbol): LetterLinkedList {
    const linkedListRef = this;
    const letter: TLetter = {
      id: this.idGen(),
      value: this.revalue(value),
      next: this._tail,
      prev: this._tail === this._head ? void 0 : this._tail!.prev,
      isCursor() { return this === linkedListRef._cursor.letter },
    };

    if (letter.prev) {
      letter.prev.next = letter;
    }
    if (!letter.prev) {
      this._head = letter;
    }

    letter.next!.prev = letter;

    this._indexIdMap.set(letter.id, letter);

    this._length++;

    return this;
  }

  protected init(value: string): LetterLinkedList {
    this.isInitiated = true;
    for (let i = 0; i < value.length; i++) {
      this.add(value[i]);
    }
    this.setCursorById(this._head!.id);
    return this;
  }

  protected revalue(srcValue: string | symbol): string | symbol {
    if( 'string' !== typeof srcValue) {
      return srcValue;
    }

    if(srcValue === '\n') {
      return NEW_LINE;
    }

    return srcValue;
  }
}
