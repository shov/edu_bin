import React from 'react'
import {Image, StyleSheet, View} from 'react-native'
import colors from '../config/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'

function ViewImageScreen() {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                name={'close'}
                color={'white'}
                size={35}
                style={styles.closeIcon}
            />
            <MaterialCommunityIcons
                name={'trash-can-outline'}
                color={'white'}
                size={35}
                style={styles.deleteIcon}
            />
            <Image resizeMode={'contain'} style={styles.image} source={{uri: 'https://picsum.photos/2000/3000'}} />
        </View>
    )
}

const styles = StyleSheet.create({
    closeIcon: {
        position: 'absolute',
        top: 40,
        left: 30,
    },
    deleteIcon: {
        position: 'absolute',
        top: 40,
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
