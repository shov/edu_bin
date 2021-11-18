import React from 'react'
import {View, StyleSheet} from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from '../config/colors'

export declare interface IIconProps {
    size?: number,
    color?: string,
    backgroundColor?: string,
    name: any,
}

export function Icon({size = 40, color = '#fff', backgroundColor = '#000', name}: IIconProps) {
    return (
        <View style={{
            width: size,
            height: size,
            backgroundColor,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <MaterialCommunityIcons name={name} size={(size / 2)} color={color} />
        </View>
    )
}
