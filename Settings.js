import React from 'react'

import {
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import ButtonMenu from './components/ButtonMenu'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HeaderBackButton } from '@react-navigation/elements'
import AboutScreen from './About'
import language from './helpers/language'
import AutoRotate from './components/AutoRotate'
import MaskedView from '@react-native-masked-view/masked-view'
import FingerInverse from './images/FingerInverse.svg'
import pngCards from './assets/playngCards/pngCards'

const Stack = createNativeStackNavigator()

const ItemSwitch = ({ title, onValueChange, value, isDarkTheme }) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: 40,
    }}
  >
    <Text
      style={{
        ...styles.text,
        flex: 1,
        color: isDarkTheme ? 'white' : 'black',
      }}
    >
      {title}
    </Text>
    <Switch
      trackColor={{ false: '#767577', true: '#ffbb66' }}
      thumbColor={value ? '#ff9933' : '#f4f3f4'}
      // ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={value}
    />
  </View>
)

// const ItemCheckBox = ({ title, isDarkTheme, value, onValueChange }) => (
//   <View
//     style={{
//       display: 'flex',
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     }}
//   >
//     <Checkbox
//       style={{ margin: 8, height: 22, width: 22 }}
//       value={value}
//       onValueChange={onValueChange}
//       color={value ? '#ff9933' : undefined}
//     />
//     <Text
//       style={{
//         ...styles.text,
//         flex: 1,
//         color: isDarkTheme ? 'white' : 'black',
//       }}
//     >
//       {title}
//     </Text>
//   </View>
// )

const CharButton = ({ isDarkTheme, children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 40,
        // width: 60,
        // marginTop: 4,
        // borderWidth: 1,
        // padding: ,
        // color: isDarkTheme ? 'white' : 'black',
        // borderColor: isDarkTheme ? 'white' : 'black',
        // borderWidth: 1,
        // borderRadius: 8,
      }}
    >
      <Text
        style={{
          color: isDarkTheme ? 'white' : 'black',
          fontSize: 22,
        }}
      >
        {children}
      </Text>
    </View>
  </TouchableOpacity>
)

const ItemInputNumber = ({
  title,
  number,
  onChangeNumber,
  isDarkTheme,
  inputStyle,
  max,
  min,
}) => (
  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <Text
      style={{
        ...styles.text,
        flex: 1,
        color: isDarkTheme ? 'white' : 'black',
      }}
    >
      {title}
    </Text>
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: isDarkTheme ? 'white' : 'black',
        borderWidth: 1,
        borderRadius: 8,
      }}
    >
      <CharButton
        isDarkTheme={isDarkTheme}
        onPress={() =>
          !min || min < number
            ? onChangeNumber(parseInt(number) - 1)
            : undefined
        }
      >
        -
      </CharButton>
      <TextInput
        style={{
          width: 55,
          height: 40,
          textAlign: 'center',
          // width: 60,
          marginTop: 4,
          padding: 10,
          color: isDarkTheme ? 'white' : 'black',
          borderColor: isDarkTheme ? 'white' : 'black',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          // borderTopWidth: 1,
          // borderBottomWidth: 1,
          // borderRadius: 8,
          fontSize: 16,
          ...inputStyle,
        }}
        onChangeText={(value) => {
          const number = Number(value)
          onChangeNumber(
            parseInt(
              !max || max > number ? (!min || min < number ? number : min) : max
            )
          )
        }}
        value={!!number ? String(number) : '0'}
        // placeholder="useless placeholder"
        keyboardType="numeric"
      />
      <CharButton
        isDarkTheme={isDarkTheme}
        onPress={() =>
          !max || max > number
            ? onChangeNumber(parseInt(number) + 1)
            : undefined
        }
      >
        +
      </CharButton>
    </View>
  </View>
)

