import { useEffect, useReducer, useRef } from 'react'
import classDict from './textEditor.module.css'
import { Letter } from '../Letter/Letter'
import { ERelativePosition, LetterLinkedList } from './LetterLinkedList'
import { NEW_LINE, TLetter } from '../Letter/contract'

const textList = new LetterLinkedList()

export const TextEditor: React.FC = () => {
  const [textObj, textDispatch] = useReducer(textList.reducer.bind(textList), {
    state: textList,
  })

  function setCursor(id: string) {
    textDispatch({
      type: LetterLinkedList.ACTION.SET_CURSOR_BY_ID,
      value: id,
    })
  }

  function keyDownHandler(e: KeyboardEvent) {
    e.preventDefault()
    console.log(e.key)
    if (e.key === 'ArrowLeft') {
      textDispatch({
        type: LetterLinkedList.ACTION.MOVE_CURSOR_HORIZONTAL,
        value: ERelativePosition.PREV,
      })
    } else if (e.key === 'ArrowRight') {
      textDispatch({
        type: LetterLinkedList.ACTION.MOVE_CURSOR_HORIZONTAL,
        value: ERelativePosition.NEXT,
      })
    } else if (e.key === 'Backspace') {
      textDispatch({
        type: LetterLinkedList.ACTION.DELETE,
        value: ERelativePosition.PREV,
      })
    } else if (e.key === 'Delete') {
      textDispatch({
        type: LetterLinkedList.ACTION.DELETE,
        value: ERelativePosition.CURR,
      })
    } else if (e.key === 'Enter') {
      textDispatch({
        type: LetterLinkedList.ACTION.INSERT,
        value: NEW_LINE,
      })
    } else if (e.key.length === 1) {
      textDispatch({
        type: LetterLinkedList.ACTION.INSERT,
        value: e.key,
      })
    }
  }

  useEffect(() => {
    textDispatch({
      type: LetterLinkedList.ACTION.INIT,
      value: 'Hello world!',
    })

    // set keydown handler on the window
    window.addEventListener('keydown', keyDownHandler)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  const paragraphed = [...textObj.state].reduce<TLetter[][]>(
    (acc, letter) => {
      if (letter.value === NEW_LINE) {
        acc.push([letter])
      } else {
        acc[acc.length - 1].push(letter)
      }
      return acc
    },
    [[]]
  )

  return (
    <div
      className={classDict.textEditor}
      onClick={() => {
        setCursor(LetterLinkedList.LAST_LETTER_ID)
      }}
    >
      {paragraphed.map((paragraph, i) => (
        <div
          key={i}
          className={classDict.paragraph}
          onClick={(e) => {
            e.stopPropagation()
            setCursor(paragraph[paragraph.length - 1].id)
          }}
        >
          {paragraph.map((letter) => (
            <Letter
              key={letter.id}
              onClick={(letter: TLetter) => {
                setCursor(letter.id)
              }}
            >
              {letter}
            </Letter>
          ))}
        </div>
      ))}
    </div>
  )
}
