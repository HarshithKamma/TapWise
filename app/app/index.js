// app/index.js
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>TapWise App ✅</Text>
      <Button title="Go to Login" onPress={() => router.push("/screens/loginscreen")} />
      <Button title="Go to Signup" onPress={() => router.push("/screens/signupscreen")} />
    </View>
  );
}
