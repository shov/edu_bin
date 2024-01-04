import { TDay, TMonth, TWeek } from "./contracts"

// Current year
export function getCurrYear() {
  return new Date().getFullYear()
}

export function buildDayListForToday() {
  const today = new Date()

  // first date must be 6 whole months before today
  const firstDay = new Date(today)
  firstDay.setMonth(today.getMonth() - 6)
  firstDay.setDate(1)

  // last date must be 6 whole months after the month today is in
  const lastDay = new Date(today)
  lastDay.setMonth(today.getMonth() + 6)
  // the last day of the month
  lastDay.setDate(0)

  const dayList = []

  let currDay = new Date(firstDay)
  while (currDay <= lastDay) {
    dayList.push({
      key: currDay.toISOString(),
      originDate: currDay,
      date: currDay.getDate(),
      day: (currDay.getDay() || 7) - 1,
      month: currDay.getMonth(),
      isRed: false,
    })

    currDay = new Date(currDay)
    currDay.setDate(currDay.getDate() + 1)
  }

  return dayList
}

// spit dayList by weeks and monthts
export function createMonthList(dayList: TDay[]) {
  return Object.values(
    dayList.reduce<Record<string, TMonth & {weekList: TWeek[]}>>((acc, curr) => {
      const { month, day } = curr
      const key = `${curr.originDate.getFullYear()}-${month}`
      acc[key] ??= {
        key: key,
        month,
        year: curr.originDate.getFullYear(),
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

export function createMonthListForToday(): TMonth[] {
  // get current month and year
  const today = new Date()
  const currMonth = today.getMonth()
  const currYear = today.getFullYear()

  // get 6 months before 
  const firstDay = new Date(today)
  firstDay.setMonth(today.getMonth() - 6)
  firstDay.setDate(1)

  const monthList: TMonth[] = []

  // from 6 months before to 6 months after, so 13 months
  for (let i = 0; i < 13; i++) {
    const currDay = new Date(firstDay)
    currDay.setMonth(firstDay.getMonth() + i)

    monthList.push({
      key: `${currDay.getFullYear()}-${currDay.getMonth()}`,
      month: currDay.getMonth(),
      year: currDay.getFullYear(),
      isCurrentMonth: currDay.getMonth() === currMonth && currDay.getFullYear() === currYear,
    })
  }

  return monthList
}

export function createDayListForMonth(monthObj: TMonth): TDay[] {
  const { month, year } = monthObj

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const dayList: TDay[] = []

  let currDay = new Date(firstDay)
  while (currDay <= lastDay) {
    dayList.push({
      key: currDay.toISOString(),
      originDate: currDay,
      date: currDay.getDate(),
      day: (currDay.getDay() || 7) - 1,
      month: currDay.getMonth(),
      isRed: false,
    })

    currDay = new Date(currDay)
    currDay.setDate(currDay.getDate() + 1)
  }

  return dayList
}

export function arrangeWeekFromDayList(dayList: TDay[]): TWeek[] {
  const weekList: TWeek[] = []

  dayList.forEach((curr) => {
    if (curr.day === 0 || weekList.length < 1) {
      weekList.push({
        key: `${curr.originDate.getFullYear()}-${curr.originDate.getMonth()}-${
          weekList.length
        }`,
        week: weekList.length,
        dayList: [],
      })
    }

    const weekIndex = weekList.length - 1

    weekList[weekIndex].dayList.push(curr)
  })

  return weekList
}