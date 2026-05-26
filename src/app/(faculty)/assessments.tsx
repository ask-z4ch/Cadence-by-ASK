import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../lib/AuthContext";
import { colors, typography, sharedStyles } from "../../lib/theme";

const TYPES = ["exam", "assignment", "class"] as const;

export default function Assessments() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState<"exam" | "assignment" | "class">("assignment");
  const [weight, setWeight] = useState("");
  const [showForm, setShowForm] = useState(false);

  const create = useMutation(api.events.create);
  const events = useQuery(api.events.list, {});

  const handleCreate = async () => {
    if (!title || !date || !start || !end) {
      Alert.alert("", "Title, date, start and end time required.");
      return;
    }
    try {
      const r = await create({
        title, description: desc || undefined, type,
        date: new Date(date).getTime(),
        startTime: new Date(`1970-01-01T${start}`).getTime(),
        endTime: new Date(`1970-01-01T${end}`).getTime(),
        marksWeightage: weight ? parseInt(weight) : undefined,
        createdBy: user!.userId as any, batchIds: [],
      });
      Alert.alert("", r.clashesFound > 0 ? `created with ${r.clashesFound} clash(es)` : "assessment created");
      setTitle(""); setDesc(""); setDate(""); setStart(""); setEnd(""); setWeight(""); setShowForm(false);
    } catch (e: any) {
      Alert.alert("", e.message || "Failed.");
    }
  };

  return (
    <View style={sharedStyles.screen}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Text style={typography.h1}>assessments</Text>
          <Text style={[typography.small, { marginTop: 4 }]}>create and manage</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowForm(!showForm)}
          style={[sharedStyles.button, { paddingHorizontal: 16, paddingVertical: 10 }]}
        >
          <Text style={[sharedStyles.buttonText, { fontSize: 13 }]}>{showForm ? "cancel" : "+ new"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {showForm && (
          <View style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 20 }]}>
            <TextInput style={[sharedStyles.input, { marginBottom: 10 }]} placeholder="title" placeholderTextColor={colors.textSecondary} value={title} onChangeText={setTitle} />
            <TextInput style={[sharedStyles.input, { marginBottom: 10, height: 60 }]} placeholder="description (optional)" placeholderTextColor={colors.textSecondary} value={desc} onChangeText={setDesc} multiline />
            <TextInput style={[sharedStyles.input, { marginBottom: 10 }]} placeholder="date (YYYY-MM-DD)" placeholderTextColor={colors.textSecondary} value={date} onChangeText={setDate} />
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
              <TextInput style={[sharedStyles.input, { flex: 1 }]} placeholder="start (HH:MM)" placeholderTextColor={colors.textSecondary} value={start} onChangeText={setStart} />
              <TextInput style={[sharedStyles.input, { flex: 1 }]} placeholder="end (HH:MM)" placeholderTextColor={colors.textSecondary} value={end} onChangeText={setEnd} />
            </View>
            <Text style={[typography.label, { marginBottom: 8 }]}>type</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              {TYPES.map((t) => (
                <TouchableOpacity key={t} onPress={() => setType(t)} style={{ flex: 1, paddingVertical: 10, alignItems: "center", borderWidth: 2, borderColor: type === t ? colors.accent : colors.border, backgroundColor: type === t ? colors.accent : colors.surface }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: type === t ? colors.surface : colors.text, letterSpacing: 0.3 }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={[sharedStyles.input, { marginBottom: 16 }]} placeholder="weightage % (optional)" placeholderTextColor={colors.textSecondary} value={weight} onChangeText={setWeight} keyboardType="numeric" />
            <TouchableOpacity style={sharedStyles.button} onPress={handleCreate}>
              <Text style={sharedStyles.buttonText}>create assessment</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[typography.label, { marginBottom: 10 }]}>your assessments</Text>
        {(events ?? []).length === 0 && (
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center", marginTop: 32 }]}>none yet</Text>
        )}
        {(events ?? []).map((e: any) => (
          <View key={e._id} style={[sharedStyles.card, sharedStyles.cardShadow, { marginBottom: 10 }]}>
            <Text style={typography.h3}>{e.title}</Text>
            <Text style={[typography.small, { marginTop: 4 }]}>{new Date(e.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
