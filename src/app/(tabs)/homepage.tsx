import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Homepage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Homepage</Text>
      <Text style={styles.subtitle}>
        Login berhasil 🎉
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E05A3A",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});