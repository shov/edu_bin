import React, { useContext, useEffect, useState } from 'react'
import { TDay, TMonth, TWeek } from '../contracts'
import { View, Text, StyleSheet } from 'react-native'
import { Week } from './Week'
import { DayContext, DayDispatchContext, EDayActionType } from '../DayContext'
import { arrangeWeekFromDayList } from '../dayUtil'
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage'
import {
  CalendarContext,
  CalendarDispatchContext,
  ECalendarSettingsAction,
} from '../CalendarContext'

type TMonthDayListPersistKey = `@month-daylist:y${number}:m${number}`

function makeMonthDayListPersistKey(
  year: number,
  month: number
): TMonthDayListPersistKey {
  return `@month-daylist:y${year}:m${month}`
}

// Month react component
export const Month: React.FC<{
  month: TMonth
  isLast?: boolean
}> = ({ month, isLast }) => {
  // create new date object of this month
  const date = new Date(month.year, month.month, 1)
  const monthName = date.toLocaleString('default', { month: 'long' })
  const isOddMonth = month.month % 2 > 0

  const [weekList, setWeekList] = useState<TWeek[]>([])
  const dayList = useContext(DayContext)

  const dayListDispatch = useContext(DayDispatchContext)
  const { getItem: loadDayList, setItem: saveDayList } = useAsyncStorage(
    makeMonthDayListPersistKey(month.year, month.month)
  )

  const calendarSettingsDispatch = useContext(CalendarDispatchContext)
  const calendarSettings = useContext(CalendarContext)

  useEffect(() => {
    ;(async () => {
      let persistedDayListSrc: string | null = null
      let persistedDayList: TDay[] | null = null

      if (calendarSettings.useAsyncStorage) {
        try {
          calendarSettingsDispatch({ type: ECalendarSettingsAction.ON_LOADING })
          persistedDayListSrc = await loadDayList()
        } catch (e: any) {
          console.warn(
            `Cannot initially load persisted day list for ${monthName} ${month.year}`,
            e.message
          )
        } finally {
          calendarSettingsDispatch({
            type: ECalendarSettingsAction.OFF_LOADING,
          })
        }
      }

      if (null !== persistedDayListSrc) {
        try {
          persistedDayList = JSON.parse(persistedDayListSrc, (key, value) => {
            // if key is originDate we deserialize as Date object
            if (key === 'originDate') {
              return new Date(value)
            }
            return value
          })
        } catch (e: any) {
          console.warn(
            `Cannot parse persisted day list for ${monthName} ${month.year}`,
            e.message,
            { persistedDayListSrc }
          )
        }
      }

      if (
        null === persistedDayList ||
        Array.isArray(persistedDayList) === false ||
        persistedDayList.length === 0
      ) {
        console.log(
          `We arranging new daylist: year ${month.year} month ${month.month}`
        )
        dayListDispatch({
          type: EDayActionType.FILL_BY_MONTH,
          month: month,
          redDayList: calendarSettings.redDayList,
        })
        return
      }

      if (persistedDayList.length > 0) {
        dayListDispatch({
          type: EDayActionType.FILL_FROM_STORAGE,
          dayList: persistedDayList,
          redDayList: calendarSettings.redDayList,
        })
      }
    })()
  }, [])

  useEffect(() => {
    const weekList = arrangeWeekFromDayList(dayList)

    setWeekList(weekList)

    if (calendarSettings.useAsyncStorage) {
      ;(async () => {
        calendarSettingsDispatch({ type: ECalendarSettingsAction.ON_LOADING })
        const serialized = JSON.stringify(dayList, (key, value) => {
          // if key is originDate we serialize as ISO date string
          if (key === 'originDate') {
            return typeof value === 'string' ? value : value.toISOString()
          }
          return value
        })

        await saveDayList(serialized)
      })()
        .catch((e: any) => {
          console.warn(
            `Cannot save day list for ${monthName} ${month.year}`,
            e.message
          )
        })
        .finally(() => {
          calendarSettingsDispatch({
            type: ECalendarSettingsAction.OFF_LOADING,
          })
        })
    }
  }, [dayList])

  useEffect(() => {
    {
      ;(async () => {
        console.log(
          `We are updating daylist: year ${month.year} month ${month.month}`
        )

        calendarSettingsDispatch({ type: ECalendarSettingsAction.ON_LOADING })

        const redDayList = dayList
          .filter((day) => day.isRed)
          .map((day) => day.originDate.toISOString().split('T')[0])

        try {
          const response = await fetch(`http://localhost:3000/set-red`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              redDayList: redDayList.filter((o) => 'string' === typeof o),
            }),
          })

          if (response.status !== 200) {
            console.warn(
              `Cannot save day list for ${monthName} ${month.year}`,
              response.statusText
            )
          }
        } catch (e: any) {
          console.log(
            `Cannot save day list for ${monthName} ${month.year}`,
            e.message
          )
        } finally {
          calendarSettingsDispatch({
            type: ECalendarSettingsAction.OFF_LOADING,
          })
        }
      })()
    }
  }, [dayList])

  return (
    <View
      key={month.key}
      style={{
        ...styles.monthRow,
        ...{
          backgroundColor: isOddMonth
            ? styles.oddMonth.backgroundColor
            : styles.monthRow.backgroundColor,
        },
      }}
    >
      <Text style={styles.monthName}>{monthName}</Text>
      {weekList.map((week) => (
        <Week key={week.key} week={week} />
      ))}
      {isLast && <View style={{ height: 50 }} />}
    </View>
  )
}

const styles = StyleSheet.create({
  monthRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 25,
    paddingHorizontal: 5,
    backgroundColor: 'none',
  },

  oddMonth: {
    backgroundColor: '#dedede',
  },

  monthName: {
    display: 'flex',
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
})
