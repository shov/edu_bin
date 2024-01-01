import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

// YearTime react component
export const YearTitle: React.FC<{ year: number }> = ({ year }) => {
  return (
    <View style={styles.yearTitleContainer}>
      <Text style={styles.yearTitleText}>{year}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  yearTitleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 60,
    paddingLeft: 15,
    paddingBottom: 10,
  },

  yearTitleText: {
    fontSize: 35,
    color: 'black',
  },
})