// const ItemInputText = ({
//   title,
//   text,
//   onChangeText,
//   isDarkTheme,
//   inputStyle,
// }) => (
//   <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//     <Text
//       style={{
//         ...styles.text,
//         flex: 1,
//         color: isDarkTheme ? 'white' : 'black',
//       }}
//     >
//       {title}
//     </Text>
//     <TextInput
//       style={{
//         flex: 1,
//         height: 40,
//         // width: 60,
//         marginTop: 4,
//         borderWidth: 1,
//         padding: 10,
//         color: isDarkTheme ? 'white' : 'black',
//         borderColor: isDarkTheme ? 'white' : 'black',
//         borderWidth: 1,
//         borderRadius: 8,
//         fontSize: 16,
//         ...inputStyle,
//       }}
//       onChangeText={onChangeText}
//       value={text}
//       // placeholder="useless placeholder"
//       // keyboardType="text"
//     />
//   </View>
// )

const SettingsMenu = ({ navigation, setScreen, settings, updateSettings }) => {
  console.log('settings.cardSize :>> ', settings.cardSize)
  return (
    <ScrollView
      style={{
        ...styles.container,
        backgroundColor: settings.isDarkTheme ? 'black' : 'white',
      }}
    >
      <View
        style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', gap: 4 }}
      >
        <ItemSwitch
          title={language(
            settings.language,
            'При запуске открывать фотоаппарат'
          )}
          onValueChange={(value) => updateSettings({ startPhotoOnLoad: value })}
          value={settings.startPhotoOnLoad}
          isDarkTheme={settings.isDarkTheme}
        />
        <ItemSwitch
          title={language(settings.language, 'Темная тема')}
          onValueChange={(value) => updateSettings({ isDarkTheme: value })}
          value={settings.isDarkTheme}
          isDarkTheme={settings.isDarkTheme}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              ...styles.text,
              flex: 1,
              color: settings.isDarkTheme ? 'white' : 'black',
            }}
          >
            {language(settings.language, 'Язык')}
          </Text>
          <View
            style={{
              height: 40,
              borderWidth: 1,
              borderColor: settings.isDarkTheme ? 'white' : 'black',
              borderRadius: 8,
            }}
          >
            <Picker
              selectedValue={settings.language}
              style={{
                // maxHeight: 30,
                marginRight: -8,
                marginTop: -8,
                width: 200,
                color: settings.isDarkTheme ? 'white' : 'black',
                borderWidth: 1,
                borderLeftColor: 'blue',
                borderLeftWidth: 2,
                // backgroundColor: 'blue',
              }}
              onValueChange={(itemValue, itemIndex) =>
                updateSettings({ language: itemValue })
              }
              mode="dropdown"
              dropdownIconColor={settings.isDarkTheme ? 'white' : 'black'}
            >
              <Picker.Item label="Русский" value="ru" />
              <Picker.Item label="English" value="en" />
            </Picker>
          </View>
        </View>
        <ItemInputNumber
          title="Начальный угол наклона карты"
          number={settings.cardAngle}
          onChangeNumber={(value) => updateSettings({ cardAngle: value })}
          isDarkTheme={settings.isDarkTheme}
          min={0}
          max={180}
          // inputStyle={}
        />
        <ItemInputNumber
          title="Начальный размер карты, %"
          number={settings.cardScale}
          onChangeNumber={(value) => updateSettings({ cardScale: value })}
          isDarkTheme={settings.isDarkTheme}
          min={50}
          max={120}
          // inputStyle={}
        />
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
          }}
        >
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 75,
              width: 54,
              transform: [
                { rotate: settings.cardAngle - 90 + 'deg' },
                { scale: settings.cardScale / 100 },
              ],
            }}
          >
            <MaskedView
              style={{
                height: 75,
                width: 54,
              }}
              maskElement={
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FingerInverse width={54} height={75} />
                </View>
              }
            >
              <View style={{ position: 'relative' }}>
                <View
                  style={{
                    position: 'absolute',
                    width: 54,
                    height: 75,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    zIndex: 0,
                  }}
                />
                <Image
                  style={{
                    width: 54,
                    height: 75,
                    objectFit: 'contain',
                    zIndex: 1,
                  }}
                  source={pngCards[0][0]}
                />
                {/* <View
                style={{
                  position: 'absolute',
                  width: 54,
                  height: 75,
                  borderRadius: 3,
                  backgroundColor: 'rgba(0,0,0,' + brightness + ')',
                  zIndex: 2,
                }}
              /> */}
              </View>
            </MaskedView>
          </View>
        </View>
        <ButtonMenu
          color="#aa77ff"
          title={language(settings.language, 'О приложении')}
          onPress={() => navigation.navigate('About')}
        />
      </View>
    </ScrollView>
  )
}

