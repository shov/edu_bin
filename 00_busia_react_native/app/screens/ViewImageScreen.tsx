import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import colors from '../config/colors'

function ViewImageScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.closeIcon}></View>
            <View style={styles.deleteIcon}></View>
            <Image resizeMode={'contain'} style={styles.image} source={{uri: 'https://picsum.photos/2000/3000'}} />
        </View>
    )
}

const styles = StyleSheet.create({
    closeIcon: {
        width: 50,
        height: 50,
        backgroundColor: colors.primary,
        position: 'absolute',
        top: 30,
        left: 30,
    },
    deleteIcon: {
        width: 50,
        height: 50,
        backgroundColor: colors.secondary,
        position: 'absolute',
        top: 30,
        right: 30,
    },
    container: {
        flex: 1,
        backgroundColor: colors.darkBg,
    },
    image: {
        width: '100%',
        height: '100%',

    },
})

export default ViewImageScreen
