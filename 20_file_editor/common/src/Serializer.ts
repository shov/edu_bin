import { TSerializedLetter, TTextState } from "./Messaging";
import { TLetter, NEW_LINE, LAST_LETTER } from "./TLetter";
import { LetterLinkedList } from "./LetterLinkedList";

export class Serializer {
  static serializeLetter(letter: TLetter) {
    return {
      id: letter.id,
      value: Serializer.envalue(letter.value),
      next: letter.next ? letter.next.id : undefined,
      prev: letter.prev ? letter.prev.id : undefined,
    };
  }

  static deserializeTextState(state: TTextState): LetterLinkedList {
    const {letterList, cursorId, otherUserCursorList } = state;
    const index = new Map<string, TLetter>();
    const linkJobList: (() => void)[] = [];
    letterList.forEach((letter) => {
      const newLetter: TLetter = {
        id: letter.id,
        value: this.revalue(letter.value),
        next: void 0,
        prev: void 0,
        isCursor() { return letterLinkedList['_cursor'].letter === this },
      };
      index.set(letter.id, newLetter);
      linkJobList.push(() => {
        if (letter.next) {
          newLetter.next = index.get(letter.next);
        }
        if (letter.prev) {
          newLetter.prev = index.get(letter.prev);
        }
      })
    })
    linkJobList.forEach((linkJob) => linkJob())

    const letterLinkedList = LetterLinkedList.instantiateByList(index.get(letterList[0].id)!);
    letterLinkedList.setCursorById(cursorId);
    letterLinkedList.otherUserCursorList = otherUserCursorList.map(id => index.get(id)!); // nah one

    return letterLinkedList;
  }

  static serializeArray(letterArray: TLetter[]) {
    const serialized: TSerializedLetter[] = [];
    for (const letter of letterArray) {
      serialized.push(Serializer.serializeLetter(letter));
    }
    return serialized;
  }

  protected static envalue(srcValue: symbol | string): string {
    if (NEW_LINE === srcValue) {
      return '\n';
    }
    if (LAST_LETTER === srcValue) {
      return '\r';
    }
    return String(srcValue)[0];
  }

  protected static revalue(srcValue: string): string | symbol {
    if ('\n' === srcValue) {
      return NEW_LINE;
    }
    if ('\r' === srcValue) {
      return LAST_LETTER;
    }
    return srcValue;
  }
}