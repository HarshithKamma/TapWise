import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const PRELOADED_CARDS = [
  { name: "Chase Freedom", network: "Visa", reward_tag: "Groceries" },
  { name: "Chase Sapphire Preferred", network: "Visa", reward_tag: "Travel" },
  { name: "Amex Gold", network: "Amex", reward_tag: "Dining" },
  { name: "Amex Platinum", network: "Amex", reward_tag: "Travel" },
  { name: "Citi Custom Cash", network: "Mastercard", reward_tag: "Rotating" },
  { name: "Discover It", network: "Discover", reward_tag: "Rotating" },
];

const BASE_URL = "http://127.0.0.1:10000"; // later we swap to deployed URL

export default function CardScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [selected, setSelected] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem("tapwise_user_id");
      if (!id) {
        Alert.alert("Session error", "Please log in again.");
        router.replace("/screens/loginscreen");
        return;
      }
      setUserId(parseInt(id, 10));
    };
    load();
  }, []);

  const toggleCard = (name) => {
    setSelected((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const saveCards = async () => {
    if (!userId) return;
    const chosen = PRELOADED_CARDS.filter((c) => selected[c.name]);

    if (chosen.length === 0) {
      Alert.alert("Select at least one card", "Pick your daily-use cards.");
      return;
    }

    try {
      setSaving(true);
      for (const card of chosen) {
        await fetch(`${BASE_URL}/cards/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            name: card.name,
            network: card.network,
            reward_tag: card.reward_tag,
          }),
        });
      }
      Alert.alert("Saved", "Your mirror wallet is ready.");
      router.replace("/screens/homescreen");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save cards. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const renderCard = ({ item }) => {
    const isSelected = !!selected[item.name];
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleCard(item.name)}
      >
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          {item.network} • {item.reward_tag}
        </Text>
        <Text style={styles.cardHint}>
          {isSelected ? "Selected" : "Tap to select"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your daily cards</Text>
      <Text style={styles.subtitle}>
        We’ll build a mirror wallet and recommend the right card at the right place.
      </Text>

      <FlatList
        data={PRELOADED_CARDS}
        renderItem={renderCard}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingVertical: 16 }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveCards} disabled={saving}>
        <Text style={styles.saveButtonText}>
          {saving ? "Saving..." : "Save & Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f6fa" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8, color: "#0A2647" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f0ff",
  },
  cardName: { fontSize: 16, fontWeight: "600", color: "#111" },
  cardMeta: { fontSize: 13, color: "#666", marginTop: 4 },
  cardHint: { fontSize: 12, color: "#007AFF", marginTop: 6 },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
