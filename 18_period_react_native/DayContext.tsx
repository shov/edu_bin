import { createContext } from "react"
import { useReducer } from "react";
import { buildDayListForToday } from "./dayUtil";
import { TDay } from "./contracts";

export const DayContext = createContext<TDay[]>([])
export const DayDispatchContext = createContext<React.Dispatch<any>>(null as unknown as React.Dispatch<any>)

export enum EDayActionType {
  TOGGLE_DAY = 'TOGGLE_DAY',
}

const initialDayList: TDay[] = buildDayListForToday();

export const DayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  console.log('init dayList', initialDayList.length);
  const [dayList, dayListDispatch] = useReducer(dayListReducer, initialDayList);
  console.log('dayList in context', dayList.length);

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