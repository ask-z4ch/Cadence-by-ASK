import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles } from "../../lib/theme";

export default function Assignments() {
  const { user } = useAuth();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const submit = useMutation(api.submissions.submit);
  const assignments = useQuery(api.events.list, { type: "assignment" });
  const submissions = useQuery(api.submissions.listByStudent, { studentId: user!.userId as any });

  const handleSubmit = async (id: string) => {
    setSubmittingId(id);
    try {
      await submit({ eventId: id as any, studentId: user!.userId as any, fileUrl: "submission.pdf" });
      Alert.alert("", "Assignment submitted.");
    } catch (e: any) {
      Alert.alert("", e.message || "Submission failed.");
    } finally {
      setSubmittingId(null);
    }
  };

  const status = (eventId: string) => (submissions ?? []).find((s: any) => s.eventId === eventId);

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={typography.h1}>assignments</Text>
        <Text style={[typography.small, { marginTop: 4 }]}>track and submit your work</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {(assignments ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 48 }]}>
            no assignments yet
          </Text>
        )}
        {(assignments ?? []).map((event: any) => {
          const sub = status(event._id);
          return (
            <View key={event._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 12 }]}>
              <Text style={typography.h3}>{event.title}</Text>
              {event.description && (
                <Text style={[typography.small, { marginTop: 6 }]}>{event.description}</Text>
              )}
              <Text style={[typography.small, { marginTop: 8, color: colors.error, fontWeight: "600" }]}>
                due {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </Text>
              {event.marksWeightage && (
                <Text style={[typography.small, { color: colors.accent, fontWeight: "600", marginTop: 2 }]}>
                  {event.marksWeightage}% weightage
                </Text>
              )}
              <View style={{ height: 2, backgroundColor: colors.muted, marginVertical: 12 }} />
              {sub ? (
                <View style={[sharedStyles.badge, {
                  backgroundColor: sub.status === "graded" ? colors.success : sub.status === "submitted" ? colors.warning : colors.muted,
                  alignSelf: "flex-start",
                  borderColor: sub.status === "graded" ? colors.success : sub.status === "submitted" ? colors.warning : colors.muted,
                }]}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: colors.surface }}>
                    {sub.status === "graded" ? `graded ${sub.marks}/100` : sub.status === "submitted" ? "submitted" : "pending"}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[sharedStyles.button, submittingId === event._id && { opacity: 0.5 }]}
                  onPress={() => handleSubmit(event._id)}
                  disabled={submittingId === event._id}
                >
                  <Text style={sharedStyles.buttonText}>
                    {submittingId === event._id ? "submitting..." : "submit"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
