import React, {ReactNode} from 'react'
import {Image, StyleSheet, TouchableHighlight, View} from 'react-native'
import AppText from './AppText'
import colors from '../config/colors'
import {Swipeable} from 'react-native-gesture-handler'

export declare interface IListItemProps {
    title: string,
    subTitle?: string,
    image?: number | { uri: string },
    ImageComponent?: ReactNode,
    onPress?: (...args: any[]) => void,
    rightSwipe?: (...args: any[]) => ReactNode,
}

export function ListItem({title, subTitle, image, ImageComponent, onPress, rightSwipe}: IListItemProps) {
    return (
        <Swipeable
            renderRightActions={rightSwipe}
        >
            <TouchableHighlight
                underlayColor={colors.light}
                onPress={onPress}
            >
                <View style={styles.container}>
                    {ImageComponent && ImageComponent}
                    {image && <Image style={styles.image} source={image} />}
                    <View style={styles.captionContainer}>
                        <AppText style={styles.title}>{title}</AppText>
                        {subTitle && <AppText style={styles.subTitle}>{subTitle}</AppText>}
                    </View>
                </View>
            </TouchableHighlight>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 30,
        backgroundColor: colors.lightBg,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    title: {
        fontWeight: '500',
    },
    captionContainer: {
        paddingLeft: 15,
        justifyContent: 'center',
    },
    subTitle: {
        color: colors.medium
    }
})

