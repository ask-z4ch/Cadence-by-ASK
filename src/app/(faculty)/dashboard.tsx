import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { router } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles } from "../../lib/theme";

const links = [
  { label: "assessments", route: "/(faculty)/assessments" },
  { label: "schedule", route: "/(faculty)/calendar" },
  { label: "submissions", route: "/(faculty)/submissions" },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const clashes = useQuery(api.clashes.list, { resolved: false });

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>faculty</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>hello, {user?.name}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 24 }}>
        {links.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => router.push(item.route as any)}
            style={{ flex: 1, paddingVertical: 12, alignItems: "center", borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text, letterSpacing: 0.3 }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={typography.label}>conflicts</Text>
        <View style={{ width: 24, height: 2, backgroundColor: colors.border, marginTop: 6 }} />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {(clashes ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no scheduling conflicts
          </Text>
        )}
        {(clashes ?? []).map((clash: any) => (
          <View key={clash._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 12, borderLeftWidth: 4, borderLeftColor: clash.severity === "high" ? colors.error : clash.severity === "medium" ? colors.warning : colors.accentSecondary }]}>
            <Text style={[typography.h3, { color: colors.error }]}>schedule conflict</Text>
            <Text style={[typography.small, { marginTop: 6 }]}>{clash.description}</Text>
            <View style={[sharedStyles.badge, { alignSelf: "flex-start", marginTop: 8, borderColor: colors.border }]}>
              <Text style={{ fontSize: 10, fontWeight: "700", letterSpacing: 0.5 }}>{clash.severity}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
