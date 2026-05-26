import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { router } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles, getEventColor, getEventLabel } from "../../lib/theme";

const quickLinks = [
  { label: "calendar", route: "/(student)/calendar" },
  { label: "assignments", route: "/(student)/assignments" },
  { label: "alerts", route: "/(student)/notifications" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const events = useQuery(api.priority.getPriorityFeed, {
    userId: user!.userId as any,
    limit: 20,
  });

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>dashboard</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>
          {events ? `${events.length} items` : "-"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 24 }}>
        {quickLinks.map((item) => (
          <TouchableIndicator
            key={item.label}
            label={item.label}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={typography.label}>priority feed</Text>
        <View style={{ width: 24, height: 2, backgroundColor: colors.border, marginTop: 6 }} />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {(events ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no upcoming items
          </Text>
        )}
        {(events ?? []).map((event: any, i: number) => (
          <View key={event._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 12 }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Text style={typography.h3}>{event.title}</Text>
              <View style={[sharedStyles.badge, { backgroundColor: getEventColor(event.type), borderColor: getEventColor(event.type) }]}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: colors.surface, letterSpacing: 0.5 }}>
                  {getEventLabel(event.type)}
                </Text>
              </View>
            </View>
            <Text style={[typography.small, { marginTop: 8 }]}>
              {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {" \u00B7 "}
              {event.daysRemaining > 0 ? `${Math.round(event.daysRemaining)}d remaining` : "overdue"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, gap: 8 }}>
              <View style={{ flex: 1, height: 6, backgroundColor: colors.muted }}>
                <View style={{
                  width: `${Math.min((event.priority || 0) * 8, 100)}%`,
                  height: "100%",
                  backgroundColor: colors.accent,
                }} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.accent }}>
                {event.priority?.toFixed(1) ?? "-"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function TouchableIndicator({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text, letterSpacing: 0.3 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
