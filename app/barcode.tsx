import { Image, StyleSheet, Platform, ActivityIndicator, Text, View, Pressable } from 'react-native';

import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  PhotoFile,
  TakePhotoOptions,
  useCodeScanner
} from 'react-native-vision-camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
  const [isActive, setIsActive] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [mode, setMode] = useState("camera");

  const { hasPermission, requestPermission } = useCameraPermission()
  console.log('has permissions', hasPermission)

  const camera = useRef<Camera>(null);

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
      console.log(codes[0]);
    }
  })

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const onTakePicturePressed = async () => {
    const photo = await camera.current?.takePhoto({
      flash
    });
    setPhoto(photo)

  }

  if (!hasPermission) {
    return <ActivityIndicator />
  }

  if (!device) {
    return <Text>Camera device not found</Text>;
  }

  console.log('is Active: ', isActive);

  return (
    <View style={{flex: 1}}>
      {mode === 'qr' ? (
        <Camera 
          device={device} 
          isActive={mode === 'qr' && !photo && isActive}
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Camera 
          ref={camera} 
          style={StyleSheet.absoluteFill} 
          device={device} 
          isActive={isActive && !photo && mode === 'camera'}
          photo={true}
        /> 
      )}
      
      
      {photo ? (
          <>
            <Image source={{uri: photo.path}} style={StyleSheet.absoluteFill} />
            <FontAwesome5 
              name="arrow-left" 
              size={20} 
              color="white" 
              style={styles.closeButton}
              onPress={() => setPhoto(undefined)}
            />
          </>
        ) : 
        (
          <>
            <View style={styles.flashContainer}>
              <Ionicons 
                name={flash === "off" ? "flash-off" : "flash"}
                size={24} color={"white"}
                onPress={() => 
                  setFlash((curValue) => (curValue === "off" ? "on" : "off"))
                }
              />

              <Ionicons 
                name={mode === "camera" ? "qr-code-sharp" : "camera"}
                size={30} color={"white"}
                onPress={() => 
                  setMode(mode === "qr" ? "camera" : "qr")
                }
              />
            </View>  
            <Pressable
              onPress={onTakePicturePressed}
              style={styles.cameraButton}
            ></Pressable>
          </>
        )
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: 'white'
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 30
  },
  flashContainer: {
    position: 'absolute',
    right: 10,
    top: 50,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
    gap: 30
  },
});
