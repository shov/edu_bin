import React from 'react'
import {StyleSheet, View, Image} from 'react-native'
import AppText from '../components/AppText'
import colors from '../config/colors'
import {ListItem, IListItemProps} from '../components/ListItem'

export declare interface IListingDetailsScreenProps {
    title: string,
    subTitle: string,
    image: number | { uri: string },
    author: IListItemProps,
}

export function ListingDetailsScreen({image, title, subTitle, author}: IListingDetailsScreenProps) {
    return (
        <View>
            <Image style={styles.image} source={image} />
            <View style={styles.textContainer}>
                <AppText color={colors.defaultText}>{title}</AppText>
                <AppText color={colors.secondary}>{subTitle}</AppText>
                <View style={styles.authorContainer}>
                    <ListItem {...author} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: '100%',
    },
    textContainer: {
        width: '100%',
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    authorContainer: {
        marginTop: 40,
    },
})

