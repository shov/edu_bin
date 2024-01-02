import { TDay, TMonth } from "./contracts"

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
    dayList.reduce<Record<string, TMonth>>((acc, curr) => {
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