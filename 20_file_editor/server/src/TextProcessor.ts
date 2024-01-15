import { LetterLinkedList, TTextState, Serializer, TTextUpdate } from 'infrastructure_common';
import { v4 as uuidv4 } from 'uuid';
import { TContext } from './Context';

export class TextProcessor {
   protected text: LetterLinkedList = new LetterLinkedList(uuidv4);

   protected cursorMap = new Map<TContext, string>(); // clean memory manually

   constructor() {
    this.text.fillInWithText('Stub');
   }

   snapShotState(context: TContext): TTextState {
    const letterList = Serializer.serializeArray([...this.text]);
     const otherUserCursorList = [...this.cursorMap.keys()].filter(key => key !== context).map(key => this.cursorMap.get(key)!);

      return {
        letterList,
        cursorId: this.cursorMap.get(context) || letterList[0]?.id,
        otherUserCursorList,
      }
   }

   processUpdate(context: TContext, update: TTextUpdate) {
    
   }
}