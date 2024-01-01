import React from "react"
import { TWeek } from "../contracts"
import { View, StyleSheet } from "react-native"
import { Day } from "./Day"

// Week react component
export const Week: React.FC<{ week: TWeek }> = ({ week }) => {
  // need to fill empty days
  const dayList: any[] = week.dayList
    .reduce((acc, curr, i) => {
      acc[curr.day] = curr
      return acc
    }, new Array(7).fill(null))
    .map((v, i) => v || { key: `empty-${i}`, isEmpty: true })

  return (
    <View key={week.key} style={styles.weekRow}>
      {dayList.map((day) => (
        <Day key={day.key} day={day} isEmpty={day.isEmpty} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  weekRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
})