export default function Settings(generalProps) {
  const { settings } = generalProps
  const orientation =
    generalProps.settings.screenOrientation === 'horizontal'
      ? 'landscape'
      : generalProps.settings.screenOrientation === 'vertical'
      ? 'portrait'
      : 'default'

  const screenProps = {
    orientation,
    headerStyle: {
      backgroundColor: generalProps.settings?.isDarkTheme ? '#202020' : 'white',
    },
    headerTintColor: generalProps.settings?.isDarkTheme ? 'white' : 'black',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    animation: 'slide_from_right',
  }

  // const headerRight = ({ isDarkTheme, ...props }) => (
  //   <View
  //     {...props}
  //     style={{
  //       marginRight: -4,
  //       height: 40,
  //       width: 40,
  //       borderRadius: 40,
  //       overflow: 'hidden',
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       // borderWidth: 1,
  //     }}
  //   >
  //     <Icon
  //       // {...props}
  //       // containerStyle={styles.icon}
  //       type="ionicon"
  //       name="camera-outline"
  //       color={isDarkTheme ? 'white' : 'black'}
  //       style={{
  //         borderRadius: 40,
  //         // alignItems: 'center',
  //         // overflow: 'hidden',
  //         // borderColor: 'blue',
  //         // borderWidth: 1,
  //         height: 40,
  //         width: 40,
  //         paddingTop: 7,
  //         overflow: 'hidden',
  //       }}
  //       onPress={() => generalProps.setScreen('photo')}
  //     />
  //   </View>
  // )

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Menu" component={SettingsMenu} /> */}
        <Stack.Screen
          name="Menu"
          options={{
            title: language(settings.language, 'Настройки'),
            // headerLeftContainerStyle: { padding: 10 },
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                style={{ marginLeft: 0, marginRight: 25 }}
                onPress={() => generalProps.setScreen('photo')}
              />
            ),
            // headerRight: (props) =>
            //   headerRight({ ...props, isDarkTheme: settings.isDarkTheme }),
            ...screenProps,
          }}
        >
          {(props) => <SettingsMenu {...props} {...generalProps} />}
        </Stack.Screen>
        {/* <Stack.Screen
          name="Theme"
          options={{
            title: language(settings.language, 'Внешний вид'),
            headerRight,
            ...screenProps,
          }}
        >
          {(props) => <SettingsTheme {...props} {...generalProps} />}
        </Stack.Screen> */}
        {/* <Stack.Screen
          name="Force"
          options={{
            title: language(settings.language, 'Параметры форсирования'),
            headerRight,
            ...screenProps,
          }}
        >
          {(props) => <SettingsForce {...props} {...generalProps} />}
        </Stack.Screen> */}
        <Stack.Screen
          name="About"
          options={{
            title: language(settings.language, 'О приложении'),
            // headerRight,
            ...screenProps,
          }}
        >
          {(props) => <AboutScreen {...props} {...generalProps} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    // justifyContent: 'center',
    // backgroundColor: 'black',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    // fontWeight: 'bold',
    fontSize: 16,
  },
})
