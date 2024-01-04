import { createContext, useReducer } from 'react'
import { TMonth } from './contracts'
import { createMonthListForToday } from './dayUtil'

export const MonthContext = createContext<TMonth[]>([])
export const MonthDispatchContext = createContext<React.Dispatch<any>>(
  null as unknown as React.Dispatch<any>
)

// export enum EMonthActionType {

// }

const initialMonthList: TMonth[] = createMonthListForToday()

export const MonthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [monthList, monthListDispatch] = useReducer(
    monthListReducer,
    initialMonthList
  )

  return (
    <MonthContext.Provider value={monthList}>
      <MonthDispatchContext.Provider value={monthListDispatch}>
        {children}
      </MonthDispatchContext.Provider>
    </MonthContext.Provider>
  )
}

const monthListReducer = (monthList: TMonth[], action: any) => {
  switch (action.type) {
    default:
      return monthList
  }
}
