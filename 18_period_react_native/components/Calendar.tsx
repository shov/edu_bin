import React, { Ref, RefObject, useContext, useState } from 'react'
import { useEffect, useRef } from 'react'
import { TMonth } from '../contracts'
import { FlatList, View, StyleSheet } from 'react-native'
import { Month } from './Month'
import { DayProvider } from '../DayContext'
import { MonthContext } from '../MonthContext'

// Calendar react component
export const Calendar: React.FC<{
  year: number
  setYear?: (year: number) => void
}> = ({ year, setYear }) => {
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [layoutHandlerCb, setLayoutHandlerCb] = useState<Function>(() => {})
  const flatListRef = useRef<FlatList>(null)

  const monthList = useContext(MonthContext)

  const onViewableItemsChanged = ({
    viewableItems,
    changed,
  }: {
    viewableItems: any
    changed: any
  }) => {
    ;(setYear || (() => {}))(viewableItems[0].item.year)
  }

  const viewConfigref = useRef({
    itemVisiblePercentThreshold: 10,
    minimumViewTime: 0,
  })

  const onViewableItemsChangedRef = useRef(onViewableItemsChanged)

  useEffect(() => {
    const currentIndex = monthList.findIndex((month) => month.isCurrentMonth)

    if (currentIndex === -1) return

    setCurrentIndex(currentIndex)

    setLayoutHandlerCb(() => {
      flatListRef.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5,
      })
    })

    setIsInitialRender(false)

    return () => {
      setLayoutHandlerCb(() => {})
    }
  }, [monthList, isInitialRender])

  return (
    <View style={styles.calendarContainer}>
      <FlatList
        ref={flatListRef}
        data={monthList}
        renderItem={({ item, index }) => (
          <DayProvider>
            <Month
              month={item}
              year={year}
              isLast={index === monthList.length - 1}
            />
          </DayProvider>
        )}
        onScrollToIndexFailed={(info: {
          index: number
          highestMeasuredFrameIndex: number
          averageItemLength: number
        }) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500))
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            })
          })
        }}
        onLayout={() => {
          ;(layoutHandlerCb || function () {})()
        }}
        viewabilityConfig={viewConfigref.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  calendarContainer: {},
})
