export type TDay = {
  key: string
  originDate: Date
  date: number
  day: number
  month: number
  isRed: boolean
}

export type TWeek = {
  key: string
  week: number
  dayList: TDay[]
}

export type TMonth = {
  key: string
  month: number
  weekList: TWeek[]
  isCurrentMonth: boolean
  year: number
}
