import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  Button,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useDeviceOrientation, useDimensions } from '@react-native-community/hooks';
import WelcomeScreen from './components/WelcomeScreen'
import ImageViewScreen from './components/ImageViewScreen'

export default function App() {
  const { landscape } = useDeviceOrientation()
  const [screen, setScreen] = useState('welcome')

  return (
    <View style={styles.container}>
      {(() => {

        switch(screen) {
          case 'image-view': {
            // @ts-ignore
            return (<ImageViewScreen screenSwitcher={setScreen}/>)
          }
          default: {
            // @ts-ignore
            return (<WelcomeScreen screenSwitcher={setScreen}/>)
          }
        }

      })()}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
