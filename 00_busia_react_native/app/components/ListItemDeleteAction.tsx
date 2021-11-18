import React from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import colors from '../config/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'

export declare interface IListItemDeleteActionProps {
    onPress?: (...args: any[]) => void,
}
export function ListItemDeleteAction({onPress}: IListItemDeleteActionProps) {
    onPress = onPress ?? (()=>{})
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.container}>
                <MaterialCommunityIcons
                    name={'trash-can'}
                    size={35}
                    color={colors.brightLight} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.danger,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
