import React from 'react'
import {useDeviceOrientation, useDimensions} from '@react-native-community/hooks'
import WelcomeScreen from './app/screens/WelcomeScreen'
import ViewImageScreen from './app/screens/ViewImageScreen';
import {Text, View} from 'react-native'
import AppText from './app/components/AppText'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from './app/config/colors';
import {Card} from './app/components/Card'
import {ListingDetailsScreen} from './app/screens/ListingDetailsScreen'
import {MessageScreen} from './app/screens/MessagesScreen'
import {AccountSettings} from './app/screens/AccountScreen'
import {ListingScreen} from './app/screens/ListingScreen'

export default function App() {
    return (
        // <View style={{
        //     flex: 1,
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     alignContent: 'center',
        //     backgroundColor: '#f8f4f4',
        //     paddingHorizontal: 20,
        //     paddingTop: 100,
        //
        // }}>
        //     <Card
        //         title={'The place'}
        //         subTitle={'we walk there 3 nights in a row...'}
        //         image={{uri: 'https://picsum.photos/1024/768'}}
        //     />
        //     <Card
        //         title={'The place'}
        //         subTitle={'we walk there 3 nights in a row...'}
        //         image={{uri: 'https://picsum.photos/1024/768'}}
        //     />
        //     <Card
        //         title={'The place'}
        //         subTitle={'we walk there 3 nights in a row...'}
        //         image={{uri: 'https://picsum.photos/1024/768'}}
        //     />
        // </View>
        //<WelcomeScreen/>
        // <ListingDetailsScreen
        //     title={'The place'}
        //     subTitle={'we walk there 3 nights in a row...'}
        //     image={{uri:'https://picsum.photos/1024/768'}}
        //     author={{
        //         title: 'CAt54',
        //         subTitle: new Date().toDateString(),
        //         image: {uri:'https://picsum.photos/512'}
        //     }}
        // />
        //<ViewImageScreen/>
        //<AccountSettings/>
        <ListingScreen/>
    )
}
