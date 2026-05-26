import { View, Text, ScrollView } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { colors, typography, sharedStyles, getEventColor, getEventLabel } from "../../lib/theme";

export default function FacultyCalendar() {
  const events = useQuery(api.events.list, {});

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>schedule</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>department view</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {(events ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no events
          </Text>
        )}
        {(events ?? []).map((e: any) => (
          <View key={e._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 10, flexDirection: "row", padding: 0, overflow: "hidden" }]}>
            <View style={{ width: 5, backgroundColor: getEventColor(e.type) }} />
            <View style={{ flex: 1, padding: 14 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Text style={typography.h3}>{e.title}</Text>
                <View style={[sharedStyles.badge, { borderColor: getEventColor(e.type), backgroundColor: getEventColor(e.type) }]}>
                  <Text style={{ fontSize: 9, fontWeight: "700", color: colors.surface, letterSpacing: 0.3 }}>{getEventLabel(e.type)}</Text>
                </View>
              </View>
              <Text style={[typography.small]}>
                {new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.accent, marginTop: 4 }}>
                {new Date(e.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                {" \u2014 "}
                {new Date(e.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
