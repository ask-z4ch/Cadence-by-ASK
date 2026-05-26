import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { router } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles } from "../../lib/theme";

export default function CommandCentre() {
  const { user } = useAuth();
  const clashes = useQuery(api.clashes.list, { resolved: false });
  const events = useQuery(api.events.list, {});
  const resolve = useMutation(api.clashes.resolve);

  const handleResolve = async (id: string) => {
    try { await resolve({ clashId: id as any, resolvedBy: user!.userId as any }); }
    catch { /* */ }
  };

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>command</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>central control</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={[sharedStyles.card, sharedStyles.cardShadow, { flex: 1, alignItems: "center" }]}>
          <Text style={{ fontSize: 36, fontWeight: "800", color: colors.text }}>{events?.length ?? 0}</Text>
          <Text style={[typography.label, { marginTop: 4 }]}>events</Text>
        </View>
        <View style={[sharedStyles.card, sharedStyles.cardShadow, { flex: 1, alignItems: "center" }]}>
          <Text style={{ fontSize: 36, fontWeight: "800", color: colors.error }}>{clashes?.length ?? 0}</Text>
          <Text style={[typography.label, { marginTop: 4 }]}>clashes</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => router.push("/(admin)/events" as any)}
          style={[sharedStyles.buttonSecondary, { flex: 1 }]}
        >
          <Text style={sharedStyles.buttonTextSecondary}>events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(admin)/broadcasts" as any)}
          style={[sharedStyles.buttonSecondary, { flex: 1 }]}
        >
          <Text style={sharedStyles.buttonTextSecondary}>broadcast</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={typography.label}>unresolved clashes</Text>
        <View style={{ width: 24, height: 2, backgroundColor: colors.border, marginTop: 6 }} />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {(clashes ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no clashes
          </Text>
        )}
        {(clashes ?? []).map((c: any) => (
          <View key={c._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 10 }]}>
            <Text style={[typography.small]}>{c.description}</Text>
            <View style={[sharedStyles.badge, { alignSelf: "flex-start", marginTop: 8, marginBottom: 10, backgroundColor: c.severity === "high" ? colors.error : c.severity === "medium" ? colors.warning : colors.accentSecondary, borderColor: c.severity === "high" ? colors.error : c.severity === "medium" ? colors.warning : colors.accentSecondary }]}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: colors.surface }}>{c.severity}</Text>
            </View>
            <TouchableOpacity style={[sharedStyles.button, { backgroundColor: colors.success, paddingVertical: 10 }]} onPress={() => handleResolve(c._id)}>
              <Text style={sharedStyles.buttonText}>resolve</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
