import React, { Ref, RefObject, useContext, useState } from 'react'
import { useEffect, useRef } from 'react'
import { TMonth } from '../contracts'
import { FlatList, View, StyleSheet, Text } from 'react-native'
import { Month } from './Month'
import { DayProvider } from '../DayContext'
import { MonthContext } from '../MonthContext'
import { CalendarContext, CalendarDispatchContext } from '../CalendarContext'

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
  const calendarSettings = useContext(CalendarContext)
  const calendarSettingsDispatch = useContext(CalendarDispatchContext)

  const onViewableItemsChanged = ({
    viewableItems,
    changed,
  }: {
    viewableItems: any
    changed: any
  }) => {
    ;(setYear || (() => {}))(viewableItems?.[0]?.item?.year || monthList[0].year)
  }

  const viewConfigref = useRef({
    itemVisiblePercentThreshold: 10,
    minimumViewTime: 0,
  })

  const onViewableItemsChangedRef = useRef(onViewableItemsChanged)

  useEffect(() => {

    ;(async () => {
      calendarSettingsDispatch({ type: 'ON_LOADING' })
      try {
        const { redDayList } = await fetch(
          `http://localhost:3000/get-red`
        ).then((res) => res.json())

        calendarSettingsDispatch({ type: 'SET_RED_LIST', redDayList })
      } catch (e: any) {
        console.warn(`Cannot initially load redlist`, e.message)
      } finally {
        calendarSettingsDispatch({ type: 'OFF_LOADING' })
      }
    })().then(() => {
      const currentIndex = monthList.findIndex((month) => month.isCurrentMonth)

      if (currentIndex === -1) return
  
      setCurrentIndex(currentIndex)
  
  
  
      setLayoutHandlerCb(() => {
        flatListRef.current?.scrollToIndex({
          index: currentIndex,
          animated: true,
          viewPosition: 0,
        })

        setLayoutHandlerCb(() => {})
      })
  
      setIsInitialRender(false)
  
      // return () => {
      //   setLayoutHandlerCb(() => {})
      // }

    })
    
  }, [monthList, isInitialRender])

  return (
    <View
      style={{
        ...(calendarSettings.loading
          ? { flex: 1, justifyContent: 'center', alignItems: 'center' }
          : styles.calendarContainer),
      }}
    >
      {calendarSettings.loading ? (<Text>Loading...</Text>) : null}
      <FlatList
        style={{ ...(calendarSettings.loading ? { display: 'none' } : {}) }}
        ref={flatListRef}
        data={monthList}
        renderItem={({ item, index }) => (
          <DayProvider>
            <Month month={item} isLast={index === monthList.length - 1} />
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
