import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { colors, typography, sharedStyles, getEventColor, getEventLabel } from "../../lib/theme";

export default function AdminEvents() {
  const events = useQuery(api.events.list, {});
  const remove = useMutation(api.events.remove);

  const handleDelete = (id: string) => {
    Alert.alert("", "Delete this event?", [
      { text: "cancel", style: "cancel" },
      { text: "delete", style: "destructive", onPress: () => remove({ eventId: id as any }) },
    ]);
  };

  const grouped: Record<string, any[]> = {};
  (events ?? []).forEach((e: any) => {
    if (!grouped[e.type]) grouped[e.type] = [];
    grouped[e.type].push(e);
  });

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>events</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>manage university events</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {Object.entries(grouped).map(([type, items]) => (
          <View key={type} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <View style={{ width: 10, height: 10, backgroundColor: getEventColor(type) }} />
              <Text style={[typography.label, { color: getEventColor(type) }]}>{getEventLabel(type)}</Text>
              <Text style={[typography.small]}>({items.length})</Text>
            </View>
            {items.map((e: any) => (
              <View key={e._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.h3, { fontSize: 15 }]}>{e.title}</Text>
                  <Text style={[typography.small, { marginTop: 2 }]}>{new Date(e.date).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(e._id)} style={{ padding: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.error }}>remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
