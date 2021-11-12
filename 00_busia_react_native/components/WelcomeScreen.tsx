import React from 'react';
import { View, Image } from "react-native";

import picWelcomeBg from '../assets/welcome_bg.jpeg'
import picLogo from '../assets/logo.png'
import RegisterButton from './RegisterButton'
import LoginButton from './LoginButton'

export default function WelcomeScreen({ screenSwitcher }: { screenSwitcher: (name: string) => void }) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'black'
        }}>
            <Image source={picWelcomeBg} style={{
                resizeMode: 'contain',
                position: 'absolute',
            }} />

            <View style={{
                flex: 0.5,
                flexDirection: 'column-reverse',
                alignItems: 'center',
            }}>
                <Image source={picLogo} style={{
                    height: '60%'
                }} />
            </View>
            <View style={{
                flex: 0.5,
                flexDirection: 'column-reverse',
                alignItems: 'flex-end',
            }}>
                <RegisterButton {...{ pressHandler: (name: string) => screenSwitcher(name) }} />
                <LoginButton {...{ pressHandler: (name: string) => screenSwitcher(name) }} />
            </View>
        </View>
    )
}