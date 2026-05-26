import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { router } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { colors, border, shadows, sharedStyles } from "../../lib/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useMutation(api.auth.login);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("", "All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const user = await login({ email, password });
      signIn({ userId: user.userId, name: user.name, email: user.email, role: user.role });
      const route = user.role === "student" ? "/(student)/dashboard"
        : user.role === "faculty" ? "/(faculty)/dashboard"
        : "/(admin)/command-centre";
      router.replace(route);
    } catch (e: any) {
      Alert.alert("", e.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[sharedStyles.screen, { justifyContent: "center", padding: 24 }]}>
      <View style={{ marginBottom: 40 }}>
        <Text style={{ fontSize: 42, fontWeight: "800", color: colors.text, letterSpacing: -0.5 }}>
          cadence
        </Text>
        <View style={{ width: 40, height: 3, backgroundColor: colors.accent, marginTop: 8 }} />
      </View>

      <TextInput
        style={[sharedStyles.input, { marginBottom: 14 }]}
        placeholder="email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[sharedStyles.input, { marginBottom: 24 }]}
        placeholder="password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[sharedStyles.button, loading && { opacity: 0.5 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={sharedStyles.buttonText}>{loading ? "signing in..." : "sign in"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[sharedStyles.buttonSecondary, { marginTop: 12 }]}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={sharedStyles.buttonTextSecondary}>create account</Text>
      </TouchableOpacity>
    </View>
  );
}
