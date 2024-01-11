import { TLetter } from "../Letter/contract";
import * as uuid from 'uuid';

export type TLetterLinkedListAction = {
  type: typeof LetterLinkedList['ACTION'][keyof typeof LetterLinkedList['ACTION']];
  value: any,
}
export type TLetterLinkedListStateObject = {state: LetterLinkedList}

export class LetterLinkedList implements Iterable<TLetter> {
  static readonly ACTION = {
    INIT: 'INIT',
    DELETE: 'DELETE',
  } as const;

  public reducer(state: TLetterLinkedListStateObject, action: TLetterLinkedListAction): TLetterLinkedListStateObject {
    console.log('LetterLinkedList.reducer', action);
    switch (action.type) {
      case LetterLinkedList.ACTION.INIT:
        return {state: this.init(action.value)};
      case LetterLinkedList.ACTION.DELETE:
        return {state: this}; // TODO implement
      default:
        return {state: this};
    }
  };

  protected _head: TLetter | undefined;
  protected _tail: TLetter | undefined;
  protected _length: number;

  constructor() {
    const lastLetter = {
      id: 'last',
      value: Symbol('LAST_LETTER'),
      next: void 0,
      prev: void 0,
    };

    this._head = lastLetter;
    this._tail = lastLetter;
    this._length = 1;
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

  protected init(value: string): LetterLinkedList {
    for (let i = 0; i < value.length; i++) {
      this.add(value[i]);
    }
    return this;
  }

  public add(value: string): LetterLinkedList {
    const letter: TLetter = {
      id: uuid.v4(),
      value,
      next: void 0,
      prev: void 0,
    };

    // the tail is always the last letter
    // we put new one before the tail, but after the previous last letter
    // if the last letter is the head, we set new on as the head and prev to be void 0
    if (this._tail === this._head) {
      this._head = letter;
      letter.prev = void 0;
      letter.next = this._tail;
    } else {
      letter.prev = this._tail!.prev;
      letter.prev!.next = letter;
    }
    this._tail!.prev = letter;


    this._length++;

    return this;
  }
}