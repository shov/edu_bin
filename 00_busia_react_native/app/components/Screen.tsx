import React, {ReactNode} from 'react'
import Constants from 'expo-constants'
import {StyleSheet, SafeAreaView} from 'react-native'

export declare interface IScreenProps {
    children: ReactNode,
    style?: any,
}

export function Screen({children, style}: IScreenProps) {
    return (
        <SafeAreaView style={[styles.screen, style ?? {}]}>
            {children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
    }
})
