import { Stack } from "expo-router";
import "../global.css";

export default function EditHospitalLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: true, title: "Edit Details" }} />
    </Stack>
  );
}