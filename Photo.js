import React, { useState, useEffect, useRef } from 'react'
import { Camera, CameraType } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import * as Sharing from 'expo-sharing'

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
  useWindowDimensions,
} from 'react-native'
import Button from './components/Button'
import MaskedView from '@react-native-masked-view/masked-view'
import * as ScreenOrientation from 'expo-screen-orientation'

import ViewShot, { releaseCapture } from 'react-native-view-shot'
import pngCards from './assets/playngCards/pngCards'
import { useMemo } from 'react'

import FingerInverse from './images/FingerInverse.svg'
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import orientationAtom from './state/atoms/orientationAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import AutoRotate from './components/AutoRotate'
import cardPosAtom from './state/atoms/cardPos'
import cardSuitValueAtom from './state/atoms/cardSuitValueAtom'
import { forwardRef } from 'react'

const pointsDistance = ([xA, yA], [xB, yB]) => {
  return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2))
}

const pointsAngle = ([xA, yA], [xB, yB]) => {
  return (Math.atan((yA - yB) / (xA - xB)) * 180) / Math.PI
}

const DragAndDropCard = ({
  angle,
  scale,
  brightness,
  k = 1,
  setScale,
  setAngle,
}) => {
  // const dimensions = useWindowDimensions()

  const [{ posX, posY, oldPosX, oldPosY }, setPos] = useRecoilState(cardPosAtom)
  const [suit, value] = useRecoilValue(cardSuitValueAtom)

  const [dragging, setDragging] = useState(false)
  const [doubleTouchDistanceAndAngle, setDoubleTouchDistanceAndAngle] =
    useState(null)
  // console.log('doubleTouchDistance :>> ', doubleTouchDistance)
  // Create a pan responder to handle touch events
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          // When touch gesture starts,
          //set dragging to true
          setDragging(true)
        },
        onPanResponderMove: (event, gestureState) => {
          const activeTouches = event.nativeEvent.changedTouches.length
          // console.log('gestureState :>> ', gestureState)
          // position.setValue({ x: gestureState.dx, y: gestureState.dy })
          if (activeTouches === 1 && !doubleTouchDistanceAndAngle) {
            setPos((state) => ({
              ...state,
              posX: oldPosX + gestureState.dx / k,
              posY: oldPosY + gestureState.dy / k,
            }))
          } else if (activeTouches >= 2) {
            const touches = event.nativeEvent.changedTouches

            const touchA = touches[0]
            const touchB = touches[1]
            // console.log('oldPosX :>> ', oldPosX)
            // console.log('touches[0] :>> ', touches[0])
            // setPos((state) => ({
            //   ...state,
            //   posX: oldPosX + touches[0].pageX / k,
            //   posY: oldPosY + touches[0].pageY / k,
            // }))

            // console.log('touchA :>> ', touchA)

            const distance = pointsDistance(
              [touchA.pageX, touchA.pageY],
              [touchB.pageX, touchB.pageY]
            )
            const newAngle = pointsAngle(
              [touchA.pageX, touchA.pageY],
              [touchB.pageX, touchB.pageY]
            )
            // console.log('angle :>> ', angle)
            if (!doubleTouchDistanceAndAngle) {
              setDoubleTouchDistanceAndAngle({
                distance,
                angle: newAngle,
                posX: oldPosX + gestureState.dx / k,
                posY: oldPosY + gestureState.dy / k,
              })
              setPos((state) => ({
                ...state,
                posX: oldPosX + gestureState.dx / k,
                posY: oldPosY + gestureState.dy / k,
              }))
            } else {
              const movedPercentsDistance =
                (distance / doubleTouchDistanceAndAngle.distance - 1) / 2 + 1
              setScale(Math.floor(movedPercentsDistance * scale))
              const movedPercentsAngle =
                newAngle - doubleTouchDistanceAndAngle.angle
              setAngle(Math.floor(movedPercentsAngle + angle))
            }
          }
        },
        // Animated.event(
        //   [
        //     null,
        //     {
        //       dx: position.x,
        //       dy: position.y,
        //     },
        //   ],
        //   {
        //     useNativeDriver: false,
        //     listener: (event) => {
        //       //alert(fooRef.current);
        //       console.log(event.target)
        //     },
        //   }
        // ),
        onPanResponderRelease: (event, gestureState) => {
          // const activeTouches = event.nativeEvent.changedTouches.length
          // When touch gesture is released,
          // setOldPosX(oldPosX + gestureState.dx / k)
          // setOldPosY(oldPosY + gestureState.dy / k)
          // if (activeTouches === 0) {
          // console.log('activeTouches :>> ', activeTouches)
          if (!doubleTouchDistanceAndAngle) {
            setPos((state) => ({
              ...state,
              oldPosX: oldPosX + gestureState.dx / k,
              oldPosY: oldPosY + gestureState.dy / k,
            }))
          } else {
            setPos((state) => ({
              ...state,
              oldPosX: doubleTouchDistanceAndAngle.posX,
              oldPosY: doubleTouchDistanceAndAngle.posY,
            }))
          }
          // }
          //set dragging to false
          // position.setValue({ x: gestureState.dx, y: gestureState.dy })
          // position.flattenOffset()
          // if (activeTouches === 0) {
          setDoubleTouchDistanceAndAngle(null)
          setDragging(false)
          // }
        },
      }),
    [oldPosX, oldPosY, k, doubleTouchDistanceAndAngle]
  )

  const card = pngCards[suit][value]

  return (
    <Animated.View
      style={[
        styles.card,
        {
          // transform: pan.getTranslateTransform(),
          // transform: [{ translateX: position.x }, { translateY: position.y }],
          transform: [
            // or pan.getTranslateTransform()
            { translateX: posX },
            { translateY: posY },
            // { scale },
          ],
          opacity: dragging ? 0.8 : 1,
          // top: '50%',
          // left: '50%',
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* <SvgCssUri width="100%" height="100%" uri="./playngCards/Clubs/JC.svg" /> */}
      {/* <Card style={{ scale: 0.3 }} /> */}

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // paddingHorizontal: 200,
          // paddingVertical: 200,
          // borderColor: 'red',
          // borderWidth: 1,
          height: 75,
          width: 54,
          transform: [{ rotate: angle - 90 + 'deg' }, { scale: scale / 100 }],
          // maskImage:
          //   'linear-gradient(to top, black 0%, black 20px, transparent 20px, transparent 80%, black 80%, black 100%);',
        }}
      >
        <AutoRotate duration={0}>
          <MaskedView
            style={{
              // flex: 1,
              // flexDirection: 'row',
              height: 75,
              width: 54,
              // borderWidth: 1,
              // borderColor: 'blue',
            }}
            maskElement={
              <View
                style={{
                  // Transparent background because mask is based off alpha channel.
                  backgroundColor: 'transparent',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // transform: [{ rotate: '90deg' }],
                }}
              >
                <FingerInverse width={54} height={75} />
                {/* <Text
                style={{
                  fontSize: 60,
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                Basic Mask
              </Text> */}
              </View>
            }
          >
            {/* <View style={{ backgroundColor: 'green', width: 200, height: 200 }} /> */}
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
                // style={{ position: 'absolute', top: 200, left: 40 }}
                style={
                  // styles.hole,
                  {
                    width: 54,
                    height: 75,
                    objectFit: 'contain',
                    zIndex: 1,
                    // transform: [{ rotate: '90deg' }],
                    // borderColor: 'green',
                    // borderWidth: 1,
                    // maskImage: 'linear-gradient(to top, transparent, black);',
                  }
                }
                source={card}
              />
              <View
                style={{
                  position: 'absolute',
                  width: 54,
                  height: 75,
                  borderRadius: 3,
                  backgroundColor: 'rgba(0,0,0,' + brightness + ')',
                  zIndex: 2,
                }}
              />
            </View>
          </MaskedView>
        </AutoRotate>
        {/* <Image
            // style={{ position: 'absolute', top: 200, left: 40 }}
            style={[
              // styles.hole,
              {
                width: 54,
                height: 75,
                objectFit: 'contain',
                transform: [{ rotate: '90deg' }],
                // maskImage: 'linear-gradient(to top, transparent, black);',
              },
            ]}
            source={card}
          /> */}
      </View>
    </Animated.View>
  )
}

