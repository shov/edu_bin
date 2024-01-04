import React, { useContext, useEffect, useState } from 'react'
import { TMonth, TWeek } from '../contracts'
import { View, Text, StyleSheet } from 'react-native'
import { Week } from './Week'
import { DayContext, DayDispatchContext, EDayActionType } from '../DayContext'
import { arrangeWeekFromDayList } from '../dayUtil'

// Month react component
export const Month: React.FC<{ month: TMonth; year: number, isLast?: boolean }> = ({
  month,
  year,
  isLast,
}) => {
  // create new date object of this month
  const date = new Date(year, month.month, 1)
  const monthName = date.toLocaleString('default', { month: 'long' })
  const isOddMonth = month.month % 2 > 0

  const [weekList, setWeekList] = useState<TWeek[]>([])
  const dayList = useContext(DayContext)
  const dayListDispatch = useContext(DayDispatchContext)

  useEffect(() => {
    dayListDispatch({ type: EDayActionType.FILL_BY_MONTH, month: month })
  }, [])

  useEffect(() => {
    const weekList = arrangeWeekFromDayList(dayList)
    setWeekList(weekList)
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
