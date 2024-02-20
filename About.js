import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Linking,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import ButtonMenu from './components/ButtonMenu'
import { ContactIcon } from './components/infoComponents'
import language from './helpers/language'
const appJson = require('./app.json')

const AboutScreen = ({ setScreen, settings }) => {
  const textColor = settings.isDarkTheme ? 'white' : 'black'
  const backgroundColor = settings.isDarkTheme ? 'black' : 'white'
  const fontSize = 20

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor,
      }}
    >
      <ScrollView>
        <View style={styles.content}>
          <Text
            style={{
              ...styles.title,
              color: settings.isDarkTheme ? 'white' : 'black',
            }}
          >
            Cheese2
          </Text>
          {/* <Text
          style={{
            ...styles.title,
            color: settings.isDarkTheme ? 'white' : 'black',
          }}
        >
          О приложении
        </Text> */}
          <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
            <Text
              style={{
                ...styles.paragraph,
                fontSize: fontSize,
                color: textColor,
              }}
            >
              {`\t\t\t\t ${language(
                settings.language,
                'Приложение для быстрого добавления игральной карты в руку человека на фотографии'
              )}.`}
            </Text>
            <Text
              style={{
                ...styles.paragraph,
                fontSize: fontSize,
                color: textColor,
              }}
            >
              {' '}
              {`\t\t\t\t ${language(
                settings.language,
                'Если у Вас появились предложения или замечания по приложению, то сообщите об этом разработчику напрямую'
              )}:`}
            </Text>
          </View>
          <View style={styles.contacts}>
            <ContactIcon
              iconName="telegram"
              backgroundColor="#0088cc"
              url="http://t.me/escalion"
              data="@Escalion"
              textColor={textColor}
            />
          </View>
          <View style={{ ...styles.developer, borderColor: 'gray' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...styles.paragraph,
                  fontSize: fontSize,
                  color: textColor,
                }}
              >
                {`${language(settings.language, 'Разработчик')}:`}
              </Text>
              <Text
                style={{
                  ...styles.paragraph,
                  fontSize: fontSize,
                  fontStyle: 'italic',
                  color: textColor,
                }}
              >
                {language(settings.language, 'Алексей Белинский')}
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://escalion.ru')}
              >
                <Text
                  style={{
                    ...styles.paragraph,
                    fontStyle: 'italic',
                    fontSize: fontSize,
                    color: '#aa77ff',
                  }}
                >
                  https://Escalion.ru
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              // onPressIn={() => setStartToOpenDev(new Date())}
              // onPressOut={() => endToOpenDev()}
            >
              <Image
                style={{
                  width: 96,
                  height: 96,
                }}
                source={require('./assets/images/logo-dev.png')}
                // resizeMethod="scale"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <ButtonMenu
            title={language(settings.language, 'Поблагодарить разработчика')}
            color="#aa77ff"
            onPress={() =>
              Linking.openURL(
                'https://www.tinkoff.ru/rm/belinskiy.aleksey5/5Yi7i79252'
              )
            }
          />
          {/* <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <ButtonMenu
            title="Вернуться в настройки"
            onPress={() => setScreen('settings')}
          />
        </View> */}

          {/* <ButtonMenu
          title="Поблагодарить"
          style={{ marginBottom: 20 }}
          onPress={() =>
            Linking.openURL(
              'https://money.alfabank.ru/p2p/web/transfer/abelinskii3048'
            )
          }
        /> */}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{ ...styles.bottom, borderColor: 'gray' }}
        // onPressIn={() =>
        //   setModal(
        //     <ModalChangeLog
        //       visible={true}
        //       onOuterClick={() => {
        //         setModal(null)
        //       }}
        //     />
        //   )
        // }
      >
        <Text style={{ fontSize: 16, color: textColor }}>
          {`${language(settings.language, 'Версия')}: ${appJson.expo.version}`}
        </Text>
      </TouchableOpacity>
      {/* {modal} */}
    </View>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  developer: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  contacts: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  paragraph: {
    marginBottom: 6,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  bottom: {
    // height: 36,
    // flex: 1,
    // borderLeftColor: 'red',
    // borderLeftWidth: 3,
    alignItems: 'center',
    paddingTop: 5,
    borderTopWidth: 1,
  },
})
