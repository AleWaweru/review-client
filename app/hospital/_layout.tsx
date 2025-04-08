import { Stack } from "expo-router";
import "../global.css";

export default function HospitalLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: true, title: "Edit Hospital Details" }} />
    </Stack>
  );
}