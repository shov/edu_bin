import React from 'react'
import { View, TouchableHighlight } from 'react-native'

export default function RegisterButton({ pressHandler }: { pressHandler: (...args: any[]) => void }) {
    return (
        <TouchableHighlight
            style={{
                width: '100%',
                height: 80,
            }}
            onPress={() => {pressHandler('image-view')}}
        >
            <View style={{
                backgroundColor: 'darkseagreen',
                flex: 1
            }}>

            </View>
        </TouchableHighlight>
    )
}