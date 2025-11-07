// app/screens/loginscreen.js
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Login Screen</Text>
      <Button title="Back to Home" onPress={() => router.push("/")} />
    </View>
  );
}
