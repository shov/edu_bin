import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import AppText from './AppText'
import colors from '../config/colors'

declare interface IButtonProps {
    children: string,
    color: keyof TColors,
    onPress?: (...args: any[]) => void
}

function AppButton({children, color, onPress}: IButtonProps) {
    onPress = onPress ?? (() => {
    })
    return (
        <TouchableOpacity style={[styles.touchable, {backgroundColor: colors[color]}]} onPress={onPress}>
            <AppText color={'white'}>{children}</AppText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchable: {
        margin: 10,
        borderRadius: 50,
        width: '100%',
        height: 70,

        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
})

export default AppButton
