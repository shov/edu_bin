import React, { createContext, useReducer } from 'react'

export type TCalendarSettings = {
  loading: boolean,
  useAsyncStorage: boolean,
  redDayList: string[],
}

export enum ECalendarSettingsAction {
  ON_LOADING = 'ON_LOADING',
  OFF_LOADING = 'OFF_LOADING',
  SET_RED_LIST = 'SET_RED_LIST',
}

export const CalendarContext = createContext<TCalendarSettings>({
  loading: false,
  useAsyncStorage: false,
  redDayList: [],
})
export const CalendarDispatchContext = createContext<React.Dispatch<any>>(
  null as unknown as React.Dispatch<any>
)

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [calendarSettings, calendarSettingsDispatch] = useReducer(
    calendarSettingsReducer,
    { loading: false, useAsyncStorage: false, redDayList: [] }
  )

  return (
    <CalendarContext.Provider value={calendarSettings}>
      <CalendarDispatchContext.Provider value={calendarSettingsDispatch}>
        {children}
      </CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  )
}

const calendarSettingsReducer = (state: TCalendarSettings, action: any) => {
  switch (action.type) {
    case ECalendarSettingsAction.ON_LOADING:
      return { ...state, loading: true }
    case ECalendarSettingsAction.OFF_LOADING:
      return { ...state, loading: false }
    case ECalendarSettingsAction.SET_RED_LIST:
      return { ...state, redList: action.redDayList }
    default:
      return state
  }
}
