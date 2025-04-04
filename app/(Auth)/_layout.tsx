
import React from 'react'
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
   <Stack.Screen name="signinAuth" options={{ headerShown: false }} />
   <Stack.Screen name="signupAuth" options={{ headerShown: false }} />
  </Stack>
  )
}

export default AuthLayout;

