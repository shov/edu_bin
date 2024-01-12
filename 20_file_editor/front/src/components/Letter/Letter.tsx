import { Fragment } from 'react'
import { LAST_LETTER, NEW_LINE, TLetter } from './contract'
import classDict from './letter.module.css'

// pass letter as a children. React.FC
export const Letter: React.FC<{
  children: TLetter
  onClick: (letter: TLetter) => void
}> = ({ children, onClick }) => {
  const display = toDisplay(children.value)
  const isLast = children.value === LAST_LETTER
  const isNewLine = children.value === NEW_LINE
  return (
    <div
      className={
        children.isCursor() ? classDict.cursoredLetter : classDict.letter 
        + (isNewLine ? ' ' + classDict.newLine : '')
      }
      onClick={(e) => {
        e.stopPropagation()
        onClick(children)
      }}
    >
      {display}{isLast ? '$' : ''}
    </div>
  )
}

function toDisplay(value: string | symbol): string | JSX.Element {
  if ('symbol' === typeof value) {
    return ''
  }

  if (' ' === value) {
    return <Fragment>&nbsp;</Fragment>
  }

  return value
}
