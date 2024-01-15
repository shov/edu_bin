import {
  ReactNode,
  createContext,
  FC,
  useReducer,
  useRef,
  useState,
  useEffect,
} from 'react'
import {
  LetterLinkedList,
  TLetterLinkedListAction,
  TLetterLinkedListStateObject,
} from 'infrastructure_common'
import React from 'react'
import { ServerAdapter } from '../app/ServerAdapter'
import { Loading } from '../components/Loading/Loading'
import { v4 } from 'uuid'

export const LetterLinkedListContext =
  createContext<TLetterLinkedListStateObject>(null as any)
export const LetterLinkedListDispatchContext = createContext<
  React.Dispatch<TLetterLinkedListAction>
>(null as any)
const textList = new LetterLinkedList(v4)

export const TextContext: FC<{ children: ReactNode }> = ({ children }) => {
  const [textObj, textDispatch] = useReducer(textList.reducer.bind(textList), {
    state: textList,
  })

  const isInit = useRef(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isInit.current) {
      isInit.current = true
      ServerAdapter.fetchPlainTextIinitState()
        .then((res) => {
          textDispatch({
            type: LetterLinkedList.ACTION.INIT,
            value: res.plainText,
          })
        })
        .catch((e) => {
          console.error(e.message, e.stack, e)
          alert(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  return (
    <LetterLinkedListContext.Provider value={textObj}>
      <LetterLinkedListDispatchContext.Provider value={textDispatch}>
        {!loading ? children : <Loading/>}
      </LetterLinkedListDispatchContext.Provider>
    </LetterLinkedListContext.Provider>
  )
}
