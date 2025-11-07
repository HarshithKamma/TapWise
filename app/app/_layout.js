// app/_layout.js
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home / landing */}
      <Stack.Screen name="index" />

      {/* Auth screens */}
      <Stack.Screen name="screens/signupscreen" />
      <Stack.Screen name="screens/loginscreen" />
    </Stack>
  );
}
