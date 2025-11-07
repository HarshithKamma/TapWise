import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem("tapwise_token");
      const username = await AsyncStorage.getItem("tapwise_user_name");

      if (!token) {
        router.replace("/screens/loginscreen");
      } else {
        setName(username || "User");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const logout = async () => {
    await AsyncStorage.removeItem("tapwise_token");
    await AsyncStorage.removeItem("tapwise_user_name");
    router.replace("/screens/loginscreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {name} 👋</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
});
