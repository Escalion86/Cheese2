// import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { RecoilRoot, useSetRecoilState } from 'recoil'

import { View } from 'react-native'

import Settings from './Settings'
import Photo from './Photo'
import About from './About'
import orientationAtom from './state/atoms/orientationAtom'
import { DeviceMotion } from 'expo-sensors'

import { LogBox } from 'react-native'
LogBox.ignoreLogs(['new NativeEventEmitter'])

async function loadApplication() {
  await Font.loadAsync({
    'helvetica-black': require('./assets/fonts/HelveticaBlack.ttf'),
    'helvetica-bold': require('./assets/fonts/HelveticaBold.ttf'),
    'helvetica-heavy': require('./assets/fonts/HelveticaHeavy.ttf'),
    'helvetica-italic': require('./assets/fonts/HelveticaItalic.ttf'),
    'helvetica-light': require('./assets/fonts/HelveticaLight.ttf'),
    'helvetica-medium': require('./assets/fonts/HelveticaMedium.ttf'),
    'helvetica-regular': require('./assets/fonts/HelveticaRegular.ttf'),
    'helvetica-thin': require('./assets/fonts/HelveticaThin.ttf'),
    'sf-ultralight': require('./assets/fonts/HelveticaUltraLight.ttf'),
    'sf-bold': require('./assets/fonts/SF-Pro-Display-Bold.otf'),
    'sf-semibold': require('./assets/fonts/SF-Pro-Display-Semibold.otf'),
    'sf-light': require('./assets/fonts/SF-Pro-Display-Light.otf'),
    'sf-medium': require('./assets/fonts/SF-Pro-Display-Medium.otf'),
    'sf-regular': require('./assets/fonts/SF-Pro-Display-Regular.otf'),
    'sf-thin': require('./assets/fonts/SF-Pro-Display-Thin.otf'),
    // cryptext: require('./assets/fonts/Cryptext-ru.ttf'),
  })
  return await getJsonData('settings')
}

// const storeData = async (key, value) => {
//   try {
//     return await AsyncStorage.setItem(
//       key,
//       typeof value === 'boolean' ? (value ? '1' : '0') : value
//     )
//   } catch (e) {
//     // saving error
//   }
// }

const storeJsonData = async (key, json) => {
  try {
    const jsonValue = JSON.stringify(json)
    return await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // saving error
  }
}

// const getData = async (key) => {
//   try {
//     const value = await AsyncStorage.getItem(key)
//     if (value !== null) {
//       // value previously stored
//     }
//     return value
//   } catch (e) {
//     // error reading value
//   }
// }

const getJsonData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    // error reading value
  }
}

SplashScreen.preventAutoHideAsync()

function orientationCalculation(rotation) {
  if (!rotation) return 1

  const { gamma, beta } = rotation

  // let ABSOLUTE_GAMMA = Math.abs(gamma)
  // if (ABSOLUTE_GAMMA > Math.PI / 2) {
  //   const _gamma = ABSOLUTE_GAMMA - Math.PI
  //   ABSOLUTE_GAMMA = Math.abs(_gamma)
  // }
  // const ABSOLUTE_BETA = Math.abs(beta)
  // const gap = ABSOLUTE_BETA - ABSOLUTE_GAMMA

  // if (gap > 0.5) {
  //   return 1
  // } else if (gap < -0.5) {
  //   return 0
  // } else {
  //   return 2
  // }
  // let ABSOLUTE_GAMMA = Math.abs(gamma)
  let ABSOLUTE_BETA = Math.abs(beta)
  let isGammaNegative = Math.sign(gamma) == -1
  // console.log('ABSOLUTE_GAMMA :>> ', ABSOLUTE_GAMMA) //1.3
  // console.log('ABSOLUTE_BETA :>> ', ABSOLUTE_BETA) //1.55

  // v
  // g=3 b=1
  // g=0.2 b=0.7
  // g=1.47 b=0.7
  // g
  // g=1.28 b=0
  if (ABSOLUTE_BETA >= 0.7) {
    return 1
  } else {
    return isGammaNegative ? 0 : 2
  }

  // if (ABSOLUTE_GAMMA <= 0.04 && ABSOLUTE_BETA <= 0.24) {
  //   //Portrait mode, on a flat surface.
  //   return 1
  //   console.log('1 :>> 1')
  // } else if (
  //   (ABSOLUTE_GAMMA <= 1.0 || ABSOLUTE_GAMMA >= 2.3) &&
  //   ABSOLUTE_BETA >= 0.5
  // ) {
  //   console.log('1 :>> 2')
  //   //General Portrait mode, accounting for forward and back tilt on the top of the phone.
  //   return 1
  // } else {
  //   console.log('2 :>>', isGammaNegative ? 0 : 2)
  //   return isGammaNegative ? 0 : 2
  // }
}

function AppWrapper() {
  // const colorScheme = useColorScheme()
  const setOrientation = useSetRecoilState(orientationAtom)
  const [isReady, setIsReady] = useState(false)
  const [screen, setScreen] = useState('settings')
  const [settings, setSettings] = useState({
    isDarkTheme: false,
    startPhotoOnLoad: false,
    cardAngle: 85,
    cardScale: 80,
    // screenOrientation: 'auto',
    language: 'ru',
  })

  const storeSettings = (data) => storeJsonData('settings', data)

  const updateSettings = (data) => {
    if (data) {
      const newSettings = { ...settings, ...data }
      setSettings(newSettings)
      storeSettings(newSettings)
    }
  }

  // const updateSetting = (key, value) => {
  //   if (key) setSettings({ ...settings, [key]: value })
  // }

  // if (!isReady)
  //   return (
  //     <AppLoading
  //       startAsync={async () => {
  //         const settings = await loadApplication()
  //         if (settings) {
  //           if (settings.startCalcOnLoad) setScreen('calc')
  //           updateSettings(settings)
  //         }
  //       }}
  //       onFinish={() => setIsReady(true)}
  //       onError={console.warn}
  //     />
  //   )

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const settings = await loadApplication()
        if (settings) {
          if (settings.startPhotoOnLoad) setScreen('photo')
          updateSettings(settings)
        }
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        // await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setIsReady(true)
        await SplashScreen.hideAsync()
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    DeviceMotion.addListener(({ orientation, rotation }) => {
      setOrientation(orientationCalculation(rotation))
    })
  }, [])

  // const onLayoutRootView = useCallback(async () => {
  //   if (isReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     await SplashScreen.hideAsync()
  //   }
  // }, [isReady])

  if (!isReady) {
    return null
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: settings.isDarkTheme ? 'black' : 'white',
          // borderWidth: 3,
          // borderColor: 'red',
        }}
      >
        {/* <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 12,
          height: 12,
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'blue', fontSize: 10 }}>21</Text>
      </View> */}
        {/* <View style={styles.container}> */}
        {/* <StatusBar style="inverted" /> */}
        {screen === 'settings' && (
          <Settings
            setScreen={setScreen}
            updateSettings={updateSettings}
            settings={settings}
          />
        )}
        {!screen ||
          (screen === 'photo' && (
            <Photo
              isDarkTheme={settings.isDarkTheme}
              goToSettings={() => setScreen('settings')}
              settings={settings}
            />
          ))}
        {screen === 'about' && (
          <About
            setScreen={setScreen}
            // updateSettings={updateSettings}
            settings={settings}
          />
        )}

        {/* </View> */}
      </View>
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <RecoilRoot>
      <AppWrapper />
    </RecoilRoot>
  )
}
