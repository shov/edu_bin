import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from 'react'
import './textEditor.css'
import { Letter } from '../Letter/Letter'
import { LetterLinkedList } from './contract'

const textList = new LetterLinkedList()

export const TextEditor: React.FC = () => {
  const [textObj, textDispatch] = useReducer(
    textList.reducer.bind(textList),
    { state: textList}
  )

  const firstRender = useRef<boolean>(true)
  function init() {
    console.log('init 2')
    textDispatch({
      type: LetterLinkedList.ACTION.INIT,
      value: 'Hello world!',
    })
  }

  useEffect(() => {
    if(firstRender.current) {
      init()
      firstRender.current = false
    }
  }, [])

  return (
    <div className="text-editor">
      {[...textObj.state].map((letter) => (
        <Letter key={letter.id}>{letter}</Letter>
      ))}
    </div>
  )
}
