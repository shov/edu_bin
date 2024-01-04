import { createContext } from "react"
import { useReducer } from "react";
import { buildDayListForToday, createDayListForMonth } from "./dayUtil";
import { TDay } from "./contracts";

export const DayContext = createContext<TDay[]>([])
export const DayDispatchContext = createContext<React.Dispatch<any>>(null as unknown as React.Dispatch<any>)

export enum EDayActionType {
  FILL_BY_MONTH = 'FILL_BY_MONTH',
  TOGGLE_DAY = 'TOGGLE_DAY',
}

const initialDayList: TDay[] = [];

export const DayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [dayList, dayListDispatch] = useReducer(dayListReducer, initialDayList);

  return (
    <DayContext.Provider value={dayList}>
      <DayDispatchContext.Provider value={dayListDispatch}>
        {children}
      </DayDispatchContext.Provider>
    </DayContext.Provider>
  )

}

const dayListReducer = (dayList: TDay[], action: any) => {
  switch (action.type) {
    case EDayActionType.FILL_BY_MONTH:
      return createDayListForMonth(action.month);
    case EDayActionType.TOGGLE_DAY:
      return dayList.map((day) => {
        if (day.key === action.key) {
          return {
            ...day,
            isRed: !day.isRed,
          };
        }
        return day;
      });
    default:
      return dayList;
  }
}