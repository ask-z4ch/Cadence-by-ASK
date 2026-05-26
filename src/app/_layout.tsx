import { Stack } from "expo-router";
import { ConvexProvider, convex } from "../lib/convex";
import { AuthProvider } from "../lib/AuthContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { colors } from "../lib/theme";

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.text, letterSpacing: -0.3 }}>cadence</Text>
        <ActivityIndicator size="small" color={colors.text} style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(student)" />
          <Stack.Screen name="(faculty)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </AuthProvider>
    </ConvexProvider>
  );
}
