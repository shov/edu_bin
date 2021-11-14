import React from 'react'
import {StyleSheet, Text} from 'react-native'

function AppText({children, color}: { children: string, color?: string }) {
    return (
        <Text style={[styles.text, color ? {color} : {}]}>{children}</Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontFamily: 'Avenir',
    }
})

export default AppText
