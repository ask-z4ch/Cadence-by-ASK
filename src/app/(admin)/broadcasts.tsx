import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles } from "../../lib/theme";

export default function Broadcasts() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "student" | "faculty">("all");
  const [sending, setSending] = useState(false);

  const broadcast = useMutation(api.notifications.broadcast);
  const users = useQuery(api.users.list, {});
  const notifications = useQuery(api.notifications.listByUser, { userId: user!.userId as any });

  const handleSend = async () => {
    if (!title || !message) { Alert.alert("", "Title and message required."); return; }
    setSending(true);
    try {
      const filtered = (users ?? []).filter((u: any) => target === "all" || u.role === target);
      await broadcast({ title, message, userIds: filtered.map((u: any) => u._id) });
      Alert.alert("", `Sent to ${filtered.length} recipients.`);
      setTitle(""); setMessage("");
    } catch (e: any) {
      Alert.alert("", e.message || "Failed.");
    } finally { setSending(false); }
  };

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>broadcast</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>send announcements</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 24 }]}>
          <TextInput style={[sharedStyles.input, { marginBottom: 10 }]} placeholder="title" placeholderTextColor={colors.textSecondary} value={title} onChangeText={setTitle} />
          <TextInput style={[sharedStyles.input, { marginBottom: 10, height: 80 }]} placeholder="message" placeholderTextColor={colors.textSecondary} value={message} onChangeText={setMessage} multiline />
          <Text style={[typography.label, { marginBottom: 8 }]}>audience</Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
            {(["all", "student", "faculty"] as const).map((r) => (
              <TouchableOpacity key={r} onPress={() => setTarget(r)}
                style={{ flex: 1, paddingVertical: 10, alignItems: "center", borderWidth: 2, borderColor: target === r ? colors.accent : colors.border, backgroundColor: target === r ? colors.accent : colors.surface }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: target === r ? colors.surface : colors.text, letterSpacing: 0.3 }}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[sharedStyles.button, sending && { opacity: 0.5 }]} onPress={handleSend} disabled={sending}>
            <Text style={sharedStyles.buttonText}>{sending ? "sending..." : "send"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[typography.label, { marginBottom: 10 }]}>recent</Text>
        {(notifications ?? []).slice(0, 10).map((n: any) => (
          <View key={n._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 8, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
            <Text style={[typography.h3, { fontSize: 14 }]}>{n.title}</Text>
            <Text style={[typography.small, { marginTop: 4 }]}>{n.message}</Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>
              {new Date(n.createdAt).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
