import { View, Text, ScrollView } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../lib/AuthContext";
import { colors, typography, sharedStyles, getEventColor, getEventLabel } from "../lib/theme";

type Props = { limit?: number };

export default function PriorityFeed({ limit = 20 }: Props) {
  const { user } = useAuth();
  const events = useQuery(api.priority.getPriorityFeed, { userId: user!.userId as any, limit });

  return (
    <View style={{ flex: 1 }}>
      <Text style={[typography.label, { marginBottom: 12 }]}>priority feed</Text>
      <ScrollView>
        {(events ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 32 }]}>empty</Text>
        )}
        {(events ?? []).map((event: any, i: number) => (
          <View key={event._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 10 }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <View style={{ width: 24, height: 24, backgroundColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 11, fontWeight: "800", color: colors.surface }}>{i + 1}</Text>
              </View>
              <View style={[sharedStyles.badge, { backgroundColor: getEventColor(event.type), borderColor: getEventColor(event.type) }]}>
                <Text style={{ fontSize: 9, fontWeight: "700", color: colors.surface, letterSpacing: 0.3 }}>{getEventLabel(event.type)}</Text>
              </View>
            </View>
            <Text style={typography.h3}>{event.title}</Text>
            <Text style={[typography.small, { marginTop: 4 }]}>
              {new Date(event.date).toLocaleDateString()} {event.daysRemaining > 0 ? `\u00B7 ${event.daysRemaining}d` : "\u00B7 overdue"}
            </Text>
            <View style={{ height: 4, backgroundColor: colors.muted, marginTop: 10 }}>
              <View style={{ width: `${Math.min((event.priority || 0) * 8, 100)}%`, height: "100%", backgroundColor: colors.accent }} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
