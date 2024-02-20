import * as React from 'react'
import { Text, TouchableOpacity, StyleSheet, Easing } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import AutoRotate from './AutoRotate'

export default function Button({
  Component = Entypo,
  title,
  onPress,
  icon,
  color,
  alt,
  style,
  isDarkTheme,
}) {
  return (
    <AutoRotate>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          // { transform: [{ rotate: -orientation + 'deg' }] },
          alt
            ? {
                backgroundColor: 'white',
                borderRadius: 100,
                width: 50,
                height: 50,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: ' center',
              }
            : { backgroundColor: 'transparent' },
          style,
        ]}
      >
        <Component
          name={icon}
          size={28}
          color={color ? color : isDarkTheme ? '#f1f1f1' : '#090909'}
        />
        {title && <Text style={styles.text}>{title}</Text>}
      </TouchableOpacity>
    </AutoRotate>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: '20px',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f1f1f1',
    marginLeft: 10,
  },
})
