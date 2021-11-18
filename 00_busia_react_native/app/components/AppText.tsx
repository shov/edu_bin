import React from 'react'
import {StyleSheet, Text} from 'react-native'

function AppText({children, color, style}: { children: string, color?: string, style?: any }) {
    return (
        <Text style={[styles.text, color ? {color} : {}, style ? style : {}]}>{children}</Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontFamily: 'Avenir',
    }
})

export default AppText
