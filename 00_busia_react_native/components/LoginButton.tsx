import React from 'react'
import {View} from 'react-native'

export default function LoginButton({pressHandler}: {pressHandler: (...args: any[]) => void}) {
    return (
        <View style={{
            backgroundColor: 'hotpink',
            width: '100%',
            height: 80,
        }}></View>
    )
}