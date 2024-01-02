import { SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import { YearTitle } from './components/YearTitle'
import { Calendar } from './components/Calendar'
import { TDay, TMonth } from './contracts'
import { useContext, useEffect, useState } from 'react'
import { DayContext, DayProvider } from './DayContext'
import { createMonthList, getCurrYear } from './dayUtil'

export default function App() {
  const [year, setYear] = useState<number>(0)
  
  useEffect(() => {
    const currYear = getCurrYear()
    setYear(currYear)
  }, [])
  
  return (
    <DayProvider>
      <SafeAreaView style={styles.container}>
        <YearTitle year={year} />
        <Calendar
          year={year}
          setYear={(year: number) => {
            setYear(year)
          }}
        />
      </SafeAreaView>
    </DayProvider>
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
