import React from 'react'
import { TMonth } from '../contracts'
import { FlatList, View, StyleSheet } from 'react-native'
import { Month } from './Month'

// Calendar react component
export const Calendar: React.FC<{ monthList: TMonth[]; year: number }> = ({
  monthList,
  year,
}) => {

  return (
    <View style={styles.calendarContainer}>
      <FlatList
        data={monthList}
        initialScrollIndex={monthList.reduce((acc, curr, i) => {
          return curr.isCurrentMonth ? acc + i : acc + 0
        }, 0)}
        renderItem={({ item }) => <Month month={item} year={year} />}
        keyExtractor={(month: TMonth) => month.key}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  calendarContainer: {},
})
