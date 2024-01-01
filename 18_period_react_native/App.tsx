import { SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import { YearTitle } from './components/YearTitle'
import { Calendar } from './components/Calendar'
import { TDay, TMonth } from './contracts'
import { useEffect, useState } from 'react'

// Current year
function getCurrYear() {
  return new Date().getFullYear()
}

function buildDayListForToday() {
  const today = new Date()

  // first date must be 300 days ago
  const firstDay = new Date(today)
  firstDay.setDate(today.getDate() - 300)

  const dayList = new Array(601).fill(null).map((v, i) => {
    // date from the first day with i offset
    // add i days to the first day
    const currDay: Date = new Date(firstDay)
    currDay.setDate(firstDay.getDate() + i)

    return {
      key: currDay.toISOString(),
      originDate: currDay,
      date: currDay.getDate(),
      day: (currDay.getDay() || 7) - 1,
      month: currDay.getMonth(),
    }
  })

  return dayList
}

// spit dayList by weeks and monthts
function createMonthList(dayList: TDay[]) {
  return Object.values(
    dayList.reduce<Record<string, TMonth>>((acc, curr) => {
      const { month, day } = curr
      const key = `${curr.originDate.getFullYear()}-${month}`
      acc[key] ??= {
        key: key,
        month,
        weekList: [],
        isCurrentMonth:
          month === new Date().getMonth() &&
          curr.originDate.getFullYear() === getCurrYear(),
      }

      if (acc[key].weekList.length < 1 || day === 0) {
        acc[key].weekList.push({
          key: `${curr.originDate.getFullYear()}-${month}-${
            acc[key].weekList.length
          }`,
          week: acc[key].weekList.length,
          dayList: [],
        })
      }

      const weekIndex = acc[key].weekList.length - 1

      acc[key].weekList[weekIndex].dayList.push(curr)

      return acc
    }, {})
  )
}

export default function App() {
  const [year, setYear] = useState<number>(0)
  const [dayList, setDayList] = useState<TDay[]>([])
  const [monthList, setMonthList] = useState<TMonth[]>([])

  useEffect(() => {
    setYear(getCurrYear())
    setDayList(buildDayListForToday())
    setMonthList(createMonthList(dayList))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <YearTitle year={year} />
      <Calendar year={year} monthList={monthList} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // direction to bottom
    flexDirection: 'column',
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: 'lightgray',
  },
})
