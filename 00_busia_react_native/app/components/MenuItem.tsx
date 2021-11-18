import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {StyleSheet, TouchableHighlight, View} from 'react-native'
import AppText from './AppText'
import colors from '../config/colors'
import {Icon} from './Icon'

export declare interface IMenuItemProps {
    name: string,
    color: string,
    title: string,
    onPress?: (...args: any[]) => void,
}

export function MenuItem({name, title, color, onPress}: IMenuItemProps) {
    onPress = onPress ?? (() => {
    })
    return (
        <TouchableHighlight
            onPress={onPress}
            underlayColor={colors.light}
            style={styles.container}
        >
            <View style={styles.view}>
                <Icon size={40} backgroundColor={color} name={name}/>
                <AppText style={styles.text}>{title}</AppText>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: colors.lightBg,
    },
    view: {
        flexDirection: 'row',
    },
    text: {
        fontWeight: 'bold',
        marginLeft: 15,
    },
})
