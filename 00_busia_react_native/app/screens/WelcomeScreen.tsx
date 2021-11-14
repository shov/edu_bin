import React from 'react'
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native'
import colors from '../config/colors'
import picWelcomeBg from '../assets/welcome_bg.png'
import picLogo from '../assets/logo.png'
import AppButton from '../components/AppButton'


function WelcomeScreen() {
    return (
        <ImageBackground blurRadius={15} style={styles.background} source={picWelcomeBg}>
            <View style={styles.buttonContainer}>
                <AppButton color={'primary'}>Login</AppButton>
                <AppButton color={'secondary'}>Register</AppButton>
            </View>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={picLogo} />
                <View style={styles.captionContainer}>
                    <Text style={styles.caption}>...Places for us</Text>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    logoContainer: {
        position: 'absolute',
        top: 100,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    caption: {
        fontWeight: 'bold',
        fontSize: 18
    },
    captionContainer: {
        top: -50,
        left: -120,
        backgroundColor: colors.lightBg,
        borderRadius: 25,
        padding: 10,
    },
    buttonContainer: {
        width: '100%',
        padding: 20,
    },
})
export default WelcomeScreen