const ButtonCardSelect = ({ onPress, active, isDarkTheme, children }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        // paddingHorizontal: 20,
        // paddingVertical: 20,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: active ? '#99ff99' : 'white',
        height: 80,
        width: 80,
        // flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        // margin: 8,
        borderRadius: 15,
      }}
    >
      <AutoRotate duration={0}>{children}</AutoRotate>
    </View>
  </TouchableOpacity>
)

const CardSelectPage = ({ onExit, isDarkTheme }) => {
  const orientation = useRecoilValue(orientationAtom)
  const [[cardSuit, cardValue], setCardSuitValue] =
    useRecoilState(cardSuitValueAtom)

  const setCardValueAndExit = (value) => {
    setCardSuitValue((state) => [state[0], value])
    onExit()
  }

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDarkTheme ? 'black' : 'white',
        // position: 'absolute',
        // zIndex: show ? 1 : 0,
        // opacity: show ? 1 : 0,
        // borderColor: 'green',
        // borderWidth: 1,
        width: '100%',
        // height: '100%',
        // gap: 40,
        // justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: orientation === 0 ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          height: 100,
          // gap: 20,
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <ButtonCardSelect
          onPress={() => setCardSuitValue((state) => [0, state[1]])}
          active={cardSuit === 0}
        >
          <MaterialCommunityIcons name="cards-spade" size={60} color="black" />
        </ButtonCardSelect>
        <ButtonCardSelect
          onPress={() => setCardSuitValue((state) => [1, state[1]])}
          active={cardSuit === 1}
        >
          <MaterialCommunityIcons name="cards-heart" size={60} color="red" />
        </ButtonCardSelect>
        <ButtonCardSelect
          onPress={() => setCardSuitValue((state) => [2, state[1]])}
          active={cardSuit === 2}
        >
          <MaterialCommunityIcons name="cards-club" size={60} color="black" />
        </ButtonCardSelect>
        <ButtonCardSelect
          onPress={() => setCardSuitValue((state) => [3, state[1]])}
          active={cardSuit === 3}
        >
          <MaterialCommunityIcons name="cards-diamond" size={60} color="red" />
        </ButtonCardSelect>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: orientation !== 0 ? 'column' : 'row-reverse',
          justifyContent: 'space-between',
          // height: '95%',
          gap: 20,
          flex: 1,
          paddingHorizontal: 40,
          paddingVertical: 40,
          // width: '100%',
          // height: '100%',
          // borderColor: 'red',
          // borderWidth: 1,
        }}
      >
        {orientation !== 0 ? (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                height: 100,
                // gap: 20,
                width: '100%',
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(0)}
                active={cardValue === 0}
              >
                <Text style={{ fontSize: 50 }}>A</Text>
              </ButtonCardSelect>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 100,
                // gap: 20,
                width: '100%',
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(1)}
                active={cardValue === 1}
              >
                <Text style={{ fontSize: 50 }}>2</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(2)}
                active={cardValue === 2}
              >
                <Text style={{ fontSize: 50 }}>3</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(3)}
                active={cardValue === 3}
              >
                <Text style={{ fontSize: 50 }}>4</Text>
              </ButtonCardSelect>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 100,
                // gap: 20,
                width: '100%',
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(4)}
                active={cardValue === 4}
              >
                <Text style={{ fontSize: 50 }}>5</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(5)}
                active={cardValue === 5}
              >
                <Text style={{ fontSize: 50 }}>6</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(6)}
                active={cardValue === 6}
              >
                <Text style={{ fontSize: 50 }}>7</Text>
              </ButtonCardSelect>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 100,
                // gap: 20,
                width: '100%',
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(7)}
                active={cardValue === 7}
              >
                <Text style={{ fontSize: 50 }}>8</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(8)}
                active={cardValue === 8}
              >
                <Text style={{ fontSize: 50 }}>9</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(9)}
                active={cardValue === 9}
              >
                <Text style={{ fontSize: 50 }}>10</Text>
              </ButtonCardSelect>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 100,
                // gap: 20,
                width: '100%',
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(10)}
                active={cardValue === 10}
              >
                <Text style={{ fontSize: 50 }}>J</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(11)}
                active={cardValue === 11}
              >
                <Text style={{ fontSize: 50 }}>Q</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(12)}
                active={cardValue === 12}
              >
                <Text style={{ fontSize: 50 }}>K</Text>
              </ButtonCardSelect>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                display: 'flex',
                // flexDirection: 'row',
                // flexWrap: 'wrap',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                // width: 50,
                gap: 20,
                flex: 1,
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(0)}
                active={cardValue === 0}
              >
                <Text style={{ fontSize: 50 }}>A</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(1)}
                active={cardValue === 1}
              >
                <Text style={{ fontSize: 50 }}>2</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(2)}
                active={cardValue === 2}
              >
                <Text style={{ fontSize: 50 }}>3</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(3)}
                active={cardValue === 3}
              >
                <Text style={{ fontSize: 50 }}>4</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(4)}
                active={cardValue === 4}
              >
                <Text style={{ fontSize: 50 }}>5</Text>
              </ButtonCardSelect>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flex: 1,
                gap: 20,
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(5)}
                active={cardValue === 5}
              >
                <Text style={{ fontSize: 50 }}>6</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(6)}
                active={cardValue === 6}
              >
                <Text style={{ fontSize: 50 }}>7</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(7)}
                active={cardValue === 7}
              >
                <Text style={{ fontSize: 50 }}>8</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(8)}
                active={cardValue === 8}
              >
                <Text style={{ fontSize: 50 }}>9</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(9)}
                active={cardValue === 9}
              >
                <Text style={{ fontSize: 50 }}>10</Text>
              </ButtonCardSelect>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flex: 1,
                gap: 20,
              }}
            >
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(10)}
                active={cardValue === 10}
              >
                <Text style={{ fontSize: 50 }}>J</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(11)}
                active={cardValue === 11}
              >
                <Text style={{ fontSize: 50 }}>Q</Text>
              </ButtonCardSelect>
              <ButtonCardSelect
                onPress={() => setCardValueAndExit(12)}
                active={cardValue === 12}
              >
                <Text style={{ fontSize: 50 }}>K</Text>
              </ButtonCardSelect>
            </View>
          </>
        )}
      </View>
    </View>
  )
}

