import React from 'react'
import {StyleSheet, View} from 'react-native'
import {ListItem} from '../components/ListItem'
import {Screen} from '../components/Screen'
import colors from '../config/colors'
import {ListItemSeparator} from '../components/ListItemSeparator'
import {Icon} from '../components/Icon'

export function AccountSettings() {
    return (
        <Screen style={styles.screen}>
            <ListItem
                title={'CAt43'}
                subTitle={'cat4343@gmail.com'}
                image={{uri: 'https://picsum.photos/512'}}
            />
            <View style={styles.containerTop}>
                <ListItem title={'My Listings'} ImageComponent={
                    <Icon backgroundColor={colors.primary} name={'format-list-bulleted'}/>
                }/>
                <ListItemSeparator />
                <ListItem title={'My Messages'} ImageComponent={
                    <Icon backgroundColor={colors.secondary} name={'email'}/>
                }/>
            </View>
            <View style={styles.containerSecond}>
                <ListItem title={'Log out'} ImageComponent={
                    <Icon backgroundColor={colors.thirdAction} name={'logout'}/>
                }/>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.creamBg,
    },
    containerTop: {
        marginTop: 40
    },
    containerSecond: {
        marginTop: 20
    },
})
