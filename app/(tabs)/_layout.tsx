import { Stack } from "expo-router";
import "../global.css";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" />
      <Stack.Screen name="profile" />
         <Stack.Screen name="signupHospital" options={{ headerShown: false }} />
         <Stack.Screen name = "updateProfile"/>
    </Stack>
  );
}
