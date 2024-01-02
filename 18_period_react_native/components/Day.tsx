import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TDay } from '../contracts'
import { DayDispatchContext, EDayActionType } from '../DayContext';

export const Day: React.FC<{ day: TDay; isEmpty?: boolean }> = ({
  day,
  isEmpty,
}) => {
  const dayListDispatch = useContext(DayDispatchContext)
  const toggleDay = () => {
    dayListDispatch({ type: EDayActionType.TOGGLE_DAY, key: day.key })
  }

  return (
    (isEmpty && <View key={day.key} style={styles.emptyDayBox}></View>) || (

      <View
        key={day.key}
        style={{ ...styles.dayBox, ...(day.isRed ? styles.isRed : {}) }}
        onTouchEnd={toggleDay}
      >
        <Text style={styles.date}>{day.date}</Text>
      </View>
    )
  )
}

const styles = StyleSheet.create({
  emptyDayBox: {
    display: 'flex',
    width: 35,
    height: 35,
  },
  dayBox: {
    display: 'flex',
    width: 35,
    height: 35,
    backgroundColor: '#555',
    justifyContent: 'center',
  },
  isRed: {
    backgroundColor: 'darkred',
  },
  date: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
})
