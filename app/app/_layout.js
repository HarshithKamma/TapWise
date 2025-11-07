import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("tapwise_token");
      if (token) router.replace("/screens/homescreen");
    };
    checkAuth();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
