import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles } from "../../lib/theme";

export default function Notifications() {
  const { user } = useAuth();
  const notifications = useQuery(api.notifications.listByUser, {
    userId: user!.userId as any,
    unreadOnly: false,
  });
  const markRead = useMutation(api.notifications.markRead);

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>alerts</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>notifications and updates</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {(notifications ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no notifications
          </Text>
        )}
        {(notifications ?? []).map((n: any) => (
          <TouchableOpacity
            key={n._id}
            onPress={() => markRead({ notificationId: n._id })}
            style={[
              sharedStyles.card,
              sharedStyles.cardShadow,
              { marginBottom: 10, borderLeftWidth: 4, borderLeftColor: n.read ? colors.muted : colors.accent },
            ]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Text style={[typography.h3, { flex: 1 }]}>{n.title}</Text>
              {!n.read && <View style={{ width: 8, height: 8, backgroundColor: colors.accent }} />}
            </View>
            <Text style={[typography.small, { marginTop: 6 }]}>{n.message}</Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>
              {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
