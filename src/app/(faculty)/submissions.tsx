import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles } from "../../lib/theme";

export default function FacultySubmissions() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const events = useQuery(api.events.list, { type: "assignment" });
  const submissions = selected ? useQuery(api.submissions.listByEvent, { eventId: selected as any }) : [];
  const grade = useMutation(api.submissions.grade);

  const handleGrade = async (id: string) => {
    try {
      await grade({ submissionId: id as any, marks: 85, gradedBy: user!.userId as any });
      Alert.alert("", "Graded 85/100.");
    } catch (e: any) {
      Alert.alert("", e.message || "Grading failed.");
    }
  };

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>submissions</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>review student work</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, marginBottom: 16 }}>
        {(events ?? []).map((e: any) => (
          <TouchableOpacity
            key={e._id}
            onPress={() => setSelected(e._id)}
            style={{
              paddingHorizontal: 16, paddingVertical: 10, marginRight: 8,
              borderWidth: 2, borderColor: selected === e._id ? colors.accent : colors.border,
              backgroundColor: selected === e._id ? colors.accent : colors.surface,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: selected === e._id ? colors.surface : colors.text }}>
              {e.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {selected && (submissions ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no submissions yet
          </Text>
        )}
        {(submissions ?? []).map((s: any) => (
          <View key={s._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 10 }]}>
            <Text style={[typography.small, { fontWeight: "600" }]}>student: {s.studentId}</Text>
            <Text style={[typography.small, { marginTop: 4 }]}>
              submitted {new Date(s.submittedAt).toLocaleDateString()}
            </Text>
            <View style={[sharedStyles.badge, {
              alignSelf: "flex-start", marginTop: 8,
              backgroundColor: s.status === "graded" ? colors.success : s.status === "submitted" ? colors.warning : colors.muted,
              borderColor: s.status === "graded" ? colors.success : s.status === "submitted" ? colors.warning : colors.muted,
            }]}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: colors.surface }}>
                {s.status === "graded" ? `${s.marks}/100` : s.status}
              </Text>
            </View>
            {s.status === "submitted" && (
              <TouchableOpacity
                style={[sharedStyles.button, { marginTop: 10, backgroundColor: colors.success, paddingVertical: 10 }]}
                onPress={() => handleGrade(s._id)}
              >
                <Text style={sharedStyles.buttonText}>grade 85%</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
