import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { colors, typography, sharedStyles, getEventColor, getEventLabel } from "../../lib/theme";

export default function StudentCalendar() {
  const events = useQuery(api.events.list, {});

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>calendar</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>your schedule</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {(events ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no events scheduled
          </Text>
        )}
        {(events ?? []).map((event: any) => {
          const date = new Date(event.date);
          return (
            <View key={event._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 12, flexDirection: "row", padding: 0 }]}>
              <View style={{
                width: 60,
                alignItems: "center",
                justifyContent: "center",
                borderRightWidth: 2,
                borderRightColor: colors.border,
                paddingVertical: 16,
              }}>
                <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, letterSpacing: -0.5 }}>
                  {date.getDate()}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.5, marginTop: 2 }}>
                  {date.toLocaleString("en-US", { month: "short" }).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, padding: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <View style={{ width: 8, height: 8, backgroundColor: getEventColor(event.type) }} />
                  <Text style={{ fontSize: 11, fontWeight: "700", color: getEventColor(event.type), letterSpacing: 0.3 }}>
                    {getEventLabel(event.type)}
                  </Text>
                </View>
                <Text style={typography.h3}>{event.title}</Text>
                <Text style={[typography.small, { marginTop: 4 }]}>
                  {new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  {" \u2014 "}
                  {new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
