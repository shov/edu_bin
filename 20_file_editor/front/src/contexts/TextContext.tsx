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
  EMessageName,
  LetterLinkedList,
  TLetterLinkedListAction,
  TLetterLinkedListStateObject,
  TTextState,
} from 'infrastructure_common'
import React from 'react'
import { ServerAdapter } from '../app/ServerAdapter'
import { Loading } from '../components/Loading/Loading'
import { v4 } from 'uuid'
import { Socket } from 'socket.io-client'

export const LetterLinkedListContext =
  createContext<TLetterLinkedListStateObject>(null as any)
export const LetterLinkedListDispatchContext = createContext<
  React.Dispatch<TLetterLinkedListAction>
>(null as any)
const textList = new LetterLinkedList(v4)

const socket: Socket = ServerAdapter.socketConnect()

export const TextContext: FC<{ children: ReactNode }> = ({ children }) => {
  const [textObj, textDispatch] = useReducer(textList.reducer.bind(textList), {
    state: textList,
  })

  const [loading, setLoading] = useState(!socket.connected)

  useEffect(() => {
    const onConnect = () => {
      setLoading(false)
    }

    const onDisconnect = () => {
      setLoading(true)
    }

    const onTextState = (textState: TTextState) => {
      textDispatch({
        type: LetterLinkedList.ACTION.FILL_WITH_STATE,
        value: textState,
      })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on(EMessageName.TEXT_STATE, onTextState)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off(EMessageName.TEXT_STATE, onTextState)
    }
  }, [])

  return (
    <LetterLinkedListContext.Provider value={textObj}>
      <LetterLinkedListDispatchContext.Provider value={textDispatch}>
        {!loading ? children : <Loading />}
      </LetterLinkedListDispatchContext.Provider>
    </LetterLinkedListContext.Provider>
  )
}
