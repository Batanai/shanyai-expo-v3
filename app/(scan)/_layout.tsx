import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='events' options={{headerShown: false}}/>
      <Stack.Screen name='list-tickets' options={{headerShown: false}}/>
      <Stack.Screen name='scan-barcode' options={{headerShown: false}}/>

    </Stack>
  )
}

export default AuthLayout