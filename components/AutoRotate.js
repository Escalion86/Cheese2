import * as React from 'react'
import { Easing } from 'react-native'
import { useRecoilValue } from 'recoil'
import orientationAtom from '../state/atoms/orientationAtom'
import { Animated } from 'react-native'
import { useState } from 'react'

export default function AutoRotate({ style, duration = 500, ...props }) {
  const orientation = useRecoilValue(orientationAtom)
  const [rotateAnim] = useState(new Animated.Value(0)) // Initial value for rotate: 0

  React.useEffect(() => {
    // Animated.loop(
    Animated.timing(rotateAnim, {
      toValue: orientation,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    })
      // )
      .start()
  }, [orientation])

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['90deg', '0deg', '-90deg'],
  })

  return (
    <Animated.View
      style={{
        ...style,
        transform: [
          {
            rotate: rotateInterpolate,
          },
        ],
      }}
      {...props}
    />
  )
}