const ViewShotComponent = forwardRef(({ prepared, children }, ref) => {
  const { posX, posY } = useRecoilValue(cardPosAtom)
  return (
    <ViewShot
      ref={ref}
      // style={styles.viewShot}
      style={{
        transform: [
          { scale: prepared ? 1 : 3 },
          { translateX: prepared ? 0 : -posX },
          { translateY: prepared ? 0 : -posY },
        ],
      }}
      options={{
        fileName: 'Your-File-Name',
        format: 'jpg',
        quality: 0.9,
      }}
    >
      {children}
    </ViewShot>
  )
})

export default function Photo({ goToSettings, settings }) {
  const [selectCardPage, setSelectCardPage] = useState(false)
  // const [type, setType] = useState(CameraType.back)
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)

  const [cardAngle, setCardAngle] = useState(settings.cardAngle ?? 85)
  const [cardScale, setCardScale] = useState(settings.cardScale ?? 0.8)
  const [cardBrightness, setCardBrightness] = useState(0)
  const [fixPhoto, setFixPhoto] = useState(false)
  const [savePhoto, setSavePhoto] = useState(false)
  const [photoPrepared, setPhotoPrepared] = useState(false)
  // const orientation = useRecoilValue(orientationAtom)
  // const { posX, posY } = useRecoilValue(cardPosAtom)

  const cameraRef = useRef(null)
  const ref = useRef()

  const isDarkTheme = settings?.isDarkTheme

  const toggleCardBrightness = (adjust) => {
    if (adjust > 0) {
      if (cardBrightness < 0.4) setCardBrightness((state) => state + 0.1)
    } else {
      if (cardBrightness > 0) setCardBrightness((state) => state - 0.1)
    }
  }

  const ShotComponent = useMemo(
    () =>
      fixPhoto || photoPrepared
        ? (props) => (
            <ViewShotComponent ref={ref} prepared={photoPrepared} {...props} />
          )
        : View,
    [fixPhoto]
  )
  // const [orientation, setOrientation] = useState(
  //   ScreenOrientation.Orientation.PORTRAIT_UP
  // )

  // const orientation = useRecoilValue(orientationAtom)

  // useEffect(() => {
  //   DeviceMotion.addListener(({ orientation, rotation }) => {
  //     setOrientation(orientationCalculation(rotation.gamma, rotation.beta))
  //   })
  // }, [])

  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)

  // useEffect(() => {
  //   // set initial orientation
  //   ScreenOrientation.getOrientationAsync().then((info) => {
  //     setOrientation(info.orientation)
  //   })

  //   // subscribe to future changes
  //   const subscription = ScreenOrientation.addOrientationChangeListener(
  //     (evt) => {
  //       setOrientation(evt.orientationInfo.orientation)
  //     }
  //   )

  //   // return a clean up function to unsubscribe from notifications
  //   return () => {
  //     ScreenOrientation.removeOrientationChangeListener(subscription)
  //   }
  // }, [])
  // const [type,setType] = useState(Camera.Constants.Type.back)
  // const [permission, requestPermission] = Camera.useCameraPermissions()

  // if (!permission) ...

  // if (!permission.granted) ...

  // function toggleCameraType() {
  //   setType((current) =>
  //     current === CameraType.back ? CameraType.front : CameraType.back
  //   )
  // }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        console.log(data)
        setImage(data.uri)
        setFixPhoto(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const savePicture = async (uri) => {
    if (uri) {
      try {
        // const assetPrimer = {
        //   albumId: '-2075821635',
        //   creationTime: 0,
        //   duration: 0,
        //   filename: 'Your-File-Name9149790592040185410.jpg',
        //   height: 1570,
        //   id: '1000055651',
        //   mediaType: 'photo',
        //   modificationTime: 1699982945000,
        //   uri: 'file:///storage/emulated/0/DCIM/Your-File-Name9149790592040185410.jpg',
        //   width: 1032,
        // }
        const asset = await MediaLibrary.createAssetAsync(uri)
        // console.log('asset :>> ', asset)
        // const asset = await MediaLibrary.saveToLibraryAsync(uri)
        var album = await MediaLibrary.getAlbumAsync('Cheese2')
        // console.log('album :>> ', album)
        if (!album) {
          album = await MediaLibrary.createAlbumAsync('Cheese2', asset, false)
        }
        // console.log('album2 :>> ', album)
        // await MediaLibrary.createAlbumAsync('Expo', asset, false)
        // await MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
        releaseCapture(uri)
        // console.log('asset :>> ', asset)
        // const path = await Marker.markImage({
        //   backgroundImage: {
        //     src: image,
        //     scale: 1,
        //   },
        //   watermarkImages: [
        //     {
        //       src: require('./images/test.png'),
        //       position: {
        //         position: Position.topLeft,
        //       },
        //     },
        //   ],
        // })
        // const asset2 = await MediaLibrary.createAssetAsync(path)
        await Sharing.shareAsync(
          asset.uri
          //   , {
          //   mimeType: 'image/jpeg',
          // }
        )
        // alert('Picture saved! 🎉')
        setImage(null)
        // console.log('saved successfully')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const savePicture2 = async () => {
    setFixPhoto(false)
    setPhotoPrepared(true)
    setSavePhoto(true)
    // return await ref.current.capture().then((uri) => {
    //   console.log('do something with ', uri)
    //   savePicture(uri)
    // })
  }

  useEffect(() => {
    ;(async () => {
      if (savePhoto)
        await ref.current.capture().then((uri) => {
          // console.log('do something with ', uri)
          savePicture(uri)
          setSavePhoto(false)
          setPhotoPrepared(false)
        })
    })()
  }, [savePhoto])

  useEffect(() => {
    ;(async () => {
      MediaLibrary.requestPermissionsAsync()
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
    })()
  }, [])

  if (hasCameraPermission === false) {
    return <Text>Нет доступа к камере</Text>
  }

  // useEffect(() => {
  //   // on mount
  //   ref.current.capture().then(uri => {
  //     console.log("do something with ", uri);
  //     savePicture(uri)
  //   });
  // }, []);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkTheme ? 'black' : 'white',
      }}
    >
      {/* {!image ? ( */}
      {/* <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        > */}
      {/* {!image ? (
          <> */}
      <View style={styles.controls}>
        {/* {!image && !selectCardPage && (
          <Button icon="retweet" onPress={toggleCameraType} />
        )} */}
        {/* <MaterialIcons name="brightness-6" size={24} color="black" /> */}
        {!selectCardPage && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 27,
            }}
          >
            <Button
              Component={MaterialIcons}
              icon="brightness-5"
              onPress={() => toggleCardBrightness(1)}
              isDarkTheme={isDarkTheme}
            />
            <Button
              Component={MaterialIcons}
              icon="brightness-7"
              onPress={() => toggleCardBrightness(-1)}
              isDarkTheme={isDarkTheme}
            />
          </View>
        )}
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {/* <View style={{ width: 32 }}> */}
          <AutoRotate>
            <TouchableOpacity
              onPress={() => setSelectCardPage((state) => !state)}
            >
              <MaterialCommunityIcons
                name="cards-playing-spade-multiple-outline"
                // style={{ width: 32 }}
                size={40}
                color={isDarkTheme ? '#f1f1f1' : '#090909'}
              />
            </TouchableOpacity>
          </AutoRotate>
          {/* </View> */}
        </View>
        {!image && !selectCardPage && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 27,
            }}
          >
            <Button
              onPress={() =>
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }
              icon="flash"
              color={flash ? (isDarkTheme ? '#f1f1f1' : '#090909') : 'gray'}
            />
            <Button
              onPress={goToSettings}
              icon="cog"
              isDarkTheme={isDarkTheme}
            />
          </View>
        )}
      </View>
      {selectCardPage ? (
        <>
          <CardSelectPage
            show={selectCardPage}
            onExit={() => setSelectCardPage(false)}
            isDarkTheme={isDarkTheme}
          />
        </>
      ) : (
        <>
          <View
            style={{
              // position: 'relative',
              // flex: 1,
              display: 'flex',
              maxWidth: '100%',
              aspectRatio: 5 / 7.6,
            }}
          >
            <View
              style={{
                // flex: 1,
                // width: '100%',
                // height: '100%',
                // borderColor: 'green',
                // borderWidth: 2,
                display: 'flex',
                // flexDirection: 'column',
                // backgroundColor: 'white',
                // position: 'absolute',
                // opacity: selectCardPage ? 0 : 1,
                // zIndex: selectCardPage ? 0 : 1,
                // gap: 40,
                // justifyContent: 'space-between',
                alignItems: 'center',
                justifyContent: 'center',
                // aspectRatio: 5 / 7.6,
                // maxWidth: '100%',
                // maxHeight: '100%',
              }}
            >
              <ShotComponent>
                <View
                  style={styles.viewShot}
                  // style={{ hei, borderColor: 'green', borderWidth: 1 }}
                >
                  {!image ? (
                    <Camera
                      style={styles.camera}
                      type={CameraType.back}
                      flashMode={flash}
                      ref={cameraRef}
                    />
                  ) : (
                    <Image source={{ uri: image }} style={styles.image} />
                  )}
                  <View
                    style={{
                      // flexDirection: 'row',
                      // justifyContent: 'space-between',
                      // paddingHorizontal: 30,
                      overflow: 'hidden',
                      position: 'absolute',
                      zIndex: 99,
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      // borderColor: 'blue',
                      // borderWidth: 1,
                    }}
                  >
                    {/* <Image
            style={{ position: 'absolute', top: 200, left: 40 }}
            source={require('./images/test.png')}
          /> */}
                    <DragAndDropCard
                      angle={cardAngle}
                      scale={cardScale}
                      setScale={setCardScale}
                      setAngle={setCardAngle}
                      brightness={cardBrightness}
                      k={fixPhoto ? 3 : 1}
                    />
                  </View>
                </View>
              </ShotComponent>
            </View>
          </View>
          <View style={{ ...styles.controls }}>
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                // paddingHorizontal: 20,
                // borderWidth: 1,
                // borderColor: 'red',
                // paddingVertical: 5,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 27,
                }}
              >
                <Button
                  icon="cw"
                  onPress={() => setCardAngle((state) => state + 2)}
                  isDarkTheme={isDarkTheme}
                />
                <Button
                  icon="ccw"
                  onPress={() => setCardAngle((state) => state - 2)}
                  isDarkTheme={isDarkTheme}
                />
              </View>
              {image ? (
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 27,
                    // justifyContent: 'space-between',
                    // paddingHorizontal: 50,
                  }}
                >
                  <Button
                    // title="Re-take"
                    onPress={() => {
                      setImage(null)
                      setFixPhoto(false)
                    }}
                    icon="retweet"
                    isDarkTheme={isDarkTheme}
                  />
                  <Button
                    // title="Save"
                    onPress={() => savePicture2(image)}
                    icon="check"
                    isDarkTheme={isDarkTheme}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    // justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderRadius: 9999,
                      width: 60,
                      height: 60,
                    }}
                    onPress={takePicture}
                  >
                    <AutoRotate>
                      <Entypo name="camera" size={35} color="black" />
                    </AutoRotate>
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 27,
                }}
              >
                <Button
                  icon="plus"
                  onPress={() => setCardScale((state) => state + 3)}
                  isDarkTheme={isDarkTheme}
                />
                <Button
                  icon="minus"
                  onPress={() => setCardScale((state) => state - 3)}
                  isDarkTheme={isDarkTheme}
                />
              </View>
              {/* <Button
          title="Take a picture"
          onPress={
            // savePicture2
            takePicture
          }
          icon="camera"
        /> */}
            </View>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    // paddingTop: Constants.statusBarHeight,
    // backgroundColor: 'black',
    // borderWidth: 1,
    // borderColor: 'blue',
    // padding: 8,
  },
  viewShot: {
    // flex: 1,
    // justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: 'black',
    // padding: 8,
    position: 'relative',
    aspectRatio: 5 / 7.6,
    borderWidth: 2,
    maxWidth: '100%',
    maxHeight: '100%',
    // height: 620,
    // borderColor: 'blue',
    // overflow: 'hidden',
  },
  controls: {
    // flex: 0.1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,

    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // paddingVertical: 10,

    // borderWidth: 3,
    // borderColor: 'blue',
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    // flex: 1,
    // borderRadius: 20,
    // paddingTop: 10,
    // position: 'absolute',
    width: '100%',
    height: '100%',
    // height: 300,
    // zIndex: 0,
  },
  image: {
    flex: 1,
    // borderRadius: 20,
    // position: 'absolute',
    width: '100%',
    height: '100%',
    // zIndex: 0,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 0,
    // height: 0,
    aspectRatio: 744.09448819 / 1052.3622047,
    // backgroundColor: 'blue',
    // justifyContent: 'center',
    // alignItems: 'flex-start',
    // paddingHorizontal: 16,
    // paddingVertical: 10,
    // borderWidth: 1,
    // borderColor: 'green',
    // borderRadius: 10,
    // marginBottom: 10,
    // elevation: 5,
  },
})
