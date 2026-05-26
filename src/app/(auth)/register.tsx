import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { router } from "expo-router";
import { colors, sharedStyles } from "../../lib/theme";

const ROLES = ["student", "faculty", "admin"] as const;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "faculty" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const register = useMutation(api.auth.register);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("", "All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password, role });
      Alert.alert("", "Account created. Sign in.", [{ text: "ok", onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert("", e.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: "center" }}>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", color: colors.text, letterSpacing: -0.4 }}>
          create account
        </Text>
        <View style={{ width: 32, height: 3, backgroundColor: colors.accent, marginTop: 8 }} />
      </View>

      <TextInput
        style={[sharedStyles.input, { marginBottom: 12 }]}
        placeholder="full name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[sharedStyles.input, { marginBottom: 12 }]}
        placeholder="email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[sharedStyles.input, { marginBottom: 20 }]}
        placeholder="password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
        role
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 28 }}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRole(r)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              borderWidth: 2,
              borderColor: role === r ? colors.accent : colors.border,
              backgroundColor: role === r ? colors.accent : colors.surface,
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: "700",
              color: role === r ? colors.surface : colors.text,
              letterSpacing: 0.3,
            }}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[sharedStyles.button, loading && { opacity: 0.5 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={sharedStyles.buttonText}>{loading ? "creating..." : "create account"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.back()}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, textAlign: "center" }}>
          already have an account? sign in
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
