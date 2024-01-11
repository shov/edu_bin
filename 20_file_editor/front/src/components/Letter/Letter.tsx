import { Fragment } from 'react'
import { LAST_LETTER, TLetter } from './contract'
import './letter.css'

// pass letter as a children. React.FC
export const Letter: React.FC<{children: TLetter}> = ({children}) => {
  const display =  toDisplay(children.value)
  const isLast = children.value === LAST_LETTER
  return <>{!isLast && <div className="letter" >{display}</div>}</>
}

function toDisplay(value: string | symbol): string | JSX.Element {
  if('symbol' === typeof value) {
    return ''
  }

  if(' ' === value) {
    return (<Fragment>&nbsp;</Fragment>)
  }

  return value
}
