import React from 'react'
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native'
import colors from '../config/colors'
import AppText from './AppText'


declare interface ICardProps {
    title: string,
    subTitle: string,
    image: number | { uri: string },
    pressHandler?: (...args: any[]) => void,
}

function Card({title, subTitle, image, pressHandler}: ICardProps) {
    pressHandler = pressHandler ?? (() => {
    })

    return (
        <TouchableWithoutFeedback onPress={pressHandler}>
            <View style={styles.view}>
                <Image style={styles.image} source={image} />
                <View style={styles.textContainer}>
                    <AppText color={colors.defaultText}>{title}</AppText>
                    <AppText color={colors.secondary}>{subTitle}</AppText>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    view: {
        width: '100%',
        margin: 10,
        borderRadius: 40,
        height: 400,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: colors.lightBg,
        overflow: 'hidden',
    },
    textContainer: {
        width: '100%',
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    image: {
        width: '100%',
        height: '75%',
        resizeMode: 'cover',
    },
})

export default Card